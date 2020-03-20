import { Router } from 'express';
import Controller from './identity.controller';

const router = Router();

router.get('/', Controller.get);

export default router;
