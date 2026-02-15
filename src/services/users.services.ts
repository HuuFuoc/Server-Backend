import bcrypt from 'bcryptjs' // Thêm dòng này
import User from '~/models/User.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/requests/User.requests'

class UserService {
  async register(payload: RegisterReqBody) {
    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(payload.password, 10)
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        password: hashedPassword, // Lưu mật khẩu đã mã hóa
        date_of_birth: new Date(payload.date_of_birth)
      })
    )
    return result
  }
  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }
}

const userService = new UserService()
export default userService
