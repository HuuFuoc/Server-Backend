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
 *         description: Thành công
 *       422:
 *         description: Lỗi dữ liệu
 */
userRouter.post('/login', loginValidator, wrapAsync(loginController))

/**
 * @openapi
 * /user/register:
 *   post:
 *     summary: Đăng ký
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
 *     responses:
 *       201:
 *         description: Thành công
 */
userRouter.post('/register', registerValidator, wrapAsync(registerController))

/**
 * @openapi
 * /user/logout:
 *   post:
 *     summary: Đăng xuất
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refresh_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Thành công
 *       401:
 *         description: Không hợp lệ
 */
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

/**
 * @openapi
 * /user/verify-email:
 *   get:
 *     summary: Xác thực email
 *     parameters:
 *       - in: query
 *         name: email_verify_token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *       422:
 *         description: Token lỗi
 */
userRouter.get('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyController))
export default userRouter
