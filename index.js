// Set up global variables
var PRODUCTION = process.env.NODE_ENV === 'production';
GLOBAL.__SERVER__ = true;
GLOBAL.__CLIENT__ = false;
GLOBAL.__DEVELOPMENT__ = !PRODUCTION;
GLOBAL.__DEVTOOLS__ = false;
  
// Support ES6
require('babel-core/register');

// Just simply link to src/server.js
require('./src/server.js');
