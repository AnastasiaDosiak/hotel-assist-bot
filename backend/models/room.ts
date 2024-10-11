import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { TServiceStatus } from "../common/types";

export class Room extends Model {
  public id!: string;
  public type!: string;
  public price!: number;
  public currency!: string;
  public imageUrl!: string;
  public roomNumber!: number;
  public minGuests!: number;
  public maxGuests!: number;
  public bookedBy!: {
    userId: string;
    phone: string;
    firstName: string;
    lastName: string;
    startDate: string;
    endDate: string;
  }[];
  public extraServices!: {
    serviceName: string;
    status: TServiceStatus;
  }[];
}

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
    minGuests: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    maxGuests: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bookedBy: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    extraServices: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: "rooms",
  },
);
