import { Msg } from "nats"
// import { getDb } from "../../services/mongodb"
import { jsonCodec } from "../../services/nats.service"


export const handleDeviceMessage = async (msg: Msg): Promise<Record<string, any> | undefined | void> => {
  try {
    // const db = await getDb()
    const { subject, data } = msg

    const tokens = subject.split('.')
    if (tokens.length <= 1)
      return

    // const [_, topic] = tokens

    const jsnData = jsonCodec.decode(data)

    console.log(jsnData);
  } catch (e) {
    console.log(e);
  }
}