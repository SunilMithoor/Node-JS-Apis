"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Users",
      {
        userId: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        userName: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        firstName: {
          type: DataTypes.STRING,
        },
        lastName: {
          type: DataTypes.STRING,
        },
        dateOfBirth: {
          type: DataTypes.STRING,
        },
        userType: {
          type: DataTypes.ENUM,
          values: ["super-admin", "admin", "user"], // Define your ENUM values
          defaultValue: "", // Optional default value
          allowNull: false,
        },
        fcmToken: {
          type: DataTypes.STRING,
        },
        mobileNo: {
          type: DataTypes.INTEGER,
          unique: true,
        },
        mobileNoVerificationToken: {
          type: DataTypes.STRING,
        },
        isMobileNoVerified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
        },
        emailVerificationToken: {
          type: DataTypes.STRING,
        },
        isEmailVerified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        authToken: {
          type: DataTypes.STRING,
        },
        gender: {
          type: DataTypes.INTEGER,
        },
        userVerified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        imageUrl: {
          type: DataTypes.STRING,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        deletedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        createdBy: {
          type: DataTypes.INTEGER,
        },
        updatedBy: {
          type: DataTypes.INTEGER,
        },
        loggedOut: {
          type: DataTypes.DATE,
        },
        status: {
          type: DataTypes.ENUM,
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
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        userId: {
          type: DataTypes.INTEGER,
          userId: {
            type: DataTypes.INTEGER,
            references: {
              model: userModel,
              key: "userId",
            },
          },
        },
        fileType: {
          type: DataTypes.STRING,
        },
        name: {
          type: DataTypes.STRING,
        },
        filePath: {
          type: DataTypes.STRING,
        },
        module: {
          type: DataTypes.ENUM,
          values: ["profile", "products"], // Define your ENUM values
          defaultValue: "", // Optional default value
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        deletedAt: {
          type: DataTypes.DATE,
        },
        createdBy: {
          type: DataTypes.INTEGER,
        },
        updatedBy: {
          type: DataTypes.INTEGER,
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
