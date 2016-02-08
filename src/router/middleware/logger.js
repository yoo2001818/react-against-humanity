// Just a logger.

/* eslint-disable no-console */

function printError(err) {
  // Error received; print it.
  if (typeof __SERVER__ === 'undefined' || __SERVER__) {
    const colors = require('colors/safe');
    console.log('  ' + colors.red('error:'), err.stack);
  } else {
    console.log('%c  error: %o', 'color: #990000', err.stack);
  }
}

export default function logger(req, next) {
  let type = (req.action && req.action.type) || '@@invalid';
  let time = new Date().toTimeString();
  let target = 'dispatch';
  if (req.cause === 'poll') target = 'poll/' + req.connection;
  let targetColor = target === 'dispatch' ? 'magenta' : 'yellow';
  // Ignore dispatch actions.
  // if (target === 'dispatch') return next();
  if (typeof __SERVER__ === 'undefined' || __SERVER__) {
    const colors = require('colors/safe');
    console.log(colors[targetColor](target) + ' @ ' +
      colors.blue(type) + ' ' + time);
    console.log('  payload:', req.action.payload);
    console.log('  meta:', req.action.meta);
  } else {
    console.log('%c%s%c @ %c%s%c %s', `color: #3085D5`, target, '',
      'font-weight: bold; color: #39A63A', type, '', time);
    console.log('%c  payload: %o', 'color: #000', req.action.payload);
    console.log('%c  meta: %o', 'color: #000', req.action.meta);
  }
  let returned;
  try {
    returned = next();
  } catch (e) {
    printError(e);
    throw e;
  }
  if (returned && typeof returned.catch === 'function') {
    return returned.catch(e => {
      printError(e);
      throw e;
    });
  }
  return returned;
}
