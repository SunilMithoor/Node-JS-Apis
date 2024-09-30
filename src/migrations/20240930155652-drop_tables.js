'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
  },

  down: async (queryInterface, Sequelize) => {
   
     // Drop the 'users' table
     await queryInterface.dropTable('users');

     // Drop the 'images' table 
     await queryInterface.dropTable('images');
  
  },
};