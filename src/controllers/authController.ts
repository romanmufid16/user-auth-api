import { PrismaClient } from '@prisma/client';
import { Request, RequestHandler, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import dotenv from 'dotenv';
dotenv.config();


const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const register = async (req: Request, res: Response): Promise<Response> => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password }: { email: string; password: string } = req.body;
    
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) return res.status(400).json({ error: 'Email is already registered' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });
        return res.status(201).json({
            message: 'User created successfully',
            user
        });
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
};

// export const register = async (req: Request, res: Response) => {
//     const { error } = registerSchema.validate(req.body);
//     if (error) return res.status(400).json({ error: error.details[0].message });

//     const { email, password }: { email: string; password: string } = req.body;
    
//     try {
//         const existingUser = await prisma.user.findUnique({
//             where: { email }
//         })
//         if (existingUser) return res.status(400).json({ error: 'Email is already registered' });
        
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = await prisma.user.create({
//             data: {
//                 email,
//                 password: hashedPassword
//             }
//         });
//         res.status(201).json({
//             message: 'User created successfully',
//             user
//         });
//     } catch (error) {
//         res.status(500).json({ error: (error as Error).message });
//     }
// };

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { email, password }: { email: string; password: string } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(400).json({ error: 'Invalid credentials'});

        const token = jwt.sign({ id: user.id }, JWT_SECRET!, {
            expiresIn: '1h'
        });
        return res.status(200).json({
            message: 'Login successful',
            token
        });
    } catch (error) {
        return res.status(500).json({ error: (error as Error).message });
    }
}
