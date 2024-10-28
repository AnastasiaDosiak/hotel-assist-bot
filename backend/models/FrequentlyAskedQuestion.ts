import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class FrequentlyAskedQuestion extends Model {
  public id!: string;
  public title!: string;
  public answer!: string;
}

FrequentlyAskedQuestion.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize, tableName: "frequenltyAskedQuestions" },
);
