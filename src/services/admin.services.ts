import { USER_ROLE } from "~/containts/enums"
import databaseService from "./database.services"

class AdminService {
    async getCollectors() {
        const result = await databaseService.users.find({role: USER_ROLE.User}).toArray()
        return result
    }
}

const adminService = new AdminService()
export default adminService
