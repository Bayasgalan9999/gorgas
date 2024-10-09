import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import { Filter } from 'mongodb'
import { MS_5_MIN } from '../../config/config'
import { DbCollections } from '../../config/enums'
import { ReadLocals } from '../../types'
import { Device, DeviceList } from '../../utils/validators'

export const filter: RequestHandler<
  unknown,
  never,
  unknown,
  DeviceList,
  ReadLocals<DbCollections.DEVICES>
> = async (req, res, next) => {
  const {
    topic,
    online,
    status
  } = req.query

  const filter: Filter<Device> = {}

  if (topic) filter.status = RegExp(topic)
  if (online !== undefined) {
    if (online)
      filter.lastMsgTime = { $gte: Date.now() - MS_5_MIN }
    else
      filter.lastMsgTime = { $lte: Date.now() - MS_5_MIN }
  }
  if (status) filter.status = { $in: status }

  res.locals.filter = filter

  return next()
}


export const getDevices: RequestHandler<
  unknown,
  { items: (Device & { online: boolean })[], total: number, page: number } | createHttpError.HttpError | unknown,
  unknown,
  DeviceList,
  ReadLocals<DbCollections.DEVICES>
> = async (_, res, next) => {
  try {
    if (!res.locals.readResult)
      return next(createHttpError.InternalServerError())
    const {
      items,
      total,
      page,
    } = res.locals.readResult

    const newData: (Device & {online: boolean})[] = items

    for (let d of newData)
      d.online = Date.now() - d.lastMsgTime > MS_5_MIN
    

    return res.send({
      items: newData,
      total,
      page,
    })
  } catch (e) {
    console.error(e);
    return next(e)
  }
}