import 'jest'
import { BASE_API } from "../../src/config/config"
import { ServerMessages } from '../../src/config/enums'
import { reqApp } from '../cfg'

function authTests() {
  describe('Registration flow', () => {
    let codeStr: string = ''
    it('POST /register --> success', () => {
      return reqApp
        .post(BASE_API + '/register')
        .send({
          name: 'Steve Rambo',
          email: 'testuser@gmail.com',
          password: 'asswecan'
        }).expect(200)
    })

    it('POST /register --> bad request \'Email exists\'', () => {
      return reqApp
        .post(BASE_API + '/register')
        .send({
          name: 'Steve Rambo',
          email: 'testuser@gmail.com',
          password: 'asswecan'
        }).expect(400, { message: ServerMessages.CHECK_EMAIL })
    })

    it('POST /resend --> success', async () => {
      const resendRes = await reqApp
        .post(BASE_API + '/resend')
        .send({
          name: 'Steve Rambo',
          email: 'testuser@gmail.com',
          password: 'asswecan'
        }).expect(200)

      codeStr = resendRes.body.codeStr
    })

    it('POST /resend --> bad request', () => {
      return reqApp
        .post(BASE_API + '/resend')
        .send({
          name: 'Steve',
          email: 'minecraft.is.my.life@gmail.com',
          password: 'asswecan'
        }).expect(400)
    })

    it('POST /verify --> success', () => {
      return reqApp
        .get(BASE_API + `/verify/${codeStr}/000000`)
        .expect(200)
    })

    it('POST /verify --> bad request', () => {
      return reqApp
        .get(BASE_API + `/verify/${codeStr}/000000`)
        .expect(400, { message: ServerMessages.REGISTRATION_FAILED })
    })
  })

  describe('Login & token refresh', () => {
    let token: string = ''
    it('POST /login --> success', async () => {
      const loginRes = await reqApp
        .post(BASE_API + '/login')
        .send({
          email: 'admin@gmail.com',
          password: 'asswecan'
        })
        .expect(200)

      token = loginRes.body.token
    })

    it('POST /login --> not found', () => {
      return reqApp
        .post(BASE_API + '/login')
        .send({
          email: 'adminasdasdsad@gmail.com',
          password: 'asswecan'
        })
        .expect(403)
    })

    it('POST /login --> bad request \'wrong password\'', () => {
      return reqApp
        .post(BASE_API + '/login')
        .send({
          email: 'admin@gmail.com',
          password: 'assswecan'
        })
        .expect(403)
    })

    it('POST /me --> success', () => {
      return reqApp
        .post(BASE_API + '/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
    })

    it('POST /me --> unauthorized', () => {
      return reqApp
        .post(BASE_API + '/me')
        .expect(401)
    })
  })
}

authTests()