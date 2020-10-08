# Northcoders News (Backend)

Northcoders News is a full-stack Reddit-style messaging board, built as part of the full-time intensive coding bootcamp at [Northcoders](https://www.northcoders.com/). This is the back end for the site, a RESTful API built using Node.js, Express, Knex.js, and PostgreSQL, with testing carried out using Jest. Users can view articles posted to the site, add and remove comments, and vote on articles and comments.

- View the [hosted API](https://sb-nc-news-backend.herokuapp.com/api)

- View the [front end repository](https://github.com/stephenjbradshaw/nc-news-frontend)

- Visit the [deployed front end](https://sb-nc-news.netlify.app/)

## Prerequisites

- Node.js
- PostgreSQL

## Installation

- Fork and clone this repository
- Install the necessary dependencies: `npm install`
- If using Linux, you will need to add your PSQL username and password information to the `customConfig` object in `knexfile.js`. To keep your details secure, you should export these details from a new JavaScript file, and add this file to the `.gitignore`. Your details can then be added to the `customConfig` object as variables:

```javascript
const { username, password } = require("./mySecretFile");

const customConfig = {
  development: {
    connection: {
      database: "nc_news",
      user: username,
      password: password,
    },
  },
  test: {
    connection: {
      database: "nc_news_test",
      user: username,
      password: password,
    },
  },
  production: {
    connection: {
      connectionString: DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
```

## Using the API locally

- Make sure that PostgreSQL is installed and running
- Create the databases: `npm run setup-dbs`
- Seed the dev database: `npm run seed-dev`
- Start the server, which will run on port 9090: `npm start`
- In the browser, navigate to `localhost:9090/api` to view a JSON file showing the available endpoints

## Running tests

- Tests check each endpoint of the API, and are run using `jest` and `supertest`
- Create the test and dev databases, if not already created: `npm run setup-dbs`
- Run the tests: `npm test`
- The test database is automatically reseeded before each test. To reseed manually, use: `npm run seed-test`

## Author

- **Stephen Bradshaw** – [Portfolio](https://www.stephenbradshaw.dev) | [Linkedin](https://www.linkedin.com/in/stephenbradshawdev/) | [Github](https://github.com/stephenjbradshaw)

## Acknowledgements

Thanks to [Northcoders](https://www.northcoders.com/) for their help and support, and for providing the test data.
