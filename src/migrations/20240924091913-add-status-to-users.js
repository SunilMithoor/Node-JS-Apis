'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'status', {
      type: Sequelize.ENUM('active', 'inactive'), // ENUM values
      defaultValue: 'active', // Default value
      allowNull: false, // Prevent null values
    });
  },

  // down: async (queryInterface, Sequelize) => {
  //   // Remove the 'status' column and ENUM type
  //   await queryInterface.removeColumn('Users', 'status');
  //   await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Users_status";');
  // },
};