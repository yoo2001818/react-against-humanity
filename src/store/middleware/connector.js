import { isFSA } from 'flux-standard-action';

export default function connectorMiddleware(connector) {
  return () => next => action => {
    if (!isFSA(action)) return next(action);
    const { meta } = action;
    if (meta && meta.class !== 'read' && meta.class !== 'write') {
      return next(action);
    }

    // This should return a Promise.
    return connector.notify(action)
    .then(action => {
      if (isFSA(action)) {
        return next(action);
      }
    }, error => {
      if (error instanceof Error) {
        return next(Object.assign({}, action, {
          payload: {
            message: error.message,
            stack: error.stack
          },
          error: true
        }));
      }
      return next(Object.assign({}, action, {
        payload: error,
        error: true
      }));
    });
  };
}
