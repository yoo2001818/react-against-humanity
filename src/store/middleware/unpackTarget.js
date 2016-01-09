export const unpackTarget = store => next => action => {
  // Unpacks the target to actual ID.
  if (!action) return next(action);
  if (!action.meta) return next(action);
  if (!action.meta.target) return next(action);
  const target = action.meta.target;
  let newTarget = {};
  const state = store.getState();
  if (target.connection != null) {
    newTarget.connection = state.connection.list[target.connection] || {
      id: target.connection
    };
  }
  if (target.room != null) {
    // Room remains the same
    newTarget.room = target.room;
  }
  return next(Object.assign({}, action, {
    meta: Object.assign({}, action.meta, {
      target: newTarget
    })
  }));
};

export default unpackTarget;
