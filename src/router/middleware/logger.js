// Just a logger.

/* eslint-disable no-console */

export default function logger(req, res, next) {
  let type = (req.action && req.action.type) || '@@invalid';
  let time = new Date().toTimeString();
  let target = 'dispatch';
  if (req.cause === 'poll') target = 'poll/' + req.connection;
  let targetColor = target === 'dispatch' ? 'magenta' : 'yellow';
  // Ignore dispatch actions, as it is not really necessary to process in here.
  if (target === 'dispatch') return next();
  if (__SERVER__) {
    const colors = require('colors/safe');
    console.log(colors[targetColor](target) + ' @ ' +
      colors.blue(type) + ' ' + time);
    console.log('  payload:', req.action.payload);
  } else {
    console.log('%c%s%c @ %c%s%c %s', `color: #3085D5`, target, '',
      'font-weight: bold; color: #39A63A', type, '', time);
    console.log('%c  payload: %o', 'color: #000', req.action.payload);
  }
  next();
}
