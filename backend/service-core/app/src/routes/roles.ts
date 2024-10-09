import express from 'express'

import { create, update, remove, getRoles, filter } from '../handlers/roles'
import { roleListSchema, roleSchema } from '../utils/validators'
import { validateBody, validateQuery } from '../middlewares/validate-request'
import { checkResources, getResources } from '../middlewares/access-control'
import { AccessControlKinds, DbCollections } from '../config/enums'
import { read } from '../middlewares/read'
import asyncHandler from 'express-async-handler'

const router = express.Router()

router.get(
  '/',
  getResources({ kind: AccessControlKinds.ROLE }),
  validateQuery(roleListSchema),
  filter,
  read(DbCollections.ROLES),
  getRoles,
)

router.post(
  '/',
  checkResources({ kind: AccessControlKinds.ROLE, resources: ['*'] }),
  validateBody(roleSchema),
  asyncHandler(create),
)

router.put(
  '/:id',
  checkResources({ kind: AccessControlKinds.ROLE }),
  validateBody(roleSchema),
  asyncHandler(update),
)

router.delete(
  '/:id',
  checkResources({ kind: AccessControlKinds.ROLE }),
  asyncHandler(remove),
)

export default express.Router().use('/roles', router)