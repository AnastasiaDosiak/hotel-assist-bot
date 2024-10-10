import TelegramBot from 'node-telegram-bot-api';

// Your Telegram bot token from BotFather
const token: string = process.env.TELEGRAM_TOKEN as string;

// Create a new bot instance with polling
const bot: TelegramBot = new TelegramBot(token, { polling: true });

// Listen for messages and respond
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || '';

  bot.sendMessage(chatId, `Hello! You said: ${text}`);
});
