import express from 'express'
import {
  createPerfumeController,
  getAllPerfumesController,
  getPerfumeDetailController
} from '~/controllers/perfumes.controllers'
import { postCommentController } from '~/controllers/comments.controllers'
import { postCommentValidator } from '~/middlewares/comments.middlewares'
import { addPerfumeValidator } from '~/middlewares/perfumes.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const perfumeRouter = express.Router()

/**
 * @openapi
 * /perfumes:
 *   get:
 *     summary: Lấy tất cả nước hoa
 *     tags:
 *       - Perfumes
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
 *                 total:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Perfume'
 */
perfumeRouter.get('/', wrapAsync(getAllPerfumesController))

/**
 * @openapi
 * /perfumes:
 *   post:
 *     summary: Thêm nước hoa mới
 *     tags:
 *       - Perfumes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PerfumeReqBody'
 *     responses:
 *       201:
 *         description: Tạo nước hoa thành công
 */
perfumeRouter.post('/', addPerfumeValidator, wrapAsync(createPerfumeController))

/**
 * @openapi
 * /perfumes/{id}:
 *   get:
 *     summary: Lấy chi tiết nước hoa theo id
 *     tags:
 *       - Perfumes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy nước hoa
 */
perfumeRouter.get('/:id', wrapAsync(getPerfumeDetailController))

/**
 * @openapi
 * /perfumes/{id}/comments:
 *   post:
 *     summary: Tạo bình luận cho nước hoa
 *     tags:
 *       - Perfumes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID nước hoa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               rating:
 *                 type: number
 *             required:
 *               - content
 *               - rating
 *     responses:
 *       201:
 *         description: Tạo bình luận thành công
 *       401:
 *         description: Không có quyền truy cập
 */
perfumeRouter.post('/:id/comments', accessTokenValidator, postCommentValidator, wrapAsync(postCommentController))

export default perfumeRouter
