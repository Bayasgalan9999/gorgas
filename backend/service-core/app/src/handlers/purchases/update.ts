import { getDb } from '../../services/mongodb'
import { Purchase } from '../../utils/validators'
import { ObjectId } from 'mongodb'
import { DbCollections } from '../../config/enums'

export const updatePurchase = async (
  data: Omit<Partial<
    Purchase & { purchaseId: string }>,
    'timeStart' | 'price' | '_id' | 'createdAt' | 'updatedAt' | 'device'
  >
) => {
  const {
    purchaseId
  } = data
  try {
    const db = await getDb()

    Object.keys(data).forEach(key => (data as any)[key] === undefined && delete (data as any)[key])
    delete data.purchaseId

    const newPurchase = await db
      .collection(DbCollections.PURCHASES)
      .findOneAndUpdate(
        { _id: new ObjectId(purchaseId) },
        {
          $set: {
            ...data,
            updatedAt: Date.now(),
          }
        },
        { returnDocument: 'after' }
      )

    if (newPurchase.value)
      return newPurchase.value
  } catch (e) {
    console.error(e);
  }
}