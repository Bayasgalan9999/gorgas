import { ObjectId } from "mongodb"
import { z } from "zod"
import {
  deviceSchema,
  menuSchema,
  purchaseSchema,
  roleSchema,
  trimmedStrPreprocess,
  userSchema
} from "./resources"

const idsPreprocess = z.preprocess(x => String(x).split(',').map(x => new ObjectId(x)), z.array(z.instanceof(ObjectId)))

const numberOrDatePreproc = z.preprocess(x => {
  if (x === undefined || x === null) return undefined
  try {
    return Number.parseInt(String(x))
  } catch (e) {
    const d = Date.parse(String(x))
    return Number.isNaN(d) ? undefined : d
  }
}, z.number().optional())


const fromtoNumbersShema = z.object({
  from: numberOrDatePreproc,
  to: numberOrDatePreproc
})


const fromtoDateShema = z.object({
  from: z.preprocess(Date, z.date()),
  to: z.preprocess(Date, z.date()),
})


const listSchema = z.object({
  _id: idsPreprocess,
  name: trimmedStrPreprocess,
  createdAt: fromtoDateShema,
  sort: z.string(),
})
  .partial()
  .merge(z.object({
    limit: z.preprocess(Number, z.number()).default(20),
    page: z.preprocess(Number, z.number()).default(1),
    desc: z.preprocess(x => x === undefined || x === null || x === 'false' ? false : true, z.boolean())
  }))


export const menuListSchema = menuSchema.partial()
  .merge(
    listSchema.omit({
      desc: true,
      limit: true,
      page: true,
      createdAt: true,
    })
  )


export const userListSchema = userSchema.omit({ password: true, email: true }).partial().merge(listSchema)
  .merge(
    z.object({
      sort: userSchema.keyof(),
      email: z.string().trim(),
    }).partial(),
  )


export const roleListSchema = roleSchema.partial().merge(listSchema)
  .merge(
    z.object({
      devices: idsPreprocess,
      users: idsPreprocess,
      sort: roleSchema.keyof(),
    }).partial()
  )



export const purchaseListSchema = purchaseSchema
  .omit({
    amount: true,
    price: true,
    timeStart: true,
    timeEnd: true,
    status: true,
    method: true,
  })
  .partial()
  .merge(listSchema)
  .merge(
    z.object({
      deviceId: idsPreprocess,
      status: z.string(),
      method: z.string(),
      timeStart: fromtoDateShema,
      timeEnd: fromtoDateShema,
      amount: fromtoNumbersShema,
      price: fromtoNumbersShema,
      sort: purchaseSchema.keyof(),
    }).partial(),
  )


export const deviceListSchema = deviceSchema.partial().omit({}).merge(listSchema)
  .merge(
    z.object({
      topic: z.string(),
      online: z.preprocess(x => String(x) === 'false' ? false : true, z.boolean()),
      status: z.preprocess(x => String(x).split(','), z.array(deviceSchema.shape.status)),
      sort: deviceSchema.keyof(),
    }).partial(),
  )


export type ResourceList = z.infer<typeof listSchema>
export type MenuList = z.infer<typeof menuListSchema>
export type UserList = z.infer<typeof userListSchema>
export type RoleList = z.infer<typeof roleListSchema>
export type PurchaseList = z.infer<typeof purchaseListSchema>
export type DeviceList = z.infer<typeof deviceListSchema>