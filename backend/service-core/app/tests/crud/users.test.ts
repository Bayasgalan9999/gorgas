import 'jest'
import { BASE_API } from '../../src/config/config'
import { ServerMessages } from '../../src/config/enums'
import { User, userSchema } from '../../src/utils/validators'
import { reqApp, token } from '../cfg'

function usersTests() {
  describe('CRUD /users', () => {
    let user1: User
    let user2: User

    it('POST user 1 --> success', async () => {
      const createRes1 = await reqApp
        .post(BASE_API + '/users')
        .set('Authorization', token)
        .send({
          name: 'Billy Herrington',
          email: 'asswecan@gmail.com',
          password: 'asswecan',
          roleId: '6675636b696e67736c617665',
        })

      if (createRes1.statusCode !== 200)
        console.log(JSON.stringify(createRes1, null, 2));

      expect(createRes1.statusCode).toBe(200)
      user1 = userSchema.parse(createRes1.body)
    })

    it('POST user 2 --> success', async () => {
      const createRes2 = await reqApp
        .post(BASE_API + '/users')
        .set('Authorization', token)
        .send({
          name: 'Van Darkholme',
          email: 'dungeon.master@gmail.com',
          password: 'asswecan',
          roleId: '6675636b696e67736c617665',
        }).expect(200)

      if (createRes2.statusCode !== 200)
        console.log(JSON.stringify(createRes2, null, 2));

      expect(createRes2.statusCode).toBe(200)
      user2 = userSchema.parse(createRes2.body)

    })

    it('POST user --> bad request \'Email exists\'', () => {
      return reqApp
        .post(BASE_API + '/users')
        .set('Authorization', token)
        .send({
          name: 'Van Darkholme',
          email: 'dungeon.master@gmail.com',
          password: 'asswecan',
          roleId: '6675636b696e67736c617665',
        }).expect(400, { message: ServerMessages.EMAIL_EXISTS })
    })


    it('GET sorted names --> success', async () => {
      const readRes = await reqApp
        .get(BASE_API + '/users')
        .set('Authorization', token)
        .query({
          _id: `${String(user1._id)},${String(user2._id)}`,
          sort: 'name'
        }).expect(200)

      expect(readRes.body.items).toEqual([
        JSON.parse(JSON.stringify({ ...user2, role: { name: 'User' } })),
        JSON.parse(JSON.stringify({ ...user1, role: { name: 'User' } })),
      ])
    })


    it('UPDATE user 1 --> success', async () => {
      const updateRes = await reqApp
        .put(BASE_API + `/users/${String(user1._id)}`)
        .set('Authorization', token)
        .send({
          ...user1,
          name: 'Herrington'
        })

      if (updateRes.statusCode !== 200)
        console.log(JSON.stringify(updateRes, null, 2));

      expect(updateRes.statusCode).toBe(200)
      expect(updateRes.body).toEqual({
        ...JSON.parse(JSON.stringify(user1)),
        name: 'Herrington',
        updatedAt: updateRes.body.updatedAt
      })

      user1 = userSchema.parse(updateRes.body)
    })

    it('UPDATE user 2 --> success', async () => {
      const updateRes = await reqApp
        .put(BASE_API + `/users/${String(user2._id)}`)
        .set('Authorization', token)
        .send({
          ...user2,
          name: 'Darkholme'
        })

      if (updateRes.statusCode !== 200)
        console.log(JSON.stringify(updateRes, null, 2));


      expect(updateRes.statusCode).toBe(200)
      expect(updateRes.body).toEqual({
        ...JSON.parse(JSON.stringify(user2)),
        name: 'Darkholme',
        updatedAt: updateRes.body.updatedAt
      })

      user2 = userSchema.parse(updateRes.body)
    })

    it('GET new sorted names --> success', async () => {
      const readRes = await reqApp
        .get(BASE_API + '/users')
        .set('Authorization', token)
        .query({
          _id: `${String(user1._id)},${String(user2._id)}`,
          sort: 'name'
        }).expect(200)


      expect(readRes.body.items).toEqual([
        JSON.parse(JSON.stringify({ ...user1, role: { name: 'User' } })),
        JSON.parse(JSON.stringify({ ...user2, role: { name: 'User' } })),
      ])
    })


    it('DELETE user 1 --> success', async () => {
      const delRes = await reqApp
        .delete(BASE_API + `/users/${String(user1._id)}`)
        .set('Authorization', token)

      if (delRes.statusCode !== 200)
        console.log(`[DELETE user 1]${JSON.stringify(delRes, null, 2)}`);

      expect(delRes.statusCode).toEqual(200)
      const parseRes = userSchema.strict().safeParse(delRes.body)
      expect(parseRes.success).toBe(true)
    })

    it('DELETE user 2 --> success', async () => {
      const delRes = await reqApp
        .delete(BASE_API + `/users/${String(user2._id)}`)
        .set('Authorization', token)

      if (delRes.statusCode !== 200)
        console.log(`[DELETE user 2]${JSON.stringify(delRes, null, 2)}`);

      expect(delRes.statusCode).toEqual(200)
      const parseRes = userSchema.strict().safeParse(delRes.body)
      expect(parseRes.success).toBe(true)
    })

    it('DELETE user 2 --> not found', () => {
      reqApp
        .delete(BASE_API + `/users/${String(user2._id)}`)
        .set('Authorization', token)
        .expect(404)
    })
  })
}

usersTests()