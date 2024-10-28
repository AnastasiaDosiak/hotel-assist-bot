import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Feedback extends Model {
  public id!: string;
  public estimation!: number;
  public firstName?: string;
  public lastName?: string;
  public comment!: string;
}

Feedback.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    estimation: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "feedbacks",
  },
);
