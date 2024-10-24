import { roomTypes } from "./common/constants";
import { Room } from "./models/Room";
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
            {
              name: i18next.t("extraServices.abonmentWellnessDay"),
              description: i18next.t("extraServices.abonmentWellnessDayDesc"),
              price: "2500 UAH",
              imageUrl:
                "https://edemresort.com/wp-content/uploads/2022/05/IMG_4390.jpeg",
              bookedBy: [
                {
                  userId: "userId",
                  phone: "380959272623",
                  startDate: "24/10/2024",
                  endDate: "24/10/2024",
                  serviceName: "SPA",
                  programName: "One day programs",
                  option: "Abonment Wellness-Day",
                  serviceBookingStage: "check_availability",
                  firstName: "dsa",
                  lastName: "dsa",
                },
              ],
            },
            {
              name: i18next.t("extraServices.spaDayRelaxation"),
              description: i18next.t("extraServices.spaDayRelaxationDesc"),
              price: "15 000 UAH",
              imageUrl:
                "https://edemresort.com/wp-content/uploads/2018/03/87B0868-_-.jpg",
              bookedBy: [],
            },
          ],
        },
        {
          programName: i18next.t("extraServices.threeDaysPrograms"),
          options: [
            {
              name: i18next.t("extraServices.antiStressWeekend"),
              description: i18next.t("extraServices.antiStressWeekendDesc"),
              price: "33 900 UAH",
              imageUrl:
                "https://edemresort.com/wp-content/uploads/2018/05/EDEM-med-34.jpg",
              bookedBy: [
                {
                  userId: "userId",
                  phone: "380959272623",
                  startDate: "24/10/2024",
                  endDate: "27/10/2024",
                  serviceName: "SPA",
                  programName: "One day programs",
                  option: "Abonment Wellness-Day",
                  serviceBookingStage: "check_availability",
                  firstName: "mommy",
                  lastName: "dsmamaa",
                },
              ],
            },
            {
              name: i18next.t("extraServices.weekendEasternStyle"),
              description: i18next.t("extraServices.weekendEasternStyleDesc"),
              price: "29 900 UAH",
              imageUrl:
                "https://edemresort.com/wp-content/uploads/2019/04/MIK_8394-1-min.jpg",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.expressRecoveryOfTheBody"),
              description: i18next.t(
                "extraServices.expressRecoveryOfTheBodyDesc",
              ),
              price: "27 100 UAH",
              imageUrl:
                "https://edemresort.com/wp-content/uploads/2019/04/MIK_7618-1-min.jpg",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.spaDetox"),
              description: i18next.t("extraServices.spaDetoxDesc"),
              price: "34 600 UAH",
              imageUrl:
                "https://edemresort.com/wp-content/uploads/2019/04/DSC_6242-min.jpg",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.mentalHealth"),
              description: i18next.t("extraServices.mentalHealthDesc"),
              price: "63 200 UAH",
              imageUrl:
                "https://edemresort.com/wp-content/uploads/2022/09/369A8301.jpg",
              bookedBy: [],
            },
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
            {
              name: i18next.t("extraServices.detoxNew"),
              description: i18next.t("extraServices.detoxNewDescription"), //detoxNewDescription
              duration: 7,
              price: "126 243 UAH",
              imageUrl:
                "https://edemresort.com/wp-content/uploads/2018/02/IMG_2447-1.jpg",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.productivity"),
              description: i18next.t("extraServices.productivityDescription"),
              price: "52 300 UAH",
              duration: 3,
              imageUrl:
                "https://edemresort.com/wp-content/uploads/2022/08/191.jpg",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.detoxBody"),
              description: i18next.t("extraServices.detoxBodyDescription"),
              price: "49 558 UAH",
              duration: 3,
              imageUrl:
                "https://edemresort.com/wp-content/uploads/2022/06/beaty-medicine-45.jpg",
              bookedBy: [],
            },
            {
              name: i18next.t(
                "extraServices.recoveryAndDetectionOfDiseaseRisks",
              ),
              description: i18next.t(
                "extraServices.recoveryAndDetectionOfDiseaseRisksDescription",
              ),
              duration: 7,
              price: "125 303 UAH",
              imageUrl:
                "https://edemresort.com/wp-content/uploads/2022/04/medical-spa-302.jpg",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.detoxBodyAndMind"),
              description: i18next.t(
                "extraServices.detoxBodyAndMindDescription",
              ),
              duration: 7,
              price: "117 350 UAH",
              imageUrl:
                "https://edemresort.com/wp-content/uploads/2018/12/Detox-Body-Mind-min.jpg",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.reEnergy"),
              description: i18next.t("extraServices.reEnergyDescription"),
              price: "35 500 UAH",
              duration: 3,
              imageUrl:
                "https://edemresort.com/wp-content/uploads/2018/03/Kopiya-_Anti-stres-spa-vikend_rekomendovani-3.jpg",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.fitHealth"),
              description: i18next.t("extraServices.fitHealthDescription"),
              price: "43 200 UAH",
              duration: 3,
              imageUrl:
                "https://edemresort.com/wp-content/uploads/2018/02/IMG_2879.png",
              bookedBy: [],
            },
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
