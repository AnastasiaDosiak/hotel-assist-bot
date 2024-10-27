import { Model } from "sequelize";

export class BookedBy extends Model {
  public userId!: string;
  public phone!: string;
  public firstName!: string;
  public lastName!: string;
  public startDate!: string;
  public endDate!: string;
  public startBookingTime?: string;
  public endBookingTime?: string;
}
