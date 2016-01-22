
exports.up = function(knex) {
  return knex.schema.createTable('passports', table => {
    table.increments('id').primary();
    table.string('type', 16).notNullable();
    table.string('identifier').notNullable();
    table.text('data');
    table.integer('user_id').references('users.id');
    table.index(['type', 'identifier']);
    table.unique(['type', 'identifier']);
  }).createTable('users', table => {
    table.increments('id').primary();
    table.string('username', 32).notNullable().unique().index();
    table.boolean('isAdmin').defaultTo(false);
    table.boolean('enabled').defaultTo(true);
    table.boolean('signedUp').defaultTo(false);
    // This will be swapped to '__OAUTH_TMP_' + id in oAuth register state.
    table.string('email').notNullable().unique().index();
    table.string('name', 32);
    table.text('bio');
    table.string('photo', 511);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('passports')
    .dropTable('users');
};
