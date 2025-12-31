import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export async function checkToken(
  request: Request,
  jwtService: JwtService,
  logger: Logger,
): Promise<void> {
  // Get token from Authorization header
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    logger.warn('Guard: Token not provided');
    throw new UnauthorizedException('Token not provided');
  }
  const token = authHeader.split(' ')[1];

  // Verify token
  const decoded = jwtService.verify(token);

  // Add id and role to request object
  const { id, role, type } = decoded;
  request = Object.assign(request, { id, role, type });
}
