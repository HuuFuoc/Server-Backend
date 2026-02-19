import { Collection, Db, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
dotenv.config()
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@exercise.jk5vgd8.mongodb.net/`

class DatabaseService {
  private client: MongoClient
  private db: Db //tạo thành thuộc tình db
  constructor() {
    this.client = new MongoClient(uri)
    // nạp giá trị cho thuộc tình db thông qua constructor
    this.db = this.client.db(process.env.DB_NAME)
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 }) //đổi cách xài
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
  get users(): Collection<User> {
    return this.db.collection<User>(process.env.DB_USERS_COLLECTION as string)
  }
  get refresh_tokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }
}

//từ class tạo object và export nó ra ngoài
const databaseService = new DatabaseService()
export default databaseService
//đây chính là injection
//vì nếu ta export class ra ngoài, mỗi lần dùng phải tạo object
//dẫn đến việc sẽ có nhiều chỗ xài, nhiều chổ tạo nhiều object
//giống nhau
//ta chỉ cần 1 object xuyên suốt dự án , nên ta export object ra ngoài để bên ngoài chỉ xài chung mà k tạo lại
