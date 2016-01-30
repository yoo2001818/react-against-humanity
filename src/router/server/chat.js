import * as Chat from '../../action/chat';
import Router from '../../utils/router';
import setConnection from '../middleware/setConnection';
import checkLogin from '../middleware/checkLogin';
import passThrough from '../middleware/passThrough';

const router = new Router();

router.poll(Chat.CHAT, setConnection, checkLogin, passThrough);

export default router;
