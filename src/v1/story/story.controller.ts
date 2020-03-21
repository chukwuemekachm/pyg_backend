import { Request, Response } from 'express';

class StoryController {
  get(req: Request, resp: Response): Response {
    return resp.json({
      message: 'Weclome to PYG server story',
    });
  }
}

export default new StoryController();
