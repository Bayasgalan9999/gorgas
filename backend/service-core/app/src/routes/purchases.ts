import express from 'express'

import { filter, getPurchases } from '../handlers/purchases'
import { purchaseListSchema } from '../utils/validators'
import { validateQuery } from '../middlewares/validate-request'
import { getResources } from '../middlewares/access-control'
import { AccessControlKinds, DbCollections } from '../config/enums'
import { read } from '../middlewares/read'

const router = express.Router()

router.get(
  '/',
  getResources({ kind: AccessControlKinds.PURCHASE }),
  validateQuery(purchaseListSchema),
  filter,
  read(DbCollections.PURCHASES),
  getPurchases,
)

export default express.Router().use('/purchases', router)