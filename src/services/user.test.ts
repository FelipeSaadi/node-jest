import { User, UserInstance } from '../models/User'
import * as userService from './user'

describe('Testing user service', () => {
  const email = 'test@jest.com'
  const password = '1234'

  beforeAll(async () => {
    await User.sync({ force: true })
  })

  it('should create a new user', async () => {
    const newUser = await userService.createUser(email, password) as UserInstance

    expect(newUser).not.toBeInstanceOf(Error)
    expect(newUser).toHaveProperty('id')
    expect(newUser.email).toBe(email)
  })

  it('should not allow to create a user with existing email', async () => {
    const newUser = await userService.createUser(email, password)
    expect(newUser).toBeInstanceOf(Error)
  })

  it('should find a user by the email', async () => {
    const user = await userService.findByEmail(email) as UserInstance
    expect(user.email).toBe(email)
  })

  it('should match the password from database', async () => {
    const user = await userService.findByEmail(email) as UserInstance
    const match = userService.matchPassword('invalid', user.password)
    expect(match).toBeFalsy()
  })

  it('should get a list of users', async () => {
    const users = await userService.getAll()
    expect(users.length).toBeGreaterThanOrEqual(1)

    for (let i in users) {
      expect(users[i]).toBeInstanceOf(User)
    }
  })
})