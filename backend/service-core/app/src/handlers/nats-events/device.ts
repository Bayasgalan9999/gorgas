import { jsonCodec, request } from "../../services/nats.service";
import { z } from "zod";
import { DeviceCommands, DeviceStatus } from "../../config/enums";
import { NATS_TOPIC_DEVICE_CONTROL } from "../../config/config";

export const deviceStatusBodySchema = z.object({
  status: z.nativeEnum(DeviceStatus),
  price: z.number(),
  ping: z.number(),
  time: z.number(),
})

export type DeviceStatusBody = z.infer<typeof deviceStatusBodySchema>

async function controlDevice(topic: string, payload: Record<string, string | number>): Promise<DeviceStatusBody | undefined> {
  try {
    const ans = await request(topic, jsonCodec.encode(payload), { timeout: 1000 })

    if (!ans?.data) throw new Error('nats or device not working')

    const body = deviceStatusBodySchema.parse(jsonCodec.decode(ans?.data))
    return body
  } catch (e) {
    console.log(`[controlDevice] ${topic}\n${e}`);
  }
}

export async function setDevicePrice(topic: string, price: number) {
  const payload = { price }
  return controlDevice(NATS_TOPIC_DEVICE_CONTROL + topic + '.' + DeviceCommands.SET_PRICE, payload)
}

export async function setDeviceStatus(topic: string, status: string | number) {
  const payload = { status }
  return controlDevice(NATS_TOPIC_DEVICE_CONTROL + topic + '.' + DeviceCommands.SET_PARKING_STATAUS, payload)
}