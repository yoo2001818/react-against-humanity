import { isFSA } from 'flux-standard-action';

export default function runAction(req) {
  const store = req.store;
  const originAction = req.action;
  return promise => promise.then(action => {
    if (isFSA(action)) {
      const returned = store.dispatch(Object.assign({}, action, {
        meta: Object.assign({}, action.meta, {
          class: 'internal'
        })
      }));
      // Reject errored actions
      if (action.error) throw returned;
      return returned;
    }
  }, error => {
    if (error instanceof Error) {
      store.dispatch(Object.assign({}, originAction, {
        payload: {
          message: error.message,
          stack: error.stack
        },
        meta: Object.assign({}, originAction.meta, {
          class: 'internal'
        }),
        error: true
      }));
      throw error;
    }
    store.dispatch(Object.assign({}, originAction, {
      payload: error,
      meta: Object.assign({}, originAction.meta, {
        class: 'internal'
      }),
      error: true
    }));
    throw error;
  });
}
