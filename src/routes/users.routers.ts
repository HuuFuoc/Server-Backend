import express from 'express'
const userRouter = express.Router()
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '../middlewares/users.middlewares'
import {
  changePasswordController,
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
 *     tags:
 *       - Auth
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
 *     tags:
 *       - Auth
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
 *     tags:
 *       - Auth
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
 *     tags:
 *       - Auth
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
/**
 * @openapi
 * /user/change-password:
 *   put:
 *     summary: Đổi mật khẩu
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               old_password:
 *                 type: string
 *               new_password:
 *                 type: string
 *               confirm_new_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *       401:
 *         description: Không hợp lệ hoặc chưa đăng nhập
 *       422:
 *         description: Dữ liệu không hợp lệ
 */
userRouter.put('/change-password', accessTokenValidator, changePasswordValidator, wrapAsync(changePasswordController))
export default userRouter
