import { AddPerfumeReqBody } from '~/models/requests/Perfume.requests'
import databaseService from './database.services'
import Perfume from '~/models/schemas/Perfume.schema'
import { PerfumeListResponse } from '~/models/response/Perfume.response'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Error'
import HTTP_STATUS from '~/containts/httpStatus'
import { PERFUME_MESSAGES } from '~/containts/messages'

class PerfumesService {
  async getAllPerfumes(): Promise<PerfumeListResponse[]> {
    const result = await databaseService.perfumes.find({}).toArray()
    return result.map(({ comments, ...rest }) => rest)
  }
  async createPerfume(payload: AddPerfumeReqBody) {
    const result = await databaseService.perfumes.insertOne(
      new Perfume({
        ...payload
      })
    )
    return result
  }
  async getPerfumeDetail(id: string) {
    if (!id) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: PERFUME_MESSAGES.PERFUME_ID_IS_REQUIRED
      })
    }
    if (!ObjectId.isValid(id)) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.BAD_REQUEST,
        message: PERFUME_MESSAGES.INVALID_PERFUME_ID
      })
    }
    const result = await databaseService.perfumes.findOne({ _id: new ObjectId(id) })
    return result
  }
}

const perfumesService = new PerfumesService()
export default perfumesService
