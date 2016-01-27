// This is not a DB, however it'll be linked soon.

import MemoryStore from 'express-session/session/memory';
import session from 'express-session';
import SessionAdapter from '../utils/session';

let store = new MemoryStore();

export default store;

const options = {
  resave: false,
  saveUninitialized: false,
  // This should be saved in a config file, thus it needs to be changed
  // before launching it to the production!! TODO
  secret: '7il@2%kcJD^C0Doy"`+20HM9C1l/,auD',
  store
};

export const sessionMiddleware = session(options);

export const sessionAdapter = new SessionAdapter(options);
