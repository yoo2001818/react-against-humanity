export default class Route {
  constructor(classType, cause, type, routes) {
    this.classType = classType;
    this.cause = cause;
    this.type = type;
    this.stack = routes;
  }

  handle(req, res, next) {
    // Check request data first....
    if (this.classType != null &&
      this.classType !== (
        req.class || req.action && req.action.meta && req.action.meta.class
      )
    ) {
      return next();
    }
    if (this.cause != null && this.cause !== req.cause) {
      return next();
    }
    if (this.type != null) {
      // Check regular expression.
      let type = req.type || req.action && req.action.type;
      if (this.type instanceof RegExp) {
        if (!this.type.test(type)) return next();
      } else if (this.type !== type) return next();
    }
    let i = -1;
    const processNext = (err) => {
      i++;
      if (err) return next(err);
      if (i >= this.stack.length) {
        return next(err);
      }
      let current = this.stack[i];
      return current(req, res, processNext);
    };
    processNext();
  }
}
