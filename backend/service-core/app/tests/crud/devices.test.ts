import 'jest'
import { BASE_API } from '../../src/config/config'
import { Device, deviceSchema } from '../../src/utils/validators'
import { reqApp, token } from '../cfg'


//TODO: add bad requests...

function devicesTests() {
  describe('CRUD /devices', () => {
    let device1: Device
    let device2: Device
    let device3: Device

    it('POST device 1 --> success', async () => {
      const createRes1 = await reqApp
        .post(BASE_API + '/devices')
        .set('Authorization', token)
        .send({
          name: 'test_device_1',
          price: 0,
          topic: 'topic1',
          slotNumber: 1487,
        }).expect(200)

      device1 = deviceSchema.parse(createRes1.body)
    })
    it('POST device 2 --> success', async () => {
      const createRes2 = await reqApp
        .post(BASE_API + '/devices')
        .set('Authorization', token)
        .send({
          name: 'test_device_2',
          price: 900,
          topic: 'topic2',
          slotNumber: 1488,
        }).expect(200)

      device2 = deviceSchema.parse(createRes2.body)
    })

    it('POST device 3 --> success', async () => {

      const createRes3 = await reqApp
        .post(BASE_API + '/devices')
        .set('Authorization', token)
        .send({
          name: 'test_device_3',
          price: 500,
          topic: 'topic3',
          slotNumber: 1489,
        }).expect(200)

      device3 = deviceSchema.parse(createRes3.body)
    })

    it('GET --> success', async () => {
      const readResSortPrice = await reqApp
        .get(BASE_API + '/devices')
        .set('Authorization', token)
        .query({
          sort: 'price',
          topic: 'topic'
        }).expect(200)

      expect(readResSortPrice.body).toEqual({
        ...readResSortPrice.body,
        items: [
          JSON.parse(JSON.stringify(device2)),
          JSON.parse(JSON.stringify(device3)),
          JSON.parse(JSON.stringify(device1))
        ]
      })
    })



    it('GET desc --> success', async () => {
      const readResSortPriceDesc = await reqApp
        .get(BASE_API + '/devices')
        .set('Authorization', token)
        .query({
          _id: `${String(device1._id)},${String(device2._id)},${String(device3._id)}`,
          sort: 'price',
          desc: true,
          topic: 'topic'
        }).expect(200)

      expect(readResSortPriceDesc.body).toEqual({
        ...readResSortPriceDesc.body,
        items: [
          JSON.parse(JSON.stringify(device1)),
          JSON.parse(JSON.stringify(device3)),
          JSON.parse(JSON.stringify(device2))
        ]
      })
    })


    it('DELETE device 1 --> success', async () => {
      await reqApp
        .delete(BASE_API + `/devices/${String(device1._id)}`)
        .set('Authorization', token)
        .expect(200)
    })
    it('DELETE device 2 --> success', async () => {
      await reqApp
        .delete(BASE_API + `/devices/${String(device2._id)}`)
        .set('Authorization', token)
        .expect(200)
    })
    it('DELETE device 3 --> success', async () => {
      await reqApp
        .delete(BASE_API + `/devices/${String(device3._id)}`)
        .set('Authorization', token)
        .expect(200)
    })
  })
}

devicesTests()