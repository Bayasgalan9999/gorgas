import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import { Filter } from 'mongodb'
import { DbCollections } from '../../config/enums'
import { ReadLocals } from '../../types'
import { Purchase, PurchaseList } from '../../utils/validators'

export const filter: RequestHandler<
  unknown,
  never,
  unknown,
  PurchaseList,
  ReadLocals<DbCollections.PURCHASES>
> = async (req, res, next) => {
  const {
    deviceId,
    status,
    method,

    timeStart,
    timeEnd,
    amount,
    price,
  } = req.query

  const filter: Filter<Omit<Purchase, 'status' | 'method'> & { status: string, method: string }> = {}

  if (deviceId) filter.deviceId = { $in: deviceId }
  if (status) filter.status = { $in: status.split(',') }
  if (method) filter.method = { $in: method.split(',') }

  if (timeStart) {
    if (timeStart.from) filter.timeStart = { $gte: new Date(timeStart.from) }
    if (timeStart.to) filter.timeStart = { $lte: new Date(timeStart.to) }
  }

  if (timeEnd) {
    if (timeEnd.from) filter.timeEnd = { $gte: new Date(timeEnd.from) }
    if (timeEnd.to) filter.timeEnd = { $lte: new Date(timeEnd.to) }
  }

  if (amount) {
    if (amount.from) filter.amount = { $lte: amount.from }
    if (amount.to) filter.amount = { $gte: amount.to }
  }

  if (price) {
    if (price.from) filter.price = { $lte: price.from }
    if (price.to) filter.price = { $gte: price.to }
  }

  res.locals.filter = filter

  return next()
}

export const getPurchases: RequestHandler<
  unknown,
  { items: Purchase[], total: number, page: number },
  unknown,
  PurchaseList,
  ReadLocals<DbCollections.PURCHASES>
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
