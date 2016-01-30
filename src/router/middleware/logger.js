// Just a logger.

/* eslint-disable no-console */

export default function logger(req, next) {
  let type = (req.action && req.action.type) || '@@invalid';
  let time = new Date().toTimeString();
  let target = 'dispatch';
  if (req.cause === 'poll') target = 'poll/' + req.connection;
  let targetColor = target === 'dispatch' ? 'magenta' : 'yellow';
  if (typeof __SERVER__ === 'undefined' || __SERVER__) {
    const colors = require('colors/safe');
    console.log(colors[targetColor](target) + ' @ ' +
      colors.blue(type) + ' ' + time);
    console.log('  payload:', req.action.payload);
    console.log('  meta:', req.action.meta);
  } else {
    // Ignore dispatch actions, as it is not really necessary to process in
    // here, in clients. However servers lack of redux logger so we still
    // need them.
    if (target === 'dispatch') return next();
    console.log('%c%s%c @ %c%s%c %s', `color: #3085D5`, target, '',
      'font-weight: bold; color: #39A63A', type, '', time);
    console.log('%c  payload: %o', 'color: #000', req.action.payload);
    console.log('%c  meta: %o', 'color: #000', req.action.meta);
  }
  return next();
}
