import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { USER_ROLE } from "~/containts/enums";
import HTTP_STATUS from "~/containts/httpStatus";
import { ADMIN_MESSAGES, USERS_MESSAGES } from "~/containts/messages";
import { ErrorWithStatus } from "~/models/Error";
import adminService from "~/services/admin.services";
import { getAccessTokenPayload } from "~/utils/jwt";
export const getCollectorsController = async (
    req: Request<ParamsDictionary>,
    res: Response,
    next: NextFunction
) => {
    const {role} = getAccessTokenPayload(req)
    if (role !== USER_ROLE.Admin) {
        throw new ErrorWithStatus({
            status: HTTP_STATUS.FORBBIDEN,
            message: USERS_MESSAGES.ROLE_INVALID
        })
    }
    const result = await adminService.getCollectors()
    if (!result) {
        throw new ErrorWithStatus({
            status: HTTP_STATUS.NOT_FOUND,
            message: ADMIN_MESSAGES.COLLECTOR_NOT_FOUND
        })
    }
    res.status(HTTP_STATUS.OK).json({
        message: ADMIN_MESSAGES.GET_COLLECTORS_SUCCESS,
        data: result
    })
}