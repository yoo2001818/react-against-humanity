import bookshelf from './init';

export const User = bookshelf.Model.extend({
  tableName: 'users'
});
