import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { prisma } from "../../lib/prisma";
import { Role } from "../../../generated/prisma/enums";

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

function getJwtSecret () {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("jwt_secret aint configured");
  }
  return secret
}

//register
export async function registerUser(data: RegisterData) {
  const firstName = data.firstName?.trim();
  const lastName = data.lastName?.trim();
  const email = data.email?.trim().toLowerCase();
  const phone = data.phone?.trim();
  const password = data.password;

  if (!firstName || !lastName || !email || !phone || !password) {
    throw new Error("All registration fields are required");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const token = jwt.sign(
    {
      sub:user.id,
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user
  };
}

//login
export async function loginUser(data: LoginData) {
  const email = data.email?.trim().toLocaleLowerCase();
  const password = data.password;

  if (!email || !password) {
    throw new Error("email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    }
  });

  if(!user){
    throw new Error("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(
    password, user.passwordHash
  );

  if (!passwordMatches){
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
}