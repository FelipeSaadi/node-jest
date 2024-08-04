import request from 'supertest'
import server from '../server'

describe('Testing main routes', () => {
  it('should ping pong', (done) => {
    request(server)
      .get('/ping')
      .then(response => {
        expect(response.body.pong).toBeTruthy()
        return done()
      })
  })
})