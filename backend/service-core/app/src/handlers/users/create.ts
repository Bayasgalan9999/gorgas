import bcrypt from 'bcrypt';
import { getDb } from '../../services/mongodb'
import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import { User } from '../../utils/validators'
import { BCRYPT_SALT } from '../../config/config';
import { DbCollections, ServerMessages } from '../../config/enums';
import { ObjectId } from 'mongodb';


export const create: RequestHandler<
  unknown,
  User,
  Omit<User, '_id' | 'createdAt' | 'updatedAt'>,
  unknown
> = async (req, res, next) => {
  try {
    const user = req.body
    const db = await getDb()
    if (!user.password)
      return next(createHttpError.BadRequest(ServerMessages.PASSWORD_REQUIRED))
    user.password = await bcrypt.hash(user.password, BCRYPT_SALT)
    const createdAt = Date.now()
    const upserted = await db
      .collection(DbCollections.USERS)
      .updateOne(
        { email: user.email },
        {
          $setOnInsert: {
            ...user,
            createdAt,
            updatedAt: createdAt,
          }
        },
        { upsert: true }
      )

    if (!upserted.upsertedCount)
      return next(createHttpError.BadRequest(ServerMessages.EMAIL_EXISTS))

    return res.send({
      _id: upserted.upsertedId,
      email: user.email,
      name: user.name,
      roleId: user.roleId ? user.roleId : new ObjectId('6675636b696e67736c617665'),
      createdAt,
      updatedAt: createdAt,
    })
  } catch (e) {
    console.error(e)
    return next(e)
  }
}