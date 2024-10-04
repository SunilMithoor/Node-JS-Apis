module.exports = (sequelize, DataTypes) => {
  const Files = sequelize.define(
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
        references: {
          model: "Users", // Use the string name of the Users model
          key: "userId", // Foreign key that references User model
        },
        allowNull: false,
      },
      fileType: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      filePath: {
        type: DataTypes.STRING(2048),
      },
      module: {
        type: DataTypes.ENUM,
        values: ["none", "profile", "products"], // Define your ENUM values
        defaultValue: "none", // Optional default value
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

  // Define relationships
  Files.associate = (models) => {
    Files.belongsTo(models.Users, { foreignKey: "userId" }); // Associate with User
  };

  return Files;
};
