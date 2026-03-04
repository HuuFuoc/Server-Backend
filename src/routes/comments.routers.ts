import express from 'express'
import { getAllCommentsController, postCommentController } from '../controllers/comments.controllers'
import { postCommentValidator } from '../middlewares/comments.middlewares'
import { accessTokenValidator } from '../middlewares/users.middlewares'
import { wrapAsync } from '../utils/handlers'
const commentRouter = express.Router()

/**
 * @openapi
 * /comments:
 *   get:
 *     summary: Lấy tất cả bình luận
 *     tags:
 *       - Comments
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Không tìm thấy bình luận
 */

commentRouter.get('/', wrapAsync(getAllCommentsController))
/**
 * @openapi
 * /comments:
 *   post:
 *     summary: Tạo bình luận mới
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Nội dung bình luận
 *               rating:
 *                 type: number
 *                 description: Đánh giá (số)
 *               userId:
 *                 type: string
 *                 description: ID người dùng
 *               perfumeId:
 *                 type: string
 *                 description: ID sản phẩm nước hoa
 *             required:
 *               - content
 *               - rating
 *               - userId
 *               - perfumeId
 *     responses:
 *       201:
 *         description: Tạo bình luận thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 */
commentRouter.post('/', accessTokenValidator, postCommentValidator, wrapAsync(postCommentController))

export default commentRouter
