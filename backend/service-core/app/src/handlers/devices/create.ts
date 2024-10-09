import { getDb } from '../../services/mongodb'
import { RequestHandler } from 'express'
import { Device, DeviceBody } from '../../utils/validators'
import createHttpError from 'http-errors'
import { DbCollections, DeviceStatus, ServerMessages } from '../../config/enums'


export const create: RequestHandler<
  unknown,
  Device,
  DeviceBody,
  unknown
> = async (req, res, next) => {
  const device = req.body
  const db = await getDb()
  const createdAt = Date.now()

  const deviceData: Omit<Device, '_id'> = {
    ...device,
    status: DeviceStatus.SOME_STATUS,
    lastMsgTime: 0,
    online: false,
    ping: NaN,
    createdAt,
    updatedAt: createdAt,
  }

  const maybeNewDevice = await db
    .collection(DbCollections.DEVICES)
    .updateOne(
      { name: device.name },
      { $setOnInsert: deviceData },
      { upsert: true }
    )

  if (!maybeNewDevice.upsertedCount)
    return next(createHttpError.BadRequest(ServerMessages.NAME_EXISTS))

  const newDevice = {
    _id: maybeNewDevice.upsertedId,
    ...deviceData
  }

  return res.send(newDevice)
}