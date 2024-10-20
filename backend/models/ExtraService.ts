import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Option extends Model {
  public name!: string;
  public description!: string;
  public price!: string;
  public imageUrl!: string;
}

export class Program extends Model {
  public id!: string;
  public programName!: string;
  public options!: Option[];
}

export class ExtraService extends Model {
  public id!: string;
  public serviceName!: string;
  public programs!: Program[];
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
