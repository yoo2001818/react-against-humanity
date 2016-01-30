import Router from '../../utils/router';
import blockNonAction from '../middleware/blockNonAction';
import logger from '../middleware/logger';
import runAction from '../middleware/runAction';
import transport from './transport';

const router = new Router();

router.use(blockNonAction);
router.use(logger);
router.use(transport);

router.middleware(null, req => {
  return runAction(req)(req.connector.dispatch(req.action, -1, true));
});

router.poll(null, req => {
  return req.store.dispatch(Object.assign({}, req.action, {
    meta: Object.assign({}, req.action.meta, {
      class: 'internal'
    })
  }));
});

export default router;
