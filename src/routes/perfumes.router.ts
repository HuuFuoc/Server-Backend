import express from 'express'
import {
  createPerfumeController,
  deletePerfumeController,
  getAllPerfumesController,
  getPerfumeDetailController,
  updatePerfumeController
} from '../controllers/perfumes.controllers'
import { postCommentController } from '../controllers/comments.controllers'
import { postCommentValidator } from '../middlewares/comments.middlewares'
import { addPerfumeValidator, getAllPerfumesValidator, updatePerfumeValidator } from '../middlewares/perfumes.middlewares'
import { accessTokenValidator } from '../middlewares/users.middlewares'
import { wrapAsync } from '../utils/handlers'

const perfumeRouter = express.Router()

/**
 * @openapi
 * /perfumes:
 *   get:
 *     summary: Lấy tất cả nước hoa (có search và filter theo brand)
 *     description: Query params optional - search theo tên nước hoa (không phân biệt hoa thường), brand là MongoId của brand để lọc.
 *     tags:
 *       - Perfumes
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *           example: Chanel
 *         description: Tìm theo tên nước hoa (partial match, không phân biệt hoa thường)
 *       - in: query
 *         name: brand
 *         required: false
 *         schema:
 *           type: string
 *           example: 674e0e8f1c2d3a4b5c6d7e8f
 *         description: Lọc theo ID brand (MongoId)
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
 *                   example: Get all perfumes successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Perfume'
 *       422:
 *         description: Query không hợp lệ (vd. brand không phải MongoId)
 */
perfumeRouter.get('/', getAllPerfumesValidator, wrapAsync(getAllPerfumesController))

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
perfumeRouter.post('/', accessTokenValidator, addPerfumeValidator, wrapAsync(createPerfumeController))

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
 * /perfumes/{id}:
 *   put:
 *     summary: Cập nhật thông tin nước hoa
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
 *         description: ID nước hoa cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePerfumeReqBody'
 *     responses:
 *       200:
 *         description: Cập nhật nước hoa thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy nước hoa
 */
perfumeRouter.put('/:id', accessTokenValidator, updatePerfumeValidator, wrapAsync(updatePerfumeController))

/**
 * @openapi
 * /perfumes/{id}:
 *   delete:
 *     summary: Xóa nước hoa
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
 *         description: ID nước hoa cần xóa
 *     responses:
 *       200:
 *         description: Xóa nước hoa thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy nước hoa
 */
perfumeRouter.delete('/:id', accessTokenValidator, wrapAsync(deletePerfumeController))

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

// perfumeRouter.put(
//   '/:id/comments/:commentId',
//   accessTokenValidator,
//   updateCommentValidator,
//   wrapAsync(updateCommentController)
// )
export default perfumeRouter
