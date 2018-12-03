import express from 'express';
import userCtrl from '../controllers/user';
import { authenticate } from '../middlewares/JwtMiddlewares';

const router = express.Router();


router.route('/')
  .get(authenticate, userCtrl.list)
  .post(userCtrl.create);

router.route('/:userId')
  .get(authenticate, userCtrl.get)
  .put(authenticate, userCtrl.update)
  .delete(authenticate, userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

export default router;