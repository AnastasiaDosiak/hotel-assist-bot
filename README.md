
# Hotel Assist Bot for Edem Resort Spa

A **TypeScript** bot built for Edem Resort Spa that allows users to book rooms, manage spa and clinic appointments, and access additional services such as laundry, extra cleaning, and more. The project is powered by **Sequelize** for database management and utilizes **i18n** for multilingual support.

## Features

- **Room Booking**: Reserve rooms and check availability.
- **Additional Services**: Book extra cleaning, spa, clinic, golf, restaurant, and laundry services.
- **Feedback**: View the latest 5 feedbacks or submit your own.
- **FAQ Section**: Access frequently asked questions for quick assistance.

## Project Structure

- **Backend**: Handles API requests and communicates with the database using **Sequelize**.
- **Bot**: Frontend logic of the Telegram bot that handles user interactions.

## Scripts

```json
"scripts": {
  "prepare": "husky install",
  "start:bot": "ts-node bot/index.ts",
  "start:backend": "ts-node backend/server.ts",
  "start": "npm run start:bot & npm run start:backend",
  "lint": "eslint '*/**/*.{ts,js}' --quiet",
  "format": "prettier --write '*/**/*.{ts,js,json}'"
}
```

- `prepare`: Install Git hooks using **husky**.
- `start:bot`: Start the bot service.
- `start:backend`: Start the backend service.
- `start`: Run both the bot and backend services simultaneously.
- `lint`: Lint the codebase.
- `format`: Format the codebase using **Prettier**.

## How to Run

1. Add the `.env` file with the required environment variables.
2. Install the necessary dependencies:

    ```bash
    npm install
    ```

3. Start the bot and backend:

    ```bash
    npm start
    ```

4. Open Telegram, find the bot, and send `/start`.

## Technologies Used

- **Sequelize**: For database management.
- **TypeScript**: Ensures type safety.
- **i18n**: For internationalization and handling multilingual text.
- **Faker**: To generate fake data for the database.
