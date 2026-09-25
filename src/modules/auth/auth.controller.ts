import {Request, Response} from 'express';
import { loginUser, registerUser } from './auth.service';
import {prisma} from "../../lib/prisma"


//register
export async function register(req: Request, res: Response) {

    try {
         const {token, user} = await registerUser(req.body);
        
         res
         .cookie("umusaare_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
         })
         .status(201).json({
             message: "User registered successfully",
             user,
         });
     } catch (error) { 
         console.error(error)
         
         res.status(400).json({ 
             message: error instanceof Error ? error.message : "Registration failed"
         });
     }
}

//login
export async function login(req: Request, res: Response){
    try{
        const {token, user} = await loginUser(req.body);

        res
        .cookie("umusaare_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
            message: "Login successful",
            user,
        });
    } catch(error){
        console.error(error);

        res.status(401).json({
            message: error instanceof Error ? error.message : "Login failed",
        });
    }
}

export async function getMe(
  req: Request,
  res: Response
) {
  try {
    const authenticatedRequest = req as Request & {
      user?: {
        id: string;
        role: string;
      };
    };

    if (!authenticatedRequest.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: authenticatedRequest.user.id,
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

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to retrieve user",
    });
  }
}

//logout
export async function logout(req: Request, res: Response) {
  res
    .clearCookie("umusaare_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    .status(200)
    .json({
      message: "Logout successful",
    });
}