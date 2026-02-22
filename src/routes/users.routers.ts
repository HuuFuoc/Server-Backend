import express from 'express'
const userRouter = express.Router()
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '../middlewares/users.middlewares'
import {
  emailVerifyController,
  loginController,
  logoutController,
  registerController
} from '../controllers/users.controllers'
import { wrapAsync } from '../utils/handlers'
// ...existing code...
/**
 * @openapi
 * /user/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Đăng nhập
 *     description: Đăng nhập vào hệ thống bằng email và mật khẩu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login success"
 *                 result:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                     refresh_token:
 *                       type: string
 *       422:
 *         description: Dữ liệu không hợp lệ (Email hoặc mật khẩu sai)
 */
userRouter.post('/login', loginValidator, wrapAsync(loginController))

/**
 * @openapi
 * /user/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Đăng ký tài khoản
 *     description: Tạo tài khoản mới với các thông tin cơ bản.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirm_password
 *               - date_of_birth
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123!"
 *               confirm_password:
 *                 type: string
 *                 example: "Password123!"
 *               date_of_birth:
 *                 type: string
 *                 format: date-time
 *                 example: "1990-01-01T00:00:00.000Z"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Register success"
 *                 result:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                     refresh_token:
 *                       type: string
 */
userRouter.post('/register', registerValidator, wrapAsync(registerController))

/**
 * @openapi
 * /user/logout:
 *   post:
 *     tags:
 *       - Users
 *     summary: Đăng xuất
 *     description: Đăng xuất người dùng bằng cách thu hồi access token và refresh token.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refresh_token
 *             properties:
 *               refresh_token:
 *                 type: string
 *                 description: Refresh token của người dùng
 *                 example: "eyJhbGciOiJIUzI1..."
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logout success"
 *       401:
 *         description: Không hợp lệ hoặc thiếu token xác thực
 */
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

/**
 * @openapi
 * /user/verify-email:
 *   get:
 *     tags:
 *       - Users
 *     summary: Xác thực email
 *     description: Xác thực tài khoản người dùng qua token gửi từ email.
 *     parameters:
 *       - in: query
 *         name: email_verify_token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token xác thực email nhận được từ hòm thư
 *     responses:
 *       200:
 *         description: Xác thực thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Verify email success"
 *                 result:
 *                   type: object
 *                   properties:
 *                     access_token:
 *                       type: string
 *                     refresh_token:
 *                       type: string
 *       422:
 *         description: Token không hợp lệ hoặc đã hết hạn
 */
userRouter.get('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyController))
export default userRouter
