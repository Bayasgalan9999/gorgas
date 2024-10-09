import { RequestHandler } from "express";
import { ObjectId, WithId } from "mongodb";
import { getDb } from "../services/mongodb";
import { DbCollections } from "../config/enums";
import { ResourceList } from "../utils/validators/lists";
import { CollectionResource, ReadLocals } from "../types";


export const read = <T extends DbCollections>(collection: T): RequestHandler<
  unknown,
  never,
  unknown,
  ResourceList,
  ReadLocals<T>
> => async (req, res, next) => {
  try {
    const {
      _id,
      name,
      sort,
      desc,
      createdAt,
      limit,
      page
    } = req.query

    const filter = res.locals.filter ?? {}
    const projection = res.locals.project ? res.locals.project : {}
    const resources = res.locals.context.resources

    if (_id)
      filter.$and = [
        { _id: { $in: _id } },
        resources?.includes('*')
          ? {}
          : { _id: { $in: resources?.map(v => new ObjectId(v)) } },
      ]
    else
      if (!resources?.includes('*'))
        filter.$and = [{ _id: { $in: resources?.map(v => new ObjectId(v)) } }]

    if (name) filter.name = RegExp(name)
    if (createdAt) {
      if (createdAt.from) filter.createdAt.$gte = createdAt.from.getTime()
      if (createdAt.to) filter.createdAt.$lte = createdAt.to.getTime()
    }

    const _sort: Record<string, 1 | -1> = {}
    if (sort) _sort[sort] = desc ? 1 : -1

    const offset = (page - 1) * limit
    
    const db = await getDb()
    
    const promiseCount = db
    .collection(collection)
    .countDocuments(filter)
    
    const result = await db
      .collection(collection)
      .find(filter)
      .project<WithId<CollectionResource<T>>>(projection)
      .sort(_sort)
      .limit(limit)
      .skip(offset)
      .toArray()

    res.locals.readResult = {
      items: result,
      total: await promiseCount,
      page,
    }

    return next()
  } catch (e) {
    console.error(`[READ ERROR] ${e}`);
    return next(e)
  }
}