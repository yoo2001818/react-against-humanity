import * as Transport from '../../action/transport';
import * as Connection from '../../action/connection';
import Router from '../../utils/router';

const router = new Router();

router.poll(Transport.CLOSE, (req, res) => {
  const { connection: { list } } = req.store.getState();
  // Ignore if connection is not created yet
  if (list[req.connection] == null) return res.resolve();
  // Dispatch disconnect event
  req.store.dispatch(Connection.disconnect(
    Object.assign({}, list[req.connection], {
      code: req.action.payload.code,
      reason: req.action.payload.reason
    })
  ))
  .then(res.resolve, res.reject);
  // .then(res.resolve, res.reject);
});

export default router;
