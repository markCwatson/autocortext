import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UsersService, { User } from '@/services/UsersService';
import ApiError from '@/errors/ApiError';

class AuthService {
  static async generateToken(
    email: string,
    password: string,
  ): Promise<string | null> {
    const user: User | null = await UsersService.selectByEmail(email);
    if (!user) return null;

    const isCorrectPassword = await AuthService.isCorrectPassword(
      password,
      user.password,
    );
    if (!isCorrectPassword) return null;

    return jwt.sign(
      {
        email: user.email,
      },
      process.env.NEXTAUTH_SECRET!,
      {
        expiresIn: '24h',
        subject: user._id!.toString(),
      },
    );
  }

  static decodeAndVerifyToken(token: string): string | jwt.JwtPayload {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as
        | string
        | jwt.JwtPayload;
      return decoded;
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new ApiError({
          code: 403,
          message: 'Authorization token expired',
          explanation: 'Please log in again',
        });
      }
      throw new ApiError({
        code: 403,
        message: 'Invalid access token',
        explanation: 'Please log in',
      });
    }
  }

  static async geHashedPassword(textPassword: string): Promise<string> {
    return bcrypt.hash(textPassword, 10);
  }

  static async isCorrectPassword(
    textPassword: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(textPassword, hash);
  }

  static getAccountFromLocals(locals: any): User {
    const account = locals['user'];
    if (!account) {
      throw new ApiError({
        code: 401,
        message: 'Unauthorized',
        explanation: 'You must be logged in to perform this action',
      });
    }
    return account;
  }
}

export default AuthService;
