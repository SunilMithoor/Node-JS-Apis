'use strict';

// npx sequelize-cli init
// npx sequelize-cli migration:generate --name add-status-to-users
// npx sequelize-cli migration:create --name modify_users_add_new_fields
// npx sequelize-cli db:migrate

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'users', // table name
        'createdBy', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'users',
        'updatedBy',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
    ]);
  },

  // down(queryInterface, Sequelize) {
  //   // logic for reverting the changes
  //   return Promise.all([
  //     queryInterface.removeColumn('Users', 'linkedin'),
  //     queryInterface.removeColumn('Users', 'twitter'),
  //     queryInterface.removeColumn('Users', 'bio'),
  //   ]);
  // },
};
