import { RequestHandler } from 'express'
import { getDb } from '../../services/mongodb'
import { DbCollections } from '../../config/enums'
import { MenuList } from '../../utils/validators'
import { Menu } from '../../utils/validators/resources'
import { Filter } from 'mongodb'

export const getMenus: RequestHandler<
  unknown,
  { items: Menu[] },
  unknown,
  MenuList
> = async (req, res, _) => {
  const { _id, name } = req.query

  const filter: Filter<Menu> = {}

  if (name) filter.name = name
  if (_id) filter._id = { $in: _id }

  const db = await getDb()

  const result = await db
    .collection(DbCollections.MENUS)
    .find(filter)
    .toArray()

  return res.send({ items: result })
}