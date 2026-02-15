import express from 'express'
const userRouter = express.Router()
import { loginValidation, registerValidation } from '../middlewares/users.middlewares'
import { loginController, registerController } from '../controllers/users.controllers'

// ...existing code...
/**
 * @openapi
 * /user/login:
 *   post:
 *     summary: Đăng nhập
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */
userRouter.post('/login', loginValidation, loginController)

/**
 * @openapi
 * /user/register:
 *   post:
 *     summary: Đăng ký tài khoản
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirm_password:
 *                 type: string
 *               date_of_birth:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 */
userRouter.post('/register', registerValidation, registerController)
// ...existing code...
export default userRouter
