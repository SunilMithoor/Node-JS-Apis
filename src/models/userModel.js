module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
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
        defaultValue: "user", // Optional default value
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
        type: DataTypes.STRING(2048),
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

  return User;
};
