import express from "express";
import { getCollectorsController } from "../controllers/admin.controllers";
import { accessTokenValidator } from "../middlewares/users.middlewares";
import { wrapAsync } from "../utils/handlers";

const adminRouter = express.Router()

/**
 * @openapi
 * /admin/collectors:
 *   get:
 *     summary: Lấy danh sách Collectors (chỉ Admin)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Get collectors successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64f1a2b3c4d5e6f7a8b9c0d1
 *                       name:
 *                         type: string
 *                         example: Nguyen Van A
 *                       email:
 *                         type: string
 *                         example: nguyenvana@example.com
 *                       role:
 *                         type: string
 *                         example: Collector
 *                       verify:
 *                         type: number
 *                         example: 1
 *       401:
 *         description: Chưa đăng nhập hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền truy cập (không phải Admin)
 *       404:
 *         description: Không tìm thấy collectors
 */
adminRouter.get('/collectors', accessTokenValidator, wrapAsync(getCollectorsController))

export default adminRouter