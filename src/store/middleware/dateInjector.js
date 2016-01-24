export const dateInjector = () => next => action => {
  if (action.meta.date) return next(action);
  return next(Object.assign({}, action, {
    meta: Object.assign({}, action.meta, {
      date: new Date().valueOf()
    })
  }));
};

export default dateInjector;
