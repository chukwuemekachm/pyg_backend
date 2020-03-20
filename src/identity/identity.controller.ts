import { Request, Response } from 'express';

class IdentityController {
  get(req: Request, resp: Response): Response {
    return resp.json({
      message: 'Weclome to PYG server auth',
    });
  }
}

export default new IdentityController();
