import { roomTypes } from "./common/constants";
import { Room } from "./models/room";
import { ExtraService } from "./models/ExtraService";
import i18next from "i18next";
import { faker } from "@faker-js/faker";

export const generateRooms = async (numRooms: number) => {
  for (let i = 0; i < numRooms; i++) {
    const roomType = faker.helpers.arrayElement(roomTypes);

    await Room.create({
      id: faker.string.uuid(),
      type: roomType.type,
      available: faker.datatype.boolean(),
      price: roomType.price,
      currency: "UAH",
      imageUrl: roomType.imageUrl,
      roomNumber: faker.number.int({ min: 1, max: 50 }),
      bookedDates: [],
      minGuests: roomType.minGuests,
      maxGuests: roomType.maxGuests,
      bookedBy: [],
      extraServices: [],
    });
  }
};

export const generateExtraServices = async () => {
  await ExtraService.bulkCreate([
    {
      id: faker.string.uuid(),
      serviceName: i18next.t("extraServices.spa"),
      programs: [
        {
          programName: i18next.t("extraServices.oneDayPrograms"),
          options: [
            i18next.t("extraServices.abonmentWellnessDay"),
            i18next.t("extraServices.spaDayRelaxation"),
          ],
        },
        {
          programName: i18next.t("extraServices.threeDaysPrograms"),
          options: [
            i18next.t("extraServices.antiStressWeekend"),
            i18next.t("extraServices.weekendEasternStyle"),
            i18next.t("extraServices.expressRecoveryOfTheBody"),
            i18next.t("extraServices.spaDetox"),
            i18next.t("extraServices.mentalHealth"),
          ],
        },
      ],
    },
    {
      id: faker.string.uuid(),
      serviceName: i18next.t("extraServices.edemClinic"),
      programs: [
        {
          options: [
            i18next.t("extraServices.detoxNew"),
            i18next.t("extraServices.productivity"),
            i18next.t("extraServices.detoxBody"),
            i18next.t("extraServices.regenerationOfProductivity"),
            i18next.t("extraServices.recoveryAndDetectionOfDiseaseRisks"),
            i18next.t("extraServices.detoxBodyAndMind"),
            i18next.t("extraServices.reEnergy"),
            i18next.t("extraServices.fitHealth"),
          ],
        },
      ],
    },
    {
      id: faker.string.uuid(),
      serviceName: i18next.t("extraServices.sport"),
      programs: [
        {
          options: [
            i18next.t("extraServices.golf"),
            i18next.t("extraServices.tennis"),
            i18next.t("extraServices.aquaAerobics"),
            i18next.t("extraServices.yoga"),
            i18next.t("extraServices.kenesis"),
            i18next.t("extraServices.miniFootball"),
            i18next.t("extraServices.scandinavianWalking"),
            i18next.t("extraServices.fitness"),
            i18next.t("extraServices.sup"),
            i18next.t("extraServices.flyYoga"),
            i18next.t("extraServices.powerYoga"),
            i18next.t("extraServices.backHorseRiding"),
          ],
        },
      ],
    },
    {
      id: faker.string.uuid(),
      serviceName: i18next.t("extraServices.restaurants"),
      programs: [
        {
          options: [
            i18next.t("extraServices.restaurantPanorama"),
            i18next.t("extraServices.restaurantDeVine"),
            i18next.t("extraServices.restaurantEdem"),
          ],
        },
      ],
    },
    {
      id: faker.string.uuid(),
      serviceName: i18next.t("extraServices.golfClub"),
      programs: [
        {
          options: i18next.t("extraServices.generalInformation"),
        },
      ],
    },
    {
      id: faker.string.uuid(),
      serviceName: i18next.t("extraServices.roomServices"),
      programs: [
        {
          options: [
            i18next.t("extraServices.extraCleaning"),
            i18next.t("extraServices.laundry"),
            i18next.t("extraServices.transfer"),
            i18next.t("extraServices.foodFromRestaurantIntoRoom"),
          ],
        },
      ],
    },
  ]);
};
