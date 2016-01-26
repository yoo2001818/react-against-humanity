import * as Chat from '../../action/chat';
import Router from '../../utils/router';
import setConnection from '../middleware/setConnection';
import checkLogin from '../middleware/checkLogin';

const router = new Router();

router.poll(Chat.CHAT, setConnection, checkLogin, (req, res) => {
  // Passthrough
  req.store.dispatch(req.action)
  .then(() => {
    res.resolve(req.action);
  }, res.reject);
  // .then(res.resolve, res.reject);
});

export default router;
