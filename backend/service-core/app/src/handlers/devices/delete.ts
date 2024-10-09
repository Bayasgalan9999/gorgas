import { getDb } from '../../services/mongodb'
import { RequestHandler } from 'express'
import { Device } from '../../utils/validators'
import createHttpError from 'http-errors'
import { ObjectId } from 'mongodb'
import { DbCollections } from '../../config/enums'


export const remove: RequestHandler<
  { id: string },
  Device,
  unknown,
  unknown
> = async (req, res, next) => {
  const { id } = req.params
  const db = await getDb()

  const deleteRes = await db
    .collection(DbCollections.DEVICES)
    .findOneAndDelete({ _id: new ObjectId(id) })

  if (!deleteRes.value)
    return next(createHttpError.NotFound())

  return res.send({ ...deleteRes.value })
}