import Router from '../../utils/router';
import logger from '../middleware/logger';
import transport from './transport';

const router = new Router();

router.use(logger);
router.use(transport);

router.middleware(null, (req, res) => {
  req.connector.dispatch(req.action, -1, true)
  .then(res.resolve, res.reject);
});

router.poll(null, (req, res) => {
  res.resolve(req.store.dispatch(req.action));
});

export default router;
