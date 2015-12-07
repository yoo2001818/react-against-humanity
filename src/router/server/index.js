import Router from '../../utils/router';
import logger from '../middleware/logger';
import connection from './connection';

const router = new Router();

router.use(logger);
router.middleware(null, (req, res) => {
  // Stream action to all connections.
  const { connection: { list } } = req.store.getState();
  for (let key in list) {
    let id = key || 0;
    if (req.action.meta.connection === id) continue;
    req.connector.dispatch(req.action, id);
  }
  res.resolve(req.action);
});
router.use(connection);

export default router;
