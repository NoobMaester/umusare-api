import {Request, Response} from 'express';
import { registerUser } from './auth.service';

export async function register(req: Request, res: Response) {
    try {
        const user = await registerUser(req.body);
        
        res.status(201).json({
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