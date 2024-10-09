import { getDb } from '../../services/mongodb'
import { RequestHandler } from 'express'
import { Role } from '../../utils/validators'
import { ObjectId } from 'mongodb'
import createHttpError from 'http-errors'
import { DbCollections } from '../../config/enums'

export const update: RequestHandler<
  { id: string },
  Role,
  Omit<Role, '_id' | 'createdAt' | 'updatedAt'>,
  unknown
> = async (req, res, next) => {
  const role = req.body
  const { id } = req.params
  const db = await getDb()

  const updated = await db
    .collection(DbCollections.ROLES)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...role,
          updatedAt: Date.now()
        }
      },
      { returnDocument: 'after' }
    )

  if (!updated.value)
    return next(createHttpError.NotFound())

  return res.send({ ...updated.value })
}