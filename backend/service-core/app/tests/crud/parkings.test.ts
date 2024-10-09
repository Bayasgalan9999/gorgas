import 'jest'
import { BASE_API } from '../../src/config/config'
import { Parking, parkingSchema } from '../../src/utils/validators'
import { reqApp, token } from '../cfg'

function parkingsTests() {
  describe('CRUD /parkings', () => {
    let parking1: Parking
    let parking2: Parking

    it('POST parking 1', async () => {
      const createRes1 = await reqApp
        .post(BASE_API + '/parkings')
        .set('Authorization', token)
        .send({
          name: 'test_parking_1',
          city: 'UB',
          district: 'STD',
        }).expect(200)
      parking1 = parkingSchema.parse(createRes1.body)
    })

    it('POST parking 2', async () => {
      const createRes2 = await reqApp
        .post(BASE_API + '/parkings')
        .set('Authorization', token)
        .send({
          name: 'test_parking_2',
          city: 'UB',
          district: 'STD',
        }).expect(200)

      parking2 = parkingSchema.parse(createRes2.body)
    })


    it('GET', async () => {
      const readRes = await reqApp
        .get(BASE_API + '/parkings')
        .set('Authorization', token)
        .query({
          city: 'UB'
        }).expect(200)

      expect(readRes.body.items).toEqual([
        JSON.parse(JSON.stringify(parking1)),
        JSON.parse(JSON.stringify(parking2)),
      ])
    })


    it('UPDATE', async () => {
      const parkingId1 = parking1._id
      const updateRes = await reqApp
        .put(BASE_API + `/parkings/${String(parkingId1)}`)
        .set('Authorization', token)
        .send({
          ...parking1,
          name: 'test_parking_test'
        }).expect(200)

      expect(updateRes.body).toEqual({
        ...JSON.parse(JSON.stringify(parking1)),
        name: 'test_parking_test',
        updatedAt: updateRes.body.updatedAt
      })
    })


    it('DELETE parking1', async () => {
      const parkingId1 = parking1._id

      await reqApp
        .delete(BASE_API + `/parkings/${String(parkingId1)}`)
        .set('Authorization', token)
        .expect(200)
    })

    it('DELETE parking2', async () => {
      const parkingId2 = parking2._id
      await reqApp
        .delete(BASE_API + `/parkings/${String(parkingId2)}`)
        .set('Authorization', token)
        .expect(200)
    })
  })
}

parkingsTests()