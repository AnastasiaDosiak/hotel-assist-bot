import { roomTypes } from "./common/constants";
import { Room } from "./models/Room";
import { ExtraService } from "./models/ExtraService";
import i18next from "i18next";
import { faker } from "@faker-js/faker";
import { FrequentlyAskedQuestion } from "./models/FrequentlyAskedQuestion";
import { Feedback } from "./models/Feedback";

export const generateFAQ = async () => {
  await FrequentlyAskedQuestion.bulkCreate([
    {
      id: faker.string.uuid(),
      title: i18next.t("faqSection.whatServicesOffer"),
      answer: i18next.t("faqSection.whatServicesOfferAnswer"),
    },
    {
      id: faker.string.uuid(),
      title: i18next.t("faqSection.spaWorkingHours"),
      answer: i18next.t("faqSection.spaWorkingHoursAnswer"),
    },
    {
      id: faker.string.uuid(),
      title: i18next.t("faqSection.spaTreatments"),
      answer: i18next.t("faqSection.spaTreatmentsAnswer"),
    },
    {
      id: faker.string.uuid(),
      title: i18next.t("faqSection.detoxAndWelnessPrograms"),
      answer: i18next.t("faqSection.detoxAndWelnessProgramsAnswer"),
    },
    {
      id: faker.string.uuid(),
      title: i18next.t("faqSection.golfCost"),
      answer: i18next.t("faqSection.golfCostAnswer"),
    },
    {
      id: faker.string.uuid(),
      title: i18next.t("faqSection.rentConferenceRoom"),
      answer: i18next.t("faqSection.rentConferenceRoomAnswer"),
    },
    {
      id: faker.string.uuid(),
      title: i18next.t("faqSection.restaurants"),
      answer: i18next.t("faqSection.restaurantsAnswer"),
    },
    {
      id: faker.string.uuid(),
      title: i18next.t("faqSection.wedding"),
      answer: i18next.t("faqSection.weddingAnswer"),
    },
    {
      id: faker.string.uuid(),
      title: i18next.t("faqSection.gym"),
      answer: i18next.t("faqSection.gymAnswer"),
    },
    {
      id: faker.string.uuid(),
      title: i18next.t("faqSection.transfer"),
      answer: i18next.t("faqSection.transferAnswer"),
    },
    {
      id: faker.string.uuid(),
      title: i18next.t("faqSection.booking"),
      answer: i18next.t("faqSection.bookingAnswer"),
    },
    {
      id: faker.string.uuid(),
      title: i18next.t("faqSection.changeBooking"),
      answer: i18next.t("faqSection.changeBookingAnswer"),
    },
  ]);
};

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
      bookedBy: [
        {
          userId: "userId",
          phone: "380959272623",
          startDate: "29/10/2024",
          endDate: "03/11/2024",
          serviceName: "SPA",
          programName: "One day programs",
          option: "Abonment Wellness-Day",
          serviceBookingStage: "check_availability",
          firstName: "mommy",
          lastName: "dsmamaa",
        },
      ],
      extraServices: [],
    });
  }
};

export const generateFeedbacks = async (feedbacks: number) => {
  for (let i = 0; i < feedbacks; i++) {
    await Feedback.create({
      id: faker.string.uuid(),
      estimation: faker.number.int({ min: 1, max: 5 }),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      comment: faker.lorem.sentence(),
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
              bookedBy: [],
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
      serviceName: i18next.t("extraServices.restaurants"),
      // can be several per day, we need hours here
      programs: [
        {
          options: [
            {
              name: i18next.t("extraServices.restaurantPanorama"),
              description: i18next.t(
                "extraServices.restaurantPanoramaDescription",
              ),
              imageUrl:
                "https://edemresort.com/wp-content/uploads/2018/03/LUT_1685-1920x1282.jpg",
              availableTables: faker.number.int({ min: 1, max: 40 }),
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.restaurantDeVine"),
              description: i18next.t(
                "extraServices.restaurantDeVineDescription",
              ),
              imageUrl:
                "https://edemresort.com/wp-content/uploads/2018/03/EDEM105-1-1920x1280.jpg",
              availableTables: faker.number.int({ min: 1, max: 50 }),
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.restaurantEdem"),
              description: i18next.t("extraServices.restaurantEdemDescription"),
              imageUrl:
                "https://edemresort.com/wp-content/uploads/2019/03/DSC_9469-Exposure-0000-1920x1282.jpg",
              availableTables: faker.number.int({ min: 1, max: 30 }),
              bookedBy: [],
            },
          ],
        },
      ],
    },
    {
      id: faker.string.uuid(),
      serviceName: i18next.t("extraServices.golfClub"),
      programs: [
        {
          options: [
            {
              name: i18next.t("extraServices.golfClubInfoName"),
              description: i18next.t(
                "extraServices.golfClubGeneralInformation",
              ),
              imageUrl:
                "https://edemresort.com/wp-content/uploads/2024/04/IMG_9120.jpeg",
            },
          ],
        },
      ],
    },
    {
      id: faker.string.uuid(),
      serviceName: i18next.t("extraServices.extraCleaning"),
      startWorkingTime: "10:00",
      endWorkingTime: "18:00",
      programs: [
        {
          // can be one per day
          options: [
            {
              name: i18next.t("extraServices.extraCleaningInformation"),
              description: i18next.t("extraServices.extraCleaningInformation"),
              price: "1 000 UAH",
              bookedBy: [],
            },
          ],
        },
      ],
    },
    {
      id: faker.string.uuid(),
      serviceName: i18next.t("extraServices.laundry"),
      programs: [
        {
          // can be several per day, we need hours here
          options: [
            {
              name: i18next.t("extraServices.laundryShirt"),
              description: i18next.t("extraServices.laundryShirtDesc"),
              price: "300 UAH",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.laundryPants"),
              description: i18next.t("extraServices.laundryPantsDesc"),
              price: "350 UAH",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.laundryDress"),
              description: i18next.t("extraServices.laundryDressDesc"),
              price: "350 UAH",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.laundrySuit"),
              description: i18next.t("extraServices.laundrySuitDesc"),
              price: "700 UAH",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.laundryTshirt"),
              description: i18next.t("extraServices.laundryTshirtDesc"),
              price: "300 UAH",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.laundrySweater"),
              description: i18next.t("extraServices.laundrySweaterDesc"),
              price: "500 UAH",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.laundryUnderwear"),
              description: i18next.t("extraServices.laundryUnderwearDesc"),
              price: "200 UAH",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.laundrySocks"),
              description: i18next.t("extraServices.laundrySocksDesc"),
              price: "100 UAH",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.laundryJacket"),
              description: i18next.t("extraServices.laundryJacketDesc"),
              price: "520 UAH",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.laundryBathrobe"),
              description: i18next.t("extraServices.laundryBathrobeDesc"),
              price: "280 UAH",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.laundryTowels"),
              description: i18next.t("extraServices.laundryTowelsDesc"),
              price: "200 UAH",
              bookedBy: [],
            },
            {
              name: i18next.t("extraServices.laundryFullService"),
              description: i18next.t("extraServices.laundryFullServiceDesc"),
              price: "1 500 UAH",
              bookedBy: [],
            },
          ],
        },
      ],
    },
  ]);
};
