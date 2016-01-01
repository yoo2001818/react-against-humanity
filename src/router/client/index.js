import { isFSA } from 'flux-standard-action';
import Router from '../../utils/router';
import blockNonAction from '../middleware/blockNonAction';
import logger from '../middleware/logger';
import transport from './transport';

const router = new Router();

router.use(blockNonAction);
router.use(logger);
router.use(transport);

router.middleware(null, (req, res) => {
  // If noWait is true, we can just directly execute it without waiting.
  if (req.action.meta && req.action.meta.noWait === true) {
    const state = req.store.getState();
    if (state.connection.self != null) {
      let connection = state.connection.list[state.connection.self];
      // But, inject connection data before actually resolving it.
      res.resolve(Object.assign({}, req.action, {
        meta: Object.assign({}, req.action.meta, {
          connection
        })
      }));
      // Still, we have to dispatch it to the remote server.
      req.connector.dispatch(req.action, -1, true)
      .then(action => {
        if (isFSA(action) && action.error) {
          return req.store.dispatch(Object.assign({}, action, {
            meta: Object.assign({}, action.meta, {
              class: 'internal'
            })
          }));
        }
      }, error => {
        if (error instanceof Error) {
          return req.store.dispatch(Object.assign({}, req.action, {
            payload: {
              message: error.message,
              stack: error.stack
            },
            meta: Object.assign({}, req.action.meta, {
              class: 'internal'
            }),
            error: true
          }));
        }
        return req.store.dispatch(Object.assign({}, req.action, {
          payload: error,
          meta: Object.assign({}, req.action.meta, {
            class: 'internal'
          }),
          error: true
        }));
      });
      return;
    }
  }
  req.connector.dispatch(req.action, -1, true)
  .then(res.resolve, res.reject);
});

router.poll(null, (req, res) => {
  res.resolve(req.store.dispatch(Object.assign({}, req.action, {
    meta: Object.assign({}, req.action.meta, {
      class: 'internal'
    })
  })));
});

export default router;
