import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Feedback extends Model {
  public id!: string;
  public estimation!: number;
  public fullName?: string;
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
    fullName: {
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
    timestamps: true,
  },
);
