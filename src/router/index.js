import Router from '../utils/router';

const router = new Router();

router.use((req, res, next) => {
  console.log('Baaa'); // eslint-disable-line no-console
  next();
});
