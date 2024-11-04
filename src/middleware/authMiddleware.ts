import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token not provided' });

    jwt.verify(token, JWT_SECRET!, (err: any, decoded: any) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });

        req.body.id = decoded.id;
        next();
    });
};

export default authMiddleware;