import * as Connection from '../../action/connection';
import Router from '../../utils/router';

const router = new Router();

router.poll(Connection.HANDSHAKE, (req, res) => {
  // Translate request...
  let action = Connection.connect(Object.assign({}, req.action.payload, {
    id: req.connection
  }));
  req.store.dispatch(action)
  .then(() => {
    const state = req.store.getState();
    res.resolve(Connection.handshake({
      connection: {
        self: action.meta.connection,
        list: state.connection.list
      }
    }));
  }, res.reject);
  // .then(res.resolve, res.reject);
});

export default router;
