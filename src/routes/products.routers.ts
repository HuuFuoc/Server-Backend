import express from 'express'
import {
  createProductController,
  deleteProductsByIdController,
  getAllProductsController,
  getProductsByIdController,
  updateProductController
} from '../controllers/products.controllers'
import { addProductValidator, updateProductValidator } from '../middlewares/products.middlewares'
import { wrapAsync } from '../utils/handlers'

const productRouter = express.Router()

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Lấy tất cả sản phẩm
 *     tags:
 *       - Products
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
 *                     $ref: '#/components/schemas/Product'
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
productRouter.get('/', wrapAsync(getAllProductsController))

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Lấy sản phẩm theo id
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần lấy
 *     responses:
 *       200:
 *         description: Lấy sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Không tìm thấy sản phẩm
 */

productRouter.get('/:id', wrapAsync(getProductsByIdController))
/**
 * @openapi
 * /products:
 *   post:
 *     summary: Tạo sản phẩm mới
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
productRouter.post('/', addProductValidator, wrapAsync(createProductController))
/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Cập nhật sản phẩm
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
productRouter.put('/:id', updateProductValidator, wrapAsync(updateProductController))

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Xóa sản phẩm theo id
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần xóa
 *     responses:
 *       200:
 *         description: Xóa sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
productRouter.delete('/:id', wrapAsync(deleteProductsByIdController))
export default productRouter
