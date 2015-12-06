import Router from '../../utils/router';
import logger from '../middleware/logger';
import spliter from '../middleware/spliter';

const router = new Router();
const middlewareRouter = new Router();
const pollRouter = new Router();

router.use(logger);
router.use(spliter(middlewareRouter, pollRouter));

middlewareRouter.use((req, res) => {
  req.connector.dispatch(req.action, -1, true)
  .then(res.resolve, res.reject);
});

pollRouter.use((req, res) => {
  res.resolve(req.store.dispatch(req.action));
});

export default router;
