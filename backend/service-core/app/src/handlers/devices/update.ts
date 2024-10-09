import { getDb } from '../../services/mongodb'
import { RequestHandler } from 'express'
import { Device, DeviceBody } from '../../utils/validators'
import { ObjectId } from 'mongodb'
import createHttpError from 'http-errors'
import { DbCollections } from '../../config/enums'

export const update: RequestHandler<
  { id: string },
  Device,
  DeviceBody,
  unknown
> = async (req, res, next) => {
  const device = req.body
  const { id } = req.params
  const deviceId = new ObjectId(id)
  const db = await getDb()
  const updatedAt = Date.now()
  const maybeOldDevice = await db
    .collection(DbCollections.DEVICES)
    .findOneAndUpdate(
      { _id: deviceId },
      {
        $set: {
          ...device,
          updatedAt: updatedAt
        }
      },
    )

  if (!maybeOldDevice.value)
    return next(createHttpError.NotFound())

  const oldDevice = maybeOldDevice.value

  return res.send({
    ...oldDevice,
    ...device,
    updatedAt,
  })
}