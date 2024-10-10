import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Your Telegram bot token from BotFather
const token: string = process.env.TELEGRAM_TOKEN as string;

// Create a new bot instance with polling
const bot: TelegramBot = new TelegramBot(token, { polling: true });

// Listen for the "/start" command to show the main menu
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Create the main menu keyboard with options
  const options = {
    reply_markup: {
      keyboard: [
        [{ text: "Book a room" }],
        [{ text: "Information about LNUP services" }],
        [{ text: "Client support 24/7" }],
        [{ text: "Registration of additional services" }],
        [{ text: "Messages and reminders" }],
        [{ text: "Feedback and evaluations" }],
        [{ text: "Help for the city" }],
        [{ text: "Quick check-in/check-out" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  };

  bot.sendMessage(
    chatId,
    "Hello! I'm HotelAssist bot for LNUP hotel. How can I help you?",
    options,
  );
});

// Listen for button clicks
bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (msg.text === "Help for the city") {
    // Show inline keyboard for "Help for the city" options
    const cityHelpOptions = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Where to eat", callback_data: "where_to_eat" }],
          [{ text: "Where to go", callback_data: "where_to_go" }],
          [{ text: "How to get to Lviv", callback_data: "how_to_get_to_lviv" }],
        ],
      },
    };

    bot.sendMessage(chatId, "Please choose an option:", cityHelpOptions);
  }
});

// Handle the inline keyboard button clicks (callback queries)
bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message!;
  const data = callbackQuery.data;

  if (data === "where_to_eat") {
    bot.sendMessage(
      message.chat.id,
      `
1. Rockfor, Суші&Піца. Instagram: https://www.instagram.com/rockforr_/, address: Дубляни, вул. В. Великого 3
2. MyFavoriteCoffee, кава та смаколики. Instagram: https://www.instagram.com/myfavoritecoffee_ua/, address: м. Дубляни, вул. Шевченка 22 (біля банкомату Приватбанку)
3. Norway caffebakery, норвезькі вафлі та десерти. Instagram: https://www.instagram.com/norway_caffebakery/, address: вулиця Тараса Шевченка, 33, Дубляни
4. Coffee Lab, Сніданки, десерти, кава, вино. Instagram: https://www.instagram.com/coffeelabukraine/, address: вул. Михайла Коцюбинскього, 3, Дубляни
    `,
    );
  } else if (data === "where_to_go") {
    bot.sendMessage(
      message.chat.id,
      `
1. Будівлі колишньої вищої сільськогосподарської академії, а зараз - землевпорядний факультет університету ЛНУП. Степан Бандера навчався в цій академії. Адреса: вул. Володимира Великого, м. Дубляни.
2. Музей Степана Бандери. Відкрито 4 січня 1999 року. Музей має площу 60 кв. м. і понад 1600 одиниць збереження. Адреса: вул. Малинова, Дубляни.
    `,
    );
  } else if (data === "how_to_get_to_lviv") {
    bot.sendMessage(
      message.chat.id,
      `
Щоб добратися з Дублян до Львова, можна сісти на автобуси у 4 місцях:
1. У центрі Дублян.
2. Біля землевпорядного факультету ЛНУП (напроти пам'ятника Степана Бандері).
3. Біля головного входу в університет ЛНУП.
4. На виїзді/в'їзді з Дублян (біля Олімпії).

Курсує 3 автобуси до Львова: 180А, 111, та 1А.
    `,
    );
  }

  // Acknowledge the callback query
  bot.answerCallbackQuery(callbackQuery.id);
});
