import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db"; // Import the sequelize instance

// Define the Room model
export class Room extends Model {
  public id!: string;
  public type!: string;
  public bookedDates!: string[];
  public price!: number;
  public currency!: string;
  public imageUrl!: string;
  public roomNumber!: number;
}

// Initialize the Room model with Sequelize
Room.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookedDates: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roomNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize, // Pass the sequelize instance
    tableName: "rooms",
  },
);
