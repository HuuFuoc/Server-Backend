import express from 'express' //import express vào dự án
import databaseService from './services/database.services'
import setupSwagger from './swagger'
import userRouter from './routes/users.routers'
import { defaultErrorHandler } from './middlewares/errors.middlewares'
const cors = require('cors')

const app = express() //dùng express tạo 1 server
const port = 3000 //server sẽ chạy trên cổng port 3000

app.use(
  cors({
    origin: '*', // Cho phép tất cả origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
)
app.use(express.json()) //middleware để parse json từ body request
// Swagger
setupSwagger(app)
//Routes

app.use('/user', userRouter)
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Project này đang chạy trên post ${port}`)
  console.log(`Swagger UI at http://localhost:${port}/api-docs`)
})
databaseService.connect()
