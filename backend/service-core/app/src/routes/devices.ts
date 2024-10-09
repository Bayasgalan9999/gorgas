import express from 'express'

import { create, filter, getDevices, update, remove } from '../handlers/devices'
import { deviceBodySchema, deviceListSchema } from '../utils/validators'
import { validateBody, validateQuery } from '../middlewares/validate-request'
import { checkResources, getResources } from '../middlewares/access-control'
import { AccessControlKinds, DbCollections } from '../config/enums'
import { read } from '../middlewares/read'
import asyncHandler from 'express-async-handler'

const router = express.Router()

router.get(
  '/',
  getResources({ kind: AccessControlKinds.DEVICE }),
  validateQuery(deviceListSchema),
  filter,
  read(DbCollections.DEVICES),
  getDevices,
)

router.post(
  '/',
  checkResources({ kind: AccessControlKinds.DEVICE, resources: ['*'] }),
  validateBody(deviceBodySchema),
  asyncHandler(create),
)

router.put(
  '/:id',
  checkResources({ kind: AccessControlKinds.DEVICE }),
  validateBody(deviceBodySchema),
  asyncHandler(update),
)

router.delete(
  '/:id',
  checkResources({ kind: AccessControlKinds.DEVICE }),
  asyncHandler(remove),
)

export default express.Router().use('/devices', router)