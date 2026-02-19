import express from 'express'
const userRouter = express.Router()
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '../middlewares/users.middlewares'
import { loginController, logoutController, registerController } from '../controllers/users.controllers'
import { wrapAsync } from '../utils/handlers'
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
userRouter.post('/login', loginValidator, wrapAsync(loginController))

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
userRouter.post('/register', registerValidator, wrapAsync(registerController))

/**
 * @openapi
 * /user/logout:
 *   post:
 *     summary: Đăng xuất tài khoản
 *     description: Đăng xuất người dùng bằng cách thu hồi access token và refresh token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 description: Refresh token của người dùng
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *       401:
 *         description: Không hợp lệ hoặc thiếu token xác thực
 */
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))
export default userRouter
