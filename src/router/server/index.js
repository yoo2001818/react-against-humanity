import Router from '../../utils/router';
import logger from '../middleware/logger';
import connection from './connection';

const router = new Router();

router.use(logger);
router.middleware(null, (req, res) => {
  res.resolve(req.action);
});
router.use(connection);

export default router;
