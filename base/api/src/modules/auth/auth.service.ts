import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import { RegisterInput, LoginInput } from "./auth.schema";
import { RegisterResponseDto, LoginResponseDto } from "./auth.types";
import { AppError } from "../../middleware/errorHandler";

const SALT_ROUNDS = 10;

export const register = async (
  input: RegisterInput
): Promise<RegisterResponseDto> => {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    const error: AppError = new Error("User with this email already exists");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
};

export const login = async (input: LoginInput): Promise<LoginResponseDto> => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    const error: AppError = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);

  if (!isPasswordValid) {
    const error: AppError = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as string & jwt.SignOptions["expiresIn"],
  });

  return { token };
};
