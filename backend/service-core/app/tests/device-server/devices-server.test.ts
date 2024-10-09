import 'jest'
import { readFileSync } from 'fs'
import { BASE_API, NATS_CREDS, NATS_SERVER_URL, NODE_ENV, NATS_TOPIC_DEVICE } from '../../src/config/config'
import { Device, deviceSchema } from '../../src/utils/validators'
import { reqApp, sleep, token } from '../cfg'
import {
  connect,
  ConnectionOptions,
  JSONCodec,
  Msg,
  NatsConnection,
} from 'nats'
import { DbCollections, DeviceCommands, DeviceStatus, PaymentStatus } from '../../src/config/enums'
import { z } from 'zod'
import { getDb } from '../../src/services/mongodb'
import { deviceStatusBodySchema } from '../../src/handlers/nats-events'

let device: Device
const natsCreds = readFileSync(NATS_CREDS)
const jsonCodec = JSONCodec()

let natsConnection: NatsConnection | null = null
type DeviceStatePacket = z.infer<typeof deviceStatusBodySchema>

async function getNatsConnection(): Promise<NatsConnection> {
  if (natsConnection) return natsConnection

  const connectOpts: ConnectionOptions =
    NODE_ENV !== 'production' ? {
      servers: NATS_SERVER_URL,
      timeout: 1000,
    } :
      {
        servers: NATS_SERVER_URL,
        user: natsCreds.toString().split('\n')[0],
        pass: natsCreds.toString().split('\n')[1],
      }

  natsConnection = await connect(connectOpts)

  return natsConnection
}

async function handleDeviceMessage(msg: Msg): Promise<DeviceStatePacket | Error | undefined> {
  const tokens = msg.subject.split('.')
  if (tokens.length != 3)
    return Error()

  const [_, deviceTopic, subject] = tokens
  if (deviceTopic != device.topic)
    return Error('Wrong topic')

  console.log(`[HANDLE DEVICE MESSAGE] ${subject} ${DeviceCommands.SET_PRICE} ${subject == DeviceCommands.SET_PRICE}`);


  if (subject == DeviceCommands.SET_PRICE) {
    const data = jsonCodec.decode(msg.data)
    if (!data)
      return Error('[SET_PRICE] Could\'t decode msg.data')
    const pData = z.object({ price: z.number().min(0) }).strict().parse(data)
    device.price = pData.price;
    return {
      status: device.status,
      price: device.price,
      ping: 69,
      time: Date.now(),
    }
  }

  if (subject == DeviceCommands.SET_PARKING_STATAUS) {
    const data = jsonCodec.decode(msg.data)
    if (!data)
      return Error('[SET_PARKING_STATAUS] Could\'t decode msg.data')
    const pData = z.object({ status: z.nativeEnum(DeviceStatus) }).strict().parse(data)
    device.status = pData.status;
    return {
      status: device.status,
      price: device.price,
      ping: 69,
      time: Date.now(),
    }
  }

  if (subject == DeviceCommands.TRANSACTION_INFO_RESP) {
    const data = jsonCodec.decode(msg.data)
    if (!data)
      return Error('[TRANSACTION_INFO_RESP] Could\'t decode msg.data')
    const pData = z.object({ status: z.nativeEnum(PaymentStatus) }).strict().parse(data)
    if (pData.status == PaymentStatus.SUCCESS)
      device.status = DeviceStatus.UNLOCKING

    return {
      status: device.status,
      price: device.price,
      ping: 69,
      time: Date.now(),
    }
  }
}

function deviceServerTest() {
  describe('Device mocking test', () => {
    // const topic = `${NATS_TOPIC_DEVICE}.server.some-unique-topic.${DeviceCommands.PARKING_STATE}`

    // beforeAll(async () => {
    //   const createRes = await reqApp
    //     .post(BASE_API + '/devices')
    //     .set('Authorization', token)
    //     .send({
    //       name: 'device-server-test',
    //       price: 0,
    //       topic: 'some-unique-topic',
    //       slotNumber: 69,
    //     }).expect(200)

    //   device = deviceSchema.parse(createRes.body)
    // })

    // it('Device send locking status', async () => {
    //   const ns = await getNatsConnection()

    //   const payload = {
    //     status: "LOCKING",
    //     price: 1000,
    //     ping: 69,
    //     time: Date.now(),
    //   }
    //   ns.publish(topic, jsonCodec.encode(payload));

    //   console.log(`[PUBLISHED]`);

    //   const sub = ns.subscribe(`${NATS_TOPIC_DEVICE}.device.some-unique-topic.*`, {max: 1});

    //   (async (sub) => {
    //     for await (const message of sub) {
    //       console.log(`[TO BE HANDLED] ${JSON.stringify(message.data)}`)
    //       const res = await handleDeviceMessage(message)
    //       console.log(`[HANDLED] ${JSON.stringify(res)}`);

    //       if (res) {
    //         expect(res).toHaveProperty('status')
    //         expect(res).toHaveProperty('price')
    //         expect(res).toHaveProperty('pring')
    //         expect(res).toHaveProperty('time')
    //       }
    //     }
    //     console.log('sub closed')
    //   })(sub)

    //   await sleep(3500)

    //   const db = await getDb()

    //   const maybeDevice = await db
    //     .collection(DbCollections.DEVICES)
    //     .findOne({ _id: device._id })

    //   expect(maybeDevice).toBeDefined()
    //   if (maybeDevice)
    //     device = maybeDevice
        

    //   console.log(`[MAY BE DEVICE] ${JSON.stringify(maybeDevice, null, 2)}`);
      
    //   expect(device.currentPurchase).toBeDefined()

    //   const purchase = await db
    //     .collection(DbCollections.PURCHASES)
    //     .findOne({ _id: device.currentPurchase })

    //   expect(purchase).toBeDefined()
    // })

    it('User paying for slot', async () => {

    })
  })
}

deviceServerTest()