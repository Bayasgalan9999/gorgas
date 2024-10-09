import { ObjectId } from "mongodb"
import { z } from "zod"
import { AccessConrtolActions, PaymentStatus, DeviceStatus, PaymentMethod, PurchaseStatus } from "../../config/enums"

export const idPreprocess = z.preprocess(x => new ObjectId(String(x)), z.instanceof(ObjectId))
export const emailPreprocess = z.preprocess(x => String(x).toLowerCase(), z.string().email())

export const trimmedStrPreprocess = z.preprocess(x => {
  if (x === undefined)
    throw new TypeError('got undefined, expected string...')
  return String(x).trim().replace(/\s+\g/, ' ').replace(/[^a-zA-Zа-яА-Я ЁёӨөҮү0-9-_]/, '')
}, z.string())

const resourceSchema = z.object({
  _id: idPreprocess,
  name: trimmedStrPreprocess,
  updatedAt: z.number(),
  createdAt: z.number(),
})


export const menuSchema = z.object({
  _id: idPreprocess,
  name: z.string(),
})


export const userSchema = z.object({
  email: emailPreprocess,
  password: z.string().optional(),
  roleId: idPreprocess,
}).merge(resourceSchema)

const strOrIdSchema = z.preprocess(x => {
  try {
    return new ObjectId(String(x))
  } catch (e) {
    return String(x)
  }
}, z.string().or(idPreprocess))

const ruleSchema = z.object({
  actions: z.array(z.nativeEnum(AccessConrtolActions)),
  resources: z.array(strOrIdSchema),
})

export const roleSchema = z.object({
  rules: z.object({
    MENU: z.array(ruleSchema),
    USER: z.array(ruleSchema),
    ROLE: z.array(ruleSchema),
    PURCHASE: z.array(ruleSchema),
    DEVICE: z.array(ruleSchema),
  }),
}).merge(resourceSchema)


export const deviceSchema = z.object({
  topic: z.string(),

  status: z.nativeEnum(DeviceStatus),
  online: z.boolean(),
  lastMsgTime: z.number(),
  ping: z.number().or(z.nan()),

  lat: z.number().optional(),
  long: z.number().optional(),
}).merge(resourceSchema)


export const deviceBodySchema = deviceSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,

  status: true,
  online: true,
  lastMsgTime: true,
  ping: true,
})


export const purchaseSchema = z.object({
  deviceId: idPreprocess,
  device: deviceSchema,
  price: z.number().min(0),
  amount: z.number().min(0).optional(),
  status: z.nativeEnum(PurchaseStatus).optional(),
  method: z.nativeEnum(PaymentMethod).optional(),
  error: z.nativeEnum(PaymentStatus).optional(),
  timeStart: z.date(),
  timeEnd: z.date().optional(),
}).merge(resourceSchema.omit({ name: true }))


export const credsSchema = z.object({
  name: z.string(),
  email: emailPreprocess,
  password: z.string(),
})


export type Creds = z.infer<typeof credsSchema>
export type Menu = z.infer<typeof menuSchema>
export type User = z.infer<typeof userSchema>
export type Role = z.infer<typeof roleSchema>
export type Device = z.infer<typeof deviceSchema>
export type Purchase = z.infer<typeof purchaseSchema>
export type DeviceBody = z.infer<typeof deviceBodySchema>