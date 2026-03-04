import express from 'express'
import {
  addBrandController,
  deleteBrandController,
  getAllBrandsController,
  getBrandByIdController,
  updateBrandController
} from '../controllers/brands.controllers'
import { addBrandValidator, updateBrandValidator } from '../middlewares/brands.middlewares'
import { accessTokenValidator } from '../middlewares/users.middlewares'
import { wrapAsync } from '../utils/handlers'
const brandRouter = express.Router()

/**
 * @openapi
 * /brands:
 *   get:
 *     summary: Lấy danh sách tất cả brand
 *     tags:
 *       - Brands
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách brand thành công
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
 *                     $ref: '#/components/schemas/Brand'
 *       401:
 *         description: Unauthorized - Thiếu hoặc sai access token
 *       500:
 *         description: Internal server error
 */
brandRouter.get('/', accessTokenValidator, wrapAsync(getAllBrandsController))

/**
 * @openapi
 * /brands:
 *   post:
 *     summary: Thêm mới một brand
 *     tags:
 *       - Brands
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brandName:
 *                 type: string
 *                 example: "Gucci"
 *     responses:
 *       201:
 *         description: Tạo brand thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Unauthorized - Thiếu hoặc sai access token
 *       500:
 *         description: Internal server error
 */
brandRouter.post('/', accessTokenValidator, addBrandValidator, wrapAsync(addBrandController))

/**
 * @openapi
 * /brands/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một brand theo id
 *     tags:
 *       - Brands
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của brand
 *     responses:
 *       200:
 *         description: Lấy thông tin brand thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/Brand'
 *       401:
 *         description: Unauthorized - Thiếu hoặc sai access token
 *       404:
 *         description: Không tìm thấy brand
 *       500:
 *         description: Internal server error
 */
brandRouter.get('/:id', accessTokenValidator, wrapAsync(getBrandByIdController))

/**
 * @openapi
 * /brands/{id}:
 *   put:
 *     summary: Cập nhật thông tin một brand theo id
 *     tags:
 *       - Brands
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của brand
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brandName:
 *                 type: string
 *                 example: "Chanel"
 *     responses:
 *       200:
 *         description: Cập nhật brand thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Brand'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Unauthorized - Thiếu hoặc sai access token
 *       404:
 *         description: Không tìm thấy brand
 *       500:
 *         description: Internal server error
 */
brandRouter.put('/:id', accessTokenValidator, updateBrandValidator, wrapAsync(updateBrandController))

/**
 * @openapi
 * /brands/{id}:
 *   delete:
 *     summary: Xóa một brand theo id
 *     tags:
 *       - Brands
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của brand
 *     responses:
 *       200:
 *         description: Xóa brand thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized - Thiếu hoặc sai access token
 *       404:
 *         description: Không tìm thấy brand
 *       500:
 *         description: Internal server error
 */
brandRouter.delete('/:id', accessTokenValidator, wrapAsync(deleteBrandController))
export default brandRouter
