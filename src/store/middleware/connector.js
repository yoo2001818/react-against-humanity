import { isFSA } from 'flux-standard-action';

export default function connectorMiddleware(connector) {
  return () => next => action => {
    if (!isFSA(action)) return next(action);
    const { meta } = action;
    if (!meta) return next(action);
    if (meta && meta.class !== 'read' && meta.class !== 'write') {
      return next(action);
    }

    // This should return a Promise.
    // However we just notify it; don't do anything else!
    return connector.notify(action);
  };
}
