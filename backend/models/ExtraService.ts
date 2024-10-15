import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class ExtraService extends Model {
  public id!: string;
  public serviceName!: string;
  public programs!: {
    programName: string;
    options: string[];
  }[];
}

ExtraService.init(
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    serviceName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    programs: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: "extra_services",
  },
);
