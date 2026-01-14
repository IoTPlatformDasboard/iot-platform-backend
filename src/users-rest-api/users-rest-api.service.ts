import {
  Injectable,
  Logger,
  InternalServerErrorException,
  HttpException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { UserRole, User } from '../common/entities/user.entity';
import { CreateUserBodyDto } from './dto/create-user.dto';
import { UpdateUserRoleBodyDto } from './dto/update-user-role.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UsersRestApiService {
  private readonly logger = new Logger(UsersRestApiService.name);
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getRoleList() {
    try {
      return {
        message: 'Successfully get role list',
        data: Object.values(UserRole),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to get role list: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to get role list, please try again later',
      );
    }
  }

  async post(postCreateUserBodyDto: CreateUserBodyDto) {
    try {
      // Check if the username is already taken
      const isUsernameTaken = await this.userRepository.findOne({
        select: { id: true },
        where: { username: postCreateUserBodyDto.username },
      });
      if (isUsernameTaken) {
        this.logger.warn(
          `Failed to create user: ${postCreateUserBodyDto.username} already taken`,
        );
        throw new ConflictException('Username is already taken');
      }

      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        postCreateUserBodyDto.password,
        salt,
      );

      // Create a new user
      const id = uuidv4();
      const newUser = this.userRepository.create({
        id,
        username: postCreateUserBodyDto.username,
        password: hashedPassword,
        role: postCreateUserBodyDto.role,
      });
      await this.userRepository.save(newUser);

      return {
        message: 'Successfully create user',
        data: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to create user, please try again later',
      );
    }
  }

  async getList(query: PaginationQueryDto) {
    try {
      const { page = 1, limit = 10 } = query;

      // Calculate skip value for pagination
      const skip = (page - 1) * limit;

      // Fetch users with pagination
      const [users, total] = await this.userRepository.findAndCount({
        select: { id: true, username: true, role: true },
        take: limit,
        skip: skip,
        order: { username: 'ASC' },
      });

      // Calculate last page
      const lastPage = Math.ceil(total / limit);

      return {
        message: 'Successfully get user list',
        data: users,
        meta: {
          total,
          page,
          lastPage,
          limit,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to get user list: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to get user list, please try again later',
      );
    }
  }

  async patchRole(id: string, userId: string, body: UpdateUserRoleBodyDto) {
    try {
      // Check if the user not trying to change their own role
      if (id === userId) {
        this.logger.warn(
          `Failed to update user role: Cannot change your own role`,
        );
        throw new ConflictException('Cannot change your own role');
      }

      // Check if the user exists
      const user = await this.userRepository.findOne({
        select: { id: true, username: true, role: true },
        where: { id: userId },
      });
      if (!user) {
        this.logger.warn(`Failed to update user role: User not found`);
        throw new NotFoundException('User not found');
      }

      // Update the user role
      await this.userRepository.update({ id: userId }, { role: body.role });

      return {
        message: 'Successfully update user role',
        data: {
          id: user.id,
          username: user.username,
          role: body.role,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to update user role: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to update user role, please try again later',
      );
    }
  }

  async delete(id: string, userId: string) {
    try {
      // Check if the user not trying to delete themselves
      if (id === userId) {
        this.logger.warn(`Failed to delete user: Cannot delete yourself`);
        throw new ConflictException('Cannot delete yourself');
      }

      // Check if the user exists
      const user = await this.userRepository.findOne({
        select: { id: true },
        where: { id: userId },
      });
      if (!user) {
        this.logger.warn(`Failed to delete user: User not found`);
        throw new NotFoundException('User not found');
      }

      // Delete the user
      await this.userRepository.delete({ id: userId });

      return {
        message: 'Successfully delete user',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Failed to delete user: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Failed to delete user, please try again later',
      );
    }
  }
}
