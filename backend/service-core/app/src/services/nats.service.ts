import { readFileSync } from 'fs'
import {
  connect,
  ConnectionOptions,
  JSONCodec,
  NatsConnection,
  RequestOptions
} from 'nats'
import {
  NATS_CREDS,
  NATS_SERVER_URL,
  NATS_TOPIC_DEVICE_BASE,
  NODE_ENV,
} from '../config/config'
import { handleDeviceMessage } from '../handlers/nats-events'

const natsCreds = readFileSync(NATS_CREDS)
const jsonCodec = JSONCodec()

let natsServer: NatsConnection | null = null

async function getNatsServer(): Promise<NatsConnection> {
  if (natsServer) return natsServer

  const connectOpts: ConnectionOptions = NODE_ENV !== 'production' ? {
    servers: NATS_SERVER_URL,
    timeout: 1000,
  } : {
    servers: NATS_SERVER_URL,
    user: natsCreds.toString().split('\n')[0],
    pass: natsCreds.toString().split('\n')[1],
  }

  natsServer = await connect(connectOpts)

  return natsServer
}

async function subscribeNatsServer() {
  const natsServer = await getNatsServer()

  const sub = natsServer.subscribe(NATS_TOPIC_DEVICE_BASE);
  (async (sub) => {
    for await (const message of sub) {
      const res = await handleDeviceMessage(message)

      console.log(`[Handle Device Message RESULT] ${res}`);

      if (res) message.respond(jsonCodec.encode(res))
    }
    console.log('sub closed')
  })(sub)

  await natsServer.closed()
}

async function emit(topic: string, payload: Record<string, any>) {
  const natsServer = await getNatsServer()
  try {
    natsServer.publish(
      topic,
      jsonCodec.encode(payload)
    )
    console.log(`[EMIT]: ${topic}`)
  } catch (error) {
    console.log(`[EMIT ERROR]: ${error}`)
  }
}

async function request(topic: string, payload: Record<string, any>, options?: RequestOptions | undefined) {
  const natsServer = await getNatsServer()
  try {
    const ans = natsServer.request(
      topic,
      jsonCodec.encode(payload),
      options
    )
    console.log(`[EMIT]: ${topic}`)

    return ans;
  } catch (error) {
    console.log(`[EMIT ERROR]: ${error}`)
  }
}

export {
  getNatsServer,
  jsonCodec,
  emit,
  request,
  subscribeNatsServer,
}