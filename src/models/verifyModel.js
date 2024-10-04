module.exports = (sequelize, DataTypes) => {
  const VerifyUser = sequelize.define(
    "VerifyUser",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      contactType: {
        type: DataTypes.ENUM("email", "mobile"),
        allowNull: false, // Specify whether the verification is for email or mobile
      },
      contactValue: {
        type: DataTypes.STRING,
        allowNull: false, // The email address or mobile number being verified
      },
      verificationCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users", // Use the string name of the Users model
          key: "userId", // Foreign key that references User model
        },
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
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
      timestamps: true, // Adds createdAt and updatedAt columns
      paranoid: true, // Enables soft delete (using deletedAt)
    }
  );

  // Define relationships
  VerifyUser.associate = (models) => {
    VerifyUser.belongsTo(models.Users, { foreignKey: "userId" }); // Associate with User
  };

  return VerifyUser;
};
