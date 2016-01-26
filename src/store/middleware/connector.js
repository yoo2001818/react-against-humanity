import { isFSA } from 'flux-standard-action';

export default function connectorMiddleware(connector) {
  return store => next => action => {
    if (!isFSA(action)) return next(action);
    const { meta } = action;
    if (!meta) return next(action);
    if (meta && meta.class !== 'read' && meta.class !== 'write') {
      return next(action);
    }

    // This should return a Promise.
    return connector.notify(action)
    .then(action => {
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
        throw store.dispatch(Object.assign({}, action, {
          payload: {
            message: error.message,
            stack: error.stack
          },
          meta: Object.assign({}, meta, {
            class: 'internal'
          }),
          error: true
        }));
      }
      throw store.dispatch(Object.assign({}, action, {
        payload: error,
        meta: Object.assign({}, meta, {
          class: 'internal'
        }),
        error: true
      }));
    });
  };
}
