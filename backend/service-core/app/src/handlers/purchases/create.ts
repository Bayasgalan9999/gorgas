import { getDb } from '../../services/mongodb'
import { Device, Purchase } from '../../utils/validators'
import { ObjectId } from 'mongodb'
import { DbCollections } from '../../config/enums'


export const createPurchase = async (device: Device, timeStart: Date): Promise<Purchase | undefined> => {
  try {
    const db = await getDb()

    // if (device.currentPurchase) {
    //   const maybeCurrentPurchase = await db
    //     .collection(DbCollections.PURCHASES)
    //     .findOne({ _id: device.currentPurchase })

    //   if (maybeCurrentPurchase) {
    //     if (maybeCurrentPurchase.error === undefined) {
    //       console.error(`Purchase already exists!`);
    //       return
    //     }
    //   }
    // }

    const createdAt = Date.now()
    const insertResult = await db
      .collection(DbCollections.PURCHASES)
      .insertOne({
        deviceId: device._id,
        device,
        price: 69,
        timeStart: timeStart,
        createdAt,
        updatedAt: createdAt,
      })

    // await db
    //   .collection(DbCollections.DEVICES)
    //   .updateOne(
    //     { _id: device._id },
    //     { $set: { currentPurchase: insertResult.insertedId.toString() } }
    //   )

      return {
        _id: insertResult.insertedId,
        deviceId: device._id,
        device,
        price: 69,
        timeStart: new Date(timeStart),
        createdAt,
        updatedAt: createdAt,
      }
  } catch (e) {
    console.error(e);
    return
  }
}