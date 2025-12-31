import { Test, TestingModule } from '@nestjs/testing';
import { AuthRestApiService } from './auth-rest-api.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User, RefreshToken } from '../common/entities';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';

describe('AuthRestApiService', () => {
  let service: AuthRestApiService;
  let userRepository;
  let refreshTokenRepository;
  let jwtService: JwtService;

  // Mock Data
  const mockUser = {
    id: 'user-uuid',
    username: 'testuser',
    password: 'hashedPassword',
    role: 'admin',
  };

  const mockPostLoginDto = {
    username: 'testuser',
    password: 'password123',
  };

  const mockRequest = {
    headers: { 'user-agent': 'test-agent' },
  } as unknown as Request;

  const mockResponse = {
    cookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRestApiService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('secret'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthRestApiService>(AuthRestApiService);
    userRepository = module.get(getRepositoryToken(User));
    refreshTokenRepository = module.get(getRepositoryToken(RefreshToken));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('postLogin', () => {
    it('should login successfully and return tokens', async () => {
      // Mocking step by step
      userRepository.findOne.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve('hashed_refresh_token'));

      const result = await service.postLogin(
        mockRequest,
        mockResponse,
        mockPostLoginDto,
      );

      expect(userRepository.findOne).toHaveBeenCalled();
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refresh_token',
        expect.any(String),
        expect.any(Object),
      );
      expect(result.data).toHaveProperty('access_token');
      expect(result.message).toBe('Successfully login');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(
        service.postLogin(mockRequest, mockResponse, mockPostLoginDto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password invalid', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(
        service.postLogin(mockRequest, mockResponse, mockPostLoginDto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      userRepository.findOne.mockRejectedValue(new Error('DB Crash'));

      await expect(
        service.postLogin(mockRequest, mockResponse, mockPostLoginDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
