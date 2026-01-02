import {
  Injectable,
  UnauthorizedException,
  Logger,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as dto from './dto';
import { User, RefreshToken } from '../common/entities';

@Injectable()
export class AuthRestApiService {
  private readonly logger = new Logger(AuthRestApiService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async postLogin(req: Request, res: Response, body: dto.PostLoginBodyDto) {
    try {
      // Check if the username exists
      const user = await this.userRepository.findOne({
        select: { id: true, password: true, role: true },
        where: [{ username: body.username }],
      });
      if (!user) {
        this.logger.warn(`Login failure: User ${body.username} not found`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if the password is valid
      const isPasswordValid = await bcrypt.compare(
        body.password,
        user.password,
      );
      if (!isPasswordValid) {
        this.logger.warn(`Login failure: Wrong password for ${body.username}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate JWT access token and refresh token
      const accessPayload = {
        sub: user.id,
        role: user.role,
        type: 'access',
      };
      const accessToken = this.jwtService.sign(accessPayload, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: '15m',
      });

      const refreshTokenId = uuidv4();
      const refreshPayload = {
        sub: user.id,
        jti: refreshTokenId,
        type: 'refresh',
      };
      const refreshToken = this.jwtService.sign(refreshPayload, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      });

      // Store hashed refresh token in the database
      const salt = await bcrypt.genSalt(10);
      const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
      await this.refreshTokenRepository.save({
        id: refreshTokenId,
        user_id: user.id,
        token_hash: hashedRefreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        device_info: req.headers['user-agent'] ?? 'unknown',
      });

      this.logger.log(`Login success: ${body.username} has been logged in`);

      // Set refresh token in cookie
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: 'api/v1/auth/refresh',
      });

      // Send response
      return {
        message: 'Successfully login',
        data: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Login System Error: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to login, please try again later',
      );
    }
  }

  async postRefresh(req: Request, res: Response) {
    try {
      // Check if the refresh token exists
      const refreshToken = req.cookies['refresh_token'];
      if (!refreshToken) {
        this.logger.warn(`Refresh failure: Refresh token not found in cookies`);
        throw new UnauthorizedException('Refresh token not found');
      }

      // Verify and decode the refresh token
      let refreshTokenPayload = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });
      if (
        !refreshTokenPayload.sub ||
        !refreshTokenPayload.jti ||
        refreshTokenPayload.type !== 'refresh'
      ) {
        this.logger.warn(`Refresh failure: Refresh token payload invalid`);
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check if the refresh token is revoked or invalid
      const storedRefreshToken = await this.refreshTokenRepository.findOne({
        where: { id: refreshTokenPayload.jti },
      });
      if (!storedRefreshToken || storedRefreshToken.revoked_at) {
        this.logger.warn(`Refresh failure: Refresh token revoked`);
        throw new UnauthorizedException('Refresh token revoked');
      }

      // Check if the refresh token matches the stored hash
      const isRefeshTokenValid = await bcrypt.compare(
        refreshToken,
        storedRefreshToken.token_hash,
      );
      if (!isRefeshTokenValid) {
        this.logger.warn(`Refresh failure: Refresh token invalid to compare`);
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Revoke the old refresh token
      storedRefreshToken.revoked_at = new Date();
      await this.refreshTokenRepository.save(storedRefreshToken);

      // Generate new JWT access token and refresh token
      const userRole = await this.userRepository.findOne({
        select: { role: true },
        where: { id: refreshTokenPayload.sub },
      });
      const newAccessTokenPayload = {
        sub: refreshTokenPayload.sub,
        role: userRole,
        type: 'access',
      };
      const newAccessToken = this.jwtService.sign(newAccessTokenPayload, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: '15m',
      });

      const newRefreshTokenId = uuidv4();
      const newRefreshTokenPayload = {
        sub: refreshTokenPayload.sub,
        jti: newRefreshTokenId,
        type: 'refresh',
      };
      const newRefreshToken = this.jwtService.sign(newRefreshTokenPayload, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      });

      // Store hashed refresh token in the database
      const salt = await bcrypt.genSalt(10);
      const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, salt);
      await this.refreshTokenRepository.save({
        id: newRefreshTokenId,
        user_id: refreshTokenPayload.sub,
        token_hash: hashedNewRefreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        device_info: req.headers['user-agent'] ?? 'unknown',
      });

      this.logger.log(
        `Refresh success: Token refreshed for user ID ${refreshTokenPayload.sub}`,
      );

      // Set new refresh token in cookie
      res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: 'api/v1/auth/refresh',
      });

      // Send response
      return {
        message: 'Successfully refreshed token',
        data: {
          access_token: newAccessToken,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Refresh System Error: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to refresh, please try again later',
      );
    }
  }

  async postLogout(req: Request, res: Response) {
    try {
      // Check if the refresh token exists
      const refreshToken = req.cookies?.['refresh_token'];
      if (!refreshToken) {
        return {
          message: 'Already logged out',
        };
      }

      // Verify and decode the refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });
      if (!payload.sub || !payload.jti || payload.type !== 'refresh') {
        this.logger.warn(
          `Logout failure: Refresh token payload invalid payload`,
        );
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Revoke the refresh token in the database
      const storedToken = await this.refreshTokenRepository.findOne({
        where: { id: payload.jti },
      });
      if (storedToken && !storedToken.revoked_at) {
        storedToken.revoked_at = new Date();
        await this.refreshTokenRepository.save(storedToken);
      }

      this.logger.log(
        `Logout success: Refresh token revoked for user ID ${payload.sub}`,
      );

      // Clear the refresh token cookie
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: 'api/v1/auth/refresh',
      });

      // Send response
      return {
        message: 'Successfully logout',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Logout System Error: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to logout, please try again later',
      );
    }
  }

  async getProfile(id: string) {
    try {
      // Check if the user exists
      const user = await this.userRepository.findOne({
        select: { username: true, role: true },
        where: { id },
      });
      if (!user) {
        this.logger.warn(`Get profile failure: User not found, by id: ${id}`);
        throw new UnauthorizedException('User not found');
      }

      this.logger.log(
        `Get profile success: User profile retrieved, by id: ${id}`,
      );
      return {
        message: 'Successfully get profile',
        data: {
          user: {
            username: user.username,
            role: user.role,
          },
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Get profile System Error: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to get profile, please try again later',
      );
    }
  }

  async patchUsername(id: string, body: dto.PatchUsernameBodyDto) {
    try {
      // Check if the user exists
      const existingUser = await this.userRepository.findOne({
        where: { id },
      });
      if (!existingUser) {
        this.logger.warn(`Patch username failure: User not found by id: ${id}`);
        throw new UnauthorizedException('User not found');
      }

      // Check if the new username is different
      if (existingUser.username !== body.username) {
        // Check if the new username is already taken
        const isUsernameTaken = await this.userRepository.findOne({
          select: { id: true },
          where: { username: body.username },
        });

        // If taken, throw conflict exception
        if (isUsernameTaken) {
          this.logger.warn(
            `Patch username failure: ${body.username} already taken`,
          );
          throw new ConflictException('Username is already taken');
        }

        // Update the username
        existingUser.username = body.username;
        await this.userRepository.save(existingUser);
      }

      this.logger.log(
        `Patch username success: Username updated for user id: ${id}`,
      );
      return {
        message: 'Successfully updated username',
        data: {
          user: {
            username: existingUser.username,
          },
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Patch username System Error: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to update username, please try again later',
      );
    }
  }

  async patchPassword(id: string, body: dto.PatchPasswordBodyDto) {
    try {
      // Check if the user exists
      const user = await this.userRepository.findOne({
        select: { password: true },
        where: { id },
      });
      if (!user) {
        this.logger.warn(`Patch password failure: User not found by id: ${id}`);
        throw new UnauthorizedException('User not found');
      }

      const { old_password, new_password } = body;

      // Check if the old password is valid
      const isPasswordValid = await bcrypt.compare(old_password, user.password);
      if (!isPasswordValid) {
        this.logger.warn(
          `Patch password failure: Incorrect old password by id: ${id}`,
        );
        throw new BadRequestException('Incorrect old password');
      }

      // Update the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(new_password, salt);
      await this.userRepository.update(id, { password: hashedPassword });

      this.logger.log(
        `Patch password success: Password updated for user id: ${id}`,
      );
      return {
        message: 'Successfully updated password',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Patch password System Error: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to update password, please try again later',
      );
    }
  }
}
