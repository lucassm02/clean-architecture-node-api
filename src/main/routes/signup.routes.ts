import { Router } from 'express'
import { AdaptRoute } from '../adapters/expressRouteAdapter'
import { makeSignupController } from '../factories/signup'

export default (router: Router): void => {
  router
    .route('/signup')
    .post(AdaptRoute(makeSignupController()))
}
