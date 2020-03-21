import { Request, Response, NextFunction, RequestHandler } from 'express';
import { decodeToken } from '../../utils/utils';

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
    } catch (error) {
      return next(error);
    }
  };
}
