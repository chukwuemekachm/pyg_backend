import { Request, Response, NextFunction, RequestHandler } from 'express';
import { decodeToken } from './utils';
import { validateRequest } from '../validators';

export function permissions(roles: string[]): RequestHandler {
  return function validate(req: Request, resp: Response, next: NextFunction): Response | void {
    try {
      const authorization = req.get('Authorization') || req.get('token') || req.get('x-access-token');

      if (authorization) {
        const token = authorization.replace('Bearer ', '');
        const decodedToken = decodeToken(token) as Record<string, string>;

        if (decodeToken && roles.includes(decodedToken.role)) {
          req.body._user = decodedToken;
          return next();
        }

        return resp.status(401).json({
          message: 'Un-authorized',
        });
      }

      return resp.status(401).json({
        message: 'Needs Authentication',
      });
    } catch (error) {
      return next(error);
    }
  };
}

export function validation(Validator: any, isUpdate = false): RequestHandler {
  return async function validate(req: Request, resp: Response, next: NextFunction): Promise<Response | void> {
    try {
      const errors: Record<string, string[]> | boolean = await validateRequest(
        Validator,
        {
          ...req.body,
          ...req.params,
        },
        isUpdate,
      );

      if (errors) {
        return resp.status(400).json({
          message: 'Some field(s) are failing validation',
          errors,
        });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}
