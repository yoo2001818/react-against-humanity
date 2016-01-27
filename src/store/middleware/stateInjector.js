export const stateInjector = store => next => action => {
  return next(Object.assign({}, action, {
    meta: Object.assign({}, action.meta, {
      state: store.getState()
    })
  }));
};

export default stateInjector;
