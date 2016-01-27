// Session middleware adapter for WebSocket.
// Original code from express-session

import cookie from 'cookie';
import parseUrl from 'parseurl';
import signature from 'cookie-signature';
import Session from 'express-session/session/session';

import rawDebug from 'debug';
const debug = rawDebug('app:ws-session');

export default class SessionAdapter {
  constructor(options = {}) {
    this.options = Object.assign(options, {
      name: options.name || options.key || 'connect.sid',
      store: options.store
    });
    let store = this.options.store;

    this.cookieOptions = options.cookie || {};
    this.storeReady = true;
    this.storeImplementsTouch = typeof store.touch === 'function';
    // Saving *new* session is not possible after WebSocket init, so that must
    // be done before connecting to websocket.

    // Errors will be checked by express-session middleware.

    if (this.options.secret && !Array.isArray(this.options.secret)) {
      this.options.secret = [this.options.secret];
    }

    store.on('disconnect', () => {
      this.storeReady = false;
    });
    store.on('connect', () => {
      this.storeReady = false;
    });
  }
  // This accepts raw connection headers from websocket (upgradeReq),
  // and returns a session. rejects if it cannot be found.
  getSession(req) {
    // Handle connection as if there is no session if
    // the store has temporarily disconnected etc
    if (!this.storeReady) {
      debug('store is disconnected');
      return Promise.reject();
    }
    // pathname mismatch
    // Is this necessary?
    const originalPath = parseUrl.original(req).pathname;
    if (originalPath.indexOf(this.cookieOptions.path || '/') !== 0) {
      return Promise.reject();
    }
    const store = this.options.store;
    const secrets = this.options.secret;
    const name = this.options.name;
    let cookieId = getcookie(req, name, secrets);

    // Some saving related code goes here, it's not necessary for websockets.
    // sid generation goes here, which is useless in here.
    // Some bunch of useless code...

    if (!cookieId) return Promise.reject();

    debug('fetching %s', cookieId);
    return new Promise((resolve, reject) => {
      store.get(cookieId, (err, sess) => {
        if (err) {
          debug('error %j', err);
          reject();
        } else if (!sess) {
          debug('no session found');
          reject();
        } else {
          debug('session found');
          // Great! resolve it..
          resolve(new Session({
            sessionStore: store,
            sessionID: cookieId
          }, sess));
        }
      });
    });
  }
}

/**
 * Get the session ID cookie from request.
 *
 * @return {string}
 * @private
 */

function getcookie(req, name, secrets) {
  var header = req.headers.cookie;
  var raw;
  var val;

  // read from cookie header
  if (header) {
    var cookies = cookie.parse(header);

    raw = cookies[name];

    if (raw) {
      if (raw.substr(0, 2) === 's:') {
        val = unsigncookie(raw.slice(2), secrets);

        if (val === false) {
          debug('cookie signature invalid');
          val = undefined;
        }
      } else {
        debug('cookie unsigned');
      }
    }
  }

  // cookie-parser compat code goes here, but this isn't necessary in here.
  return val;
}

/**
 * Verify and decode the given `val` with `secrets`.
 *
 * @param {String} val
 * @param {Array} secrets
 * @returns {String|Boolean}
 * @private
 */
function unsigncookie(val, secrets) {
  for (var i = 0; i < secrets.length; i++) {
    var result = signature.unsign(val, secrets[i]);

    if (result !== false) {
      return result;
    }
  }

  return false;
}
