"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Users",
      {
        userId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        userName: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        firstName: {
          type: Sequelize.STRING,
        },
        lastName: {
          type: Sequelize.STRING,
        },
        dateOfBirth: {
          type: Sequelize.STRING,
        },
        userType: {
          type: Sequelize.ENUM,
          values: ["super-admin", "admin", "user"], // Define your ENUM values
          defaultValue: "", // Optional default value
          allowNull: false,
        },
        fcmToken: {
          type: Sequelize.STRING,
        },
        mobileNo: {
          type: Sequelize.INTEGER,
          unique: true,
        },
        mobileNoVerificationToken: {
          type: Sequelize.STRING,
        },
        isMobileNoVerified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
        },
        emailVerificationToken: {
          type: Sequelize.STRING,
        },
        isEmailVerified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        authToken: {
          type: Sequelize.STRING,
        },
        gender: {
          type: Sequelize.INTEGER,
        },
        userVerified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        imageUrl: {
          type: Sequelize.STRING,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        deletedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        createdBy: {
          type: Sequelize.INTEGER,
        },
        updatedBy: {
          type: Sequelize.INTEGER,
        },
        loggedOut: {
          type: Sequelize.DATE,
        },
        status: {
          type: Sequelize.ENUM,
          values: ["active", "inactive"], // Define your ENUM values
          defaultValue: "active", // Optional default value
          allowNull: false,
        },
      },
      {
        timestamps: true, // Adds createdAt and updatedAt
        paranoid: true, // Enables soft deletes with deletedAt
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Files",
      {
        fileId: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          userId: {
            type: Sequelize.INTEGER,
            references: {
              model: "Users",
              key: "userId",
            },
          },
        },
        fileType: {
          type: Sequelize.STRING,
        },
        name: {
          type: Sequelize.STRING,
        },
        filePath: {
          type: Sequelize.STRING,
        },
        module: {
          type: Sequelize.ENUM,
          values: ["none", "profile", "products"], // Define your ENUM values
          defaultValue: "none", // Optional default value
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        deletedAt: {
          type: Sequelize.DATE,
        },
        createdBy: {
          type: Sequelize.INTEGER,
        },
        updatedBy: {
          type: Sequelize.INTEGER,
        },
      },
      {
        timestamps: true, // Adds createdAt and updatedAt
        paranoid: true, // Enables soft deletes with deletedAt
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("images");
  },
};
