import { Request, Response, NextFunction } from 'express';
import { getRepository, Repository, ObjectLiteral } from 'typeorm';
import { User } from '../../database/entities/User';
import { compareHash, generateToken } from '../shared/utils';

class IdentityController {
  repository: Repository<ObjectLiteral>;

  constructor(userEntity) {
    setTimeout(() => {
      this.repository = getRepository(userEntity);
    }, 2000);
  }

  loginUser = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const {
        body: { email, password },
      } = req;
      const user = await this.repository.findOne({ email });

      if (user) {
        if (compareHash(user.password, password)) {
          return resp.status(200).json({
            message: 'Login success',
            token: generateToken({ id: user.id, role: user.role }),
          });
        }

        return resp.status(401).json({
          message: 'Invalid credentials',
        });
      }

      return resp.status(401).json({
        message: 'Invalid credentials',
      });
    } catch (error) {
      return next(error);
    }
  };

  getProfile = async (req: Request, resp: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const {
        body: {
          _user: { id },
        },
      } = req;
      const { email, firstName, lastName, role, createdAt, updatedAt } = await this.repository.findOne(id);

      return resp.status(200).json({
        id,
        email,
        firstName,
        lastName,
        role,
        createdAt,
        updatedAt,
      });
    } catch (error) {
      return next(error);
    }
  };
}

export default new IdentityController(User);
