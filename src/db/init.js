import Knex from 'knex';
import Bookshelf from 'bookshelf';
import * as dbConfig from '../../knexfile';

const knex = Knex(dbConfig.development);
const bookshelf = Bookshelf(knex);

export default bookshelf;
