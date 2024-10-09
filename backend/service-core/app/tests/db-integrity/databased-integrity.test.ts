import 'jest'
import { BASE_API } from '../../src/config/config'
import { Device, deviceSchema, Parking, parkingSchema } from '../../src/utils/validators'
import { reqApp, token } from '../cfg'

function integrityCheck() {
  describe('DB INTEGRITY TESTS', () => {
    let device1: Device
    let device2: Device
    let device3: Device
    let device4: Device
    let parking1: Parking
    let parking2: Parking


    it('POST /devices -> prepare 1, 2', async () => {
      const createRes1 = await reqApp
        .post(BASE_API + '/devices')
        .set('Authorization', token)
        .send({
          'name': 'test_device_i_1',
          'price': 0,
          'topic': 'int-top1',
          'slotNumber': 1487,
        }).expect(200)

      const device1Res = deviceSchema.safeParse(createRes1.body)
      if (!device1Res.success)
        console.error(device1Res.error);
      expect(device1Res.success).toBe(true)
      if (device1Res.success)
        device1 = device1Res.data

      const createRes2 = await reqApp
        .post(BASE_API + '/devices')
        .set('Authorization', token)
        .send({
          'name': 'test_device_i_2',
          'price': 900,
          'topic': 'int-top2',
          'slotNumber': 1469,
        }).expect(200)
      const device2Res = deviceSchema.safeParse(createRes2.body)
      if (!device2Res.success)
        console.error(device2Res.error);
      expect(device2Res.success).toBe(true)
      if (device2Res.success)
        device2 = device2Res.data
    })


    it('POST /devices -> prepare 3, 4', async () => {
      const createRes3 = await reqApp
        .post(BASE_API + '/devices')
        .set('Authorization', token)
        .send({
          'name': 'test_device_i_3',
          'price': 500,
          'topic': 'int-top3',
          'slotNumber': 1489,
        }).expect(200)

      const device3Res = deviceSchema.safeParse(createRes3.body)
      if (!device3Res.success)
        console.error(device3Res.error);
      expect(device3Res.success).toBe(true)
      if (device3Res.success)
        device3 = device3Res.data


      const createRes4 = await reqApp
        .post(BASE_API + '/devices')
        .set('Authorization', token)
        .send({
          'name': 'test_device_i_4',
          'price': 420,
          'topic': 'int-top4',
          'slotNumber': 69,
        }).expect(200)

      const device4Res = deviceSchema.safeParse(createRes4.body)
      if (!device4Res.success)
        console.error(device4Res.error);
      expect(device4Res.success).toBe(true)
      if (device4Res.success)
        device4 = device4Res.data
    })


    it('POST /parkings -> with 3 existing child', async () => {
      const createRes = await reqApp
        .post(BASE_API + '/parkings')
        .set('Authorization', token)
        .send({
          'name': 'test_parking_i_1',
          'city': 'UB',
          'district': 'STD',
          'devices': [
            device1._id,
            device2._id,
            device3._id,
          ]
        }).expect(200)
      const parking1Res = parkingSchema.safeParse(createRes.body)
      if (!parking1Res.success) {
        console.error(parking1Res.error);
      }

      expect(parking1Res.success).toBe(true)

      if (parking1Res.success)
        parking1 = parking1Res.data
    })


    it('GET', async () => {
      const readResSortPrice = await reqApp
        .get(BASE_API + '/devices')
        .set('Authorization', token)
        .query({
          sort: 'price',
          topic: 'int-top',
        }).expect(200)

      expect(readResSortPrice.body).toHaveProperty('items');
      expect(readResSortPrice.body.items.length).toBe(4);

      expect(readResSortPrice.body.items[0]).toHaveProperty('parkingId', String(parking1._id))
      expect(readResSortPrice.body.items[1]).toHaveProperty('parkingId', String(parking1._id))
      expect(readResSortPrice.body.items[3]).toHaveProperty('parkingId', String(parking1._id))

      // 2 3 4 1
      const device1Res = deviceSchema.safeParse(readResSortPrice.body.items[3])
      const device2Res = deviceSchema.safeParse(readResSortPrice.body.items[0])
      const device3Res = deviceSchema.safeParse(readResSortPrice.body.items[1])

      expect(device1Res.success).toBe(true)
      expect(device2Res.success).toBe(true)
      expect(device3Res.success).toBe(true)

      if (device1Res.success) device1 = device1Res.data
      if (device2Res.success) device2 = device2Res.data
      if (device3Res.success) device3 = device3Res.data
    })


    it('PUT /parkings -> add 4-th device', async () => {
      const createRes = await reqApp
        .put(BASE_API + `/parkings/${parking1._id}`)
        .set('Authorization', token)
        .send({
          'name': 'test_parking_i_1',
          'city': 'BU',
          'district': 'STD',
          'devices': [
            device1._id,
            device2._id,
            device3._id,
            device4._id,
          ]
        }).expect(200)

      const parking1Res = parkingSchema.safeParse(createRes.body)
      if (!parking1Res.success) {
        console.error(parking1Res.error);
      }

      expect(parking1Res.success).toBe(true)

      if (parking1Res.success)
        parking1 = parking1Res.data
    })


    it('GET', async () => {
      const readResSortPrice = await reqApp
        .get(BASE_API + '/devices')
        .set('Authorization', token)
        .query({
          sort: 'price',
          topic: 'int-top',
        }).expect(200)

      expect(readResSortPrice.body).toHaveProperty('items');
      expect(readResSortPrice.body.items.length).toBe(4);
      expect(readResSortPrice.body.items[0]).toHaveProperty('parkingId', String(parking1._id))
      expect(readResSortPrice.body.items[1]).toHaveProperty('parkingId', String(parking1._id))
      expect(readResSortPrice.body.items[2]).toHaveProperty('parkingId', String(parking1._id))
      expect(readResSortPrice.body.items[3]).toHaveProperty('parkingId', String(parking1._id))

      // 2 3 4 1
      const device1Res = deviceSchema.safeParse(readResSortPrice.body.items[3])
      const device2Res = deviceSchema.safeParse(readResSortPrice.body.items[0])
      const device3Res = deviceSchema.safeParse(readResSortPrice.body.items[1])
      const device4Res = deviceSchema.safeParse(readResSortPrice.body.items[2])

      expect(device1Res.success).toBe(true)
      expect(device2Res.success).toBe(true)
      expect(device3Res.success).toBe(true)
      expect(device4Res.success).toBe(true)

      if (device1Res.success) device1 = device1Res.data
      if (device2Res.success) device2 = device2Res.data
      if (device3Res.success) device3 = device3Res.data
      if (device4Res.success) device4 = device4Res.data
    })


    it('GET desc', async () => {
      const readResSortPrice = await reqApp
        .get(BASE_API + '/devices')
        .set('Authorization', token)
        .query({
          sort: 'price',
          desc: 'true',
        }).expect(200)

      expect(readResSortPrice.body).toEqual({
        ...readResSortPrice.body,
        items: [
          JSON.parse(JSON.stringify({ ...device1, parking: parking1 })),
          JSON.parse(JSON.stringify({ ...device4, parking: parking1 })),
          JSON.parse(JSON.stringify({ ...device3, parking: parking1 })),
          JSON.parse(JSON.stringify({ ...device2, parking: parking1 })),
        ]
      })
    })


    it('DELETE device 1', async () => {
      await reqApp
        .delete(BASE_API + `/devices/${String(device1._id)}`)
        .set('Authorization', token)
        .expect(200)
    })
    it('DELETE device 2', async () => {
      await reqApp
        .delete(BASE_API + `/devices/${String(device2._id)}`)
        .set('Authorization', token)
        .expect(200)
    })
    it('DELETE device 3', async () => {
      await reqApp
        .delete(BASE_API + `/devices/${String(device3._id)}`)
        .set('Authorization', token)
        .expect(200)
    })
  })
}

integrityCheck()