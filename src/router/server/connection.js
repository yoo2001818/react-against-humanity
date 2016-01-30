import * as Connection from '../../action/connection';
import Router from '../../utils/router';
import setConnection from '../middleware/setConnection';
import checkLogin from '../middleware/checkLogin';
// import passThrough from '../middleware/passThrough';

const router = new Router();

router.poll(Connection.HANDSHAKE, req => {
  // Obtain session.
  let session = req.connector.getClient(req.connection).session;
  if (session == null) {
    // This is pretty unexpected. What...
    throw new Error('Server hasn\'t loaded session data yet');
  }
  // Otherwise, check if connection value is present
  if (session.connection != null) {
    // This will be a problem if the session persists, but connection list
    // doesn't. We'll have to generate UUID after startup and silently
    // fail when it's not equal to session data.
    const { connection: { list } } = req.store.getState();
    let connection = list[session.connection];
    if (!connection.exited) {
      // Give it a time to send action first
      setTimeout(() => {
        // Then disconnect
        req.connector.disconnect(1008,
          'Multiple connection is not supported yet', req.connection);
      }, 10);
      throw new Error('Multiple connection is not supported yet');
    }
  }
  // Set the connection value.
  session.connection = req.connection;
  // We don't have to wait for the callback; it's not necessary.
  session.save();
  // Translate request...
  // Inject authentication information from session
  let action = Connection.connect(Object.assign({
    id: req.connection
  }, session.auth));
  return req.store.dispatch(action)
  .then(() => {
    const state = req.store.getState();
    return Connection.handshake({
      connection: {
        self: action.meta.target.connection,
        list: state.connection.list
      },
      chat: state.chat,
      room: state.room
    });
  });
  // .then(res.resolve, res.reject);
});

router.poll(Connection.LOGIN, req => {
  // Handle login request, currently only supports 'guest' level.
  const { payload } = req.action;
  if (payload.level !== 'guest') {
    throw new Error('Only supports guest level for now');
  }
  // Guest routine.
  if (typeof payload.name !== 'string' || payload.name.trim().length == 0) {
    throw new Error('Nickname must be specified');
  }
  if (/\s/.exec(payload.name)) {
    throw new Error('Nickname cannot contain whitespace characters');
  }
  let auth = {
    level: payload.level,
    name: payload.name
  };
  // Done! let's send it to the reducer.
  let action = Connection.login(Object.assign({
    id: req.connection
  }, auth));
  return req.store.dispatch(action)
  .then(action => {
    // Set the session data if succeeded
    let session = req.connector.getClient(req.connection).session;
    if (session == null) {
      throw new Error('Session data not found');
    }
    session.auth = auth;
    session.save();
    return action;
  });
});

router.poll(Connection.LOGOUT, checkLogin, setConnection, req => {
  return req.store.dispatch(req.action)
  .then(action => {
    // Delete the session data
    let session = req.connector.getClient(req.connection).session;
    if (session == null) {
      throw new Error('Session data not found');
    }
    delete session.auth;
    session.save();
    return action;
  });
});

export default router;
