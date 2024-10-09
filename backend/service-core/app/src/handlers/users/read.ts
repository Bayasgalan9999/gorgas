import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import { Filter, ObjectId } from 'mongodb'
import { DbCollections } from '../../config/enums'
import { getDb } from '../../services/mongodb'
import { ReadLocals } from '../../types'
import { User, UserList } from '../../utils/validators'

export const filter: RequestHandler<
  unknown,
  never,
  unknown,
  UserList,
  ReadLocals<DbCollections.USERS>
> = async (req, res, next) => {
  const {
    email
  } = req.query

  const _filter: Filter<User> = {
    _id: { $nin: [new ObjectId('5a11ce11828279756B696E79')] }
  }

  if (email) _filter.email = RegExp(email.replace(/[^a-zA-Zа-яА-Я ЁёӨөҮү0-9-_.@]/, ''))

  res.locals.filter = _filter
  res.locals.project = { password: 0 }

  return next()
}


export const getUsers: RequestHandler<
  unknown,
  { items: (User & { role: { name: string } })[], total: number, page: number },
  unknown,
  UserList,
  ReadLocals<DbCollections.USERS>
> = async (_, res, next) => {
  try {
    if (!res.locals.readResult)
      return next(createHttpError.InternalServerError())
    const {
      items,
      total,
      page,
    } = res.locals.readResult
    const db = await getDb()
    const newItems: (User & { role: { name: string } })[] = []
    const roleIds: ObjectId[] = []

    items.forEach(x => { roleIds.push(x.roleId) })

    const rolesMap: any = {}
    const role = await db
      .collection(DbCollections.ROLES)
      .find({ _id: { $in: roleIds } })
      .project({
        rules: 0,
        createdAt: 0,
        updatedAt: 0,
      })
      .toArray()

    role.forEach(x => rolesMap[String(x._id)] = x)

    items.forEach(
      x => newItems.push({
        ...x,
        role: { name: rolesMap[String(x.roleId)].name }
      })
    )

    return res.send({
      items: newItems,
      total,
      page,
    })
  } catch (e) {
    console.error(e);
    return next(e)
  }
}