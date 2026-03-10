import express from 'express'
const userRouter = express.Router()
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  updateMeValidator
} from '../middlewares/users.middlewares'
import {
  changePasswordController,
  emailVerifyController,
  getMeController,
  loginController,
  logoutController,
  registerController,
  updateMeController
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

/**
 * @openapi
 * /user/get-me:
 *   post:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get me successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64f1a2b3c4d5e6f7a8b9c0d1
 *                     name:
 *                       type: string
 *                       example: Nguyen Van A
 *                     email:
 *                       type: string
 *                       example: nguyenvana@example.com
 *                     date_of_birth:
 *                       type: string
 *                       format: date-time
 *                     bio:
 *                       type: string
 *                     location:
 *                       type: string
 *                     website:
 *                       type: string
 *                     username:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     cover_photo:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [Admin, User, Collector]
 *                     verify:
 *                       type: number
 *                       example: 1
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 */
userRouter.post('/get-me', accessTokenValidator, wrapAsync(getMeController))

/**
 * @openapi
 * /user/update-me:
 *   put:
 *     summary: Cập nhật thông tin người dùng hiện tại
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 example: Nguyen Van B
 *               date_of_birth:
 *                 type: string
 *                 format: date-time
 *                 example: 2000-01-15T00:00:00.000Z
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Update me successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     date_of_birth:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       422:
 *         description: Dữ liệu không hợp lệ
 */
userRouter.put('/update-me', accessTokenValidator, updateMeValidator, wrapAsync(updateMeController))


export default userRouter
