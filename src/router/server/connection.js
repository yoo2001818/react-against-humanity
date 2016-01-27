import * as Connection from '../../action/connection';
import Router from '../../utils/router';
import setConnection from '../middleware/setConnection';
import checkLogin from '../middleware/checkLogin';
import passThrough from '../middleware/passThrough';

const router = new Router();

router.poll(Connection.HANDSHAKE, (req, res) => {
  // Obtain session.
  let session = req.connector.getClient(req.connection).session;
  if (session == null) {
    // This is pretty unexpected. What...
    return res.reject(new Error('Server hasn\'t loaded session data yet'));
  }
  // Otherwise, check if connection value is present
  if (session.connection != null) {
    // This will be a problem if the session persists, but connection list
    // doesn't. We'll have to generate UUID after startup and silently
    // fail when it's not equal to session data.
    const { connection: { list } } = req.store.getState();
    let connection = list[session.connection];
    if (!connection.exited) {
      res.reject(new Error('Multiple connection is not supported yet'));
      // Give it a time to send action first
      setTimeout(() => {
        // Then disconnect
        req.connector.disconnect(1008,
          'Multiple connection is not supported yet', req.connection);
      }, 10);
      return;
    }
  }
  // Set the connection value.
  session.connection = req.connection;
  // We don't have to wait for the callback; it's not necessary.
  session.save();
  // Translate request...
  let action = Connection.connect({
    id: req.connection
  });
  req.store.dispatch(action)
  .then(() => {
    const state = req.store.getState();
    res.resolve(Connection.handshake({
      connection: {
        self: action.meta.target.connection,
        list: state.connection.list
      },
      chat: state.chat,
      room: state.room
    }));
  }, res.reject);
  // .then(res.resolve, res.reject);
});

router.poll(Connection.LOGIN, (req, res) => {
  // Handle login request, currently only supports 'guest' level.
  const { payload } = req.action;
  if (payload.level !== 'guest') {
    return res.reject(new Error('Only supports guest level for now'));
  }
  // Guest routine.
  if (typeof payload.name !== 'string' || payload.name.trim().length == 0) {
    return res.reject(new Error('Nickname must be specified'));
  }
  if (/\s/.exec(payload.name)) {
    return res.reject(
      new Error('Nickname cannot contain whitespace characters')
    );
  }
  // Done! let's send it to the reducer.
  let action = Connection.login({
    id: req.connection,
    level: payload.level,
    name: payload.name
  });
  req.store.dispatch(action)
  .then(res.resolve, res.reject);
});

router.poll(Connection.LOGOUT, checkLogin, setConnection, passThrough);

export default router;
