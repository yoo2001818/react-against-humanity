import Router from '../../utils/router';
import logger from '../middleware/logger';
import connection from './connection';
import transport from './transport';

const router = new Router();

router.use(logger);
router.middleware(null, (req, res) => {
  // Stream action to all connections.
  const { connection: { list } } = req.store.getState();
  for (let id in list) {
    if (req.action.meta.connection == id) continue;
    req.connector.dispatch(req.action, id);
  }
  res.resolve(req.action);
});
router.use(connection);
router.use(transport);

export default router;
