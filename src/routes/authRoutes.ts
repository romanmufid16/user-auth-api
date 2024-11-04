import express from 'express';
import { register, login } from '../controllers/authController';
import asyncHandler from '../middleware/asyncHandler';
import authMiddleware from '../middleware/authMiddleware';


const routes = express.Router();

routes.post('/register', asyncHandler(register));
routes.post('/login', asyncHandler(login));
routes.get('/protected', asyncHandler(authMiddleware), (req, res) => {
    res.json({ message: 'This is a protected route', userId: req.body.userId });
});

export default routes;
