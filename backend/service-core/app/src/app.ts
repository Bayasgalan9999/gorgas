import cors from 'cors'
import express, { Application } from 'express'
import createHttpError from 'http-errors'
import { BASE_API } from './config/config'

import devices from './routes/devices'
import purchases from './routes/purchases'
import users from './routes/users'
import roles from './routes/roles'
import menus from './routes/menus'
import auth from './routes/auth'

import authVerify from './middlewares/verify'
import { errorHandler } from './middlewares/error'

const app: Application = express()

app.set('trust proxy', true)
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use(authVerify)
app.use(BASE_API, devices)
app.use(BASE_API, purchases)
app.use(BASE_API, users)
app.use(BASE_API, roles)
app.use(BASE_API, menus)
app.use(BASE_API, auth)

app.all('/*', (req, res) => {
  console.log(req.url);

  const notFound = createHttpError.NotFound()
  return res
    .status(notFound.statusCode)
    .send(notFound)
})

app.use(errorHandler)

export default app