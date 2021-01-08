import SignUpController from './signUpController'

describe('', () => {
  test('Should return 400 if name is provided', () => {
    const sut = new SignUpController()

    const httpRequest = {
      body: {
        email: 'lucassm02@gmail.com',
        password: '12345678',
        password_confirmation: '12345678'
      }
    }

    const httpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
  })
})
