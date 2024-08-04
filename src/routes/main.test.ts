import request from 'supertest'
import server from '../server'
import { User } from '../models/User'

describe('Testing main routes', () => {
  const email = 'test@jest.com'
  const password = '1234'
  let token = ''

  beforeAll(async () => {
    await User.sync({ force: true })
  })

  it('should ping pong', (done) => {
    request(server)
      .get('/ping')
      .then(response => {
        expect(response.body.pong).toBeTruthy()
        return done()
      })
  })

  it('should register a new user', (done) => {
    request(server)
      .post('/register')
      .send(`email=${email}&password=${password}`)
      .then(response => {
        expect(response.body.error).toBeUndefined()
        expect(response.body).toHaveProperty('token')
        return done()
      })
  })

  it('should not allow to register with existing email', (done) => {
    request(server)
      .post('/register')
      .send(`email=${email}&password=${password}`)
      .then(response => {
        expect(response.body.error).not.toBeUndefined()
        return done()
      })
  })

  it('should not allow register without email', (done) => {
    request(server)
      .post('/register')
      .send(`password=${password}`)
      .then(response => {
        expect(response.body.error).not.toBeUndefined()
        return done()
      })
  })

  it('should not allow register without password', (done) => {
    request(server)
      .post('/register')
      .send(`email=${email}`)
      .then(response => {
        expect(response.body.error).not.toBeUndefined()
        return done()
      })
  })

  it('should login correctly', (done) => {
    request(server)
      .post('/login')
      .send(`email=${email}&password=${password}`)
      .then(response => {
        console.log(response.body)
        expect(response.body.error).toBeUndefined()
        expect(response.body).toHaveProperty('token')
        token = response.body.token
        return done()
      })
  })

  it('should not login with incorrect data', (done) => {
    request(server)
      .post('/login')
      .send(`email=${email}&passsword=invalid`)
      .then(response => {
        expect(response.body.error).toBeUndefined()
        expect(response.body.status).toBeFalsy()
        return done()
      })
  })

  it('should list all users', (done) => {
    request(server)
      .get('/users')
      .auth(token, { type: 'bearer' })
      .then(response => {
        expect(response.body.error).toBeUndefined()
        expect(response.body.users.length).toBeGreaterThanOrEqual(1)
        expect(response.body.users).toContain(email)
        return done()
      })
  })
})