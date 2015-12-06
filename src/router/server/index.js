import Router from '../../utils/router';
import logger from '../middleware/logger';

const router = new Router();

router.use(logger);
router.use((req, res, next) => {
  next();
});

export default router;
