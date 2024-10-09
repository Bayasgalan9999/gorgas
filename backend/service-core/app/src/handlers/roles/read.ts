import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import { Filter, ObjectId } from 'mongodb'
import { DbCollections } from '../../config/enums'
import { ReadLocals } from '../../types'
import { Role, RoleList } from '../../utils/validators'

export const filter: RequestHandler<
  unknown,
  never,
  unknown,
  RoleList,
  ReadLocals<DbCollections.ROLES>
> = async (req, res, next) => {
  const {
    devices,
    users,
  } = req.query

  const _filter: Filter<Role> = {
    _id: { $nin: [new ObjectId('148855e11828259756b696e7')] }
  }

  if (devices || users) {
    _filter.$and = []
    if (devices) _filter.$and.push(devices)
    if (users) _filter.$and.push(users)
  }

  res.locals.filter = _filter

  return next()
}

export const getRoles: RequestHandler<
  unknown,
  { items: Role[], total: number, page: number },
  unknown,
  RoleList,
  ReadLocals<DbCollections.ROLES>
> = async (_, res, next) => {
  try {
    if (!res.locals.readResult)
      return next(createHttpError.InternalServerError())
    const {
      items,
      total,
      page,
    } = res.locals.readResult

    return res.send({
      items,
      total,
      page,
    })
  } catch (e) {
    console.error(e);
    return next(e)
  }
}