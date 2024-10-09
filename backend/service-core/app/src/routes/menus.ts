import express from 'express'

import { getMenus } from '../handlers/menus'
import { menuListSchema } from '../utils/validators'
import { validateQuery } from '../middlewares/validate-request'
import { getResources } from '../middlewares/access-control'
import { AccessControlKinds } from '../config/enums'
import asyncHandler from "express-async-handler"

const router = express.Router()

router.get(
  '/',
  getResources({ kind: AccessControlKinds.MENU }),
  validateQuery(menuListSchema),
  asyncHandler(getMenus),
)

export default express.Router().use('/menus', router)