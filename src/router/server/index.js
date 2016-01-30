import Router from '../../utils/router';
import blockNonAction from '../middleware/blockNonAction';
import logger from '../middleware/logger';
import connection from './connection';
import transport from './transport';
import chat from './chat';
import room from './room';

const router = new Router();

router.use(blockNonAction);
router.use(logger);
router.middleware(null, req => {
  // Stream action to all connections.
  const { connection: { list } } = req.store.getState();
  for (let id in list) {
    const connection = list[id];
    if (connection.exited) continue;
    if (req.action.meta.target.connection === connection.id) continue;
    req.connector.dispatch(req.action, connection.id);
  }
  // Run action... :/
  return req.store.dispatch(Object.assign({}, req.action, {
    meta: Object.assign({}, req.action.meta, {
      class: 'internal'
    })
  }));
});
router.use(connection);
router.use(transport);
router.use(chat);
router.use(room);

export default router;
