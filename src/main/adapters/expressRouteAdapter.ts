import { Request, Response } from 'express'
import { Controller, HttpRequest } from '../../presentation/protocols'

export const AdaptRoute = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = { body: request.body }
    const { body, statusCode } = await controller.handle(httpRequest)
    return response.status(statusCode).json(body)
  }
}
