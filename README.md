# PYG Tracker Backend



[![CircleCI](https://circleci.com/gh/chukwuemekachm/pyg_backend.svg?style=svg)](https://circleci.com/gh/chukwuemekachm/pyg_backend) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)



PYG is an application which provides users with the ability of creating a User Story (i.e ticket or card) which contains information about what kind of task needs to be performed and then the admin will review the User Story, make changes if required. Admin will be able to approve or reject the User story created by the user.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

To setup the following should be installed on your machine.

- [Node.js](https://nodejs.org/en/download/current/) 10 and above
- [Postman](https://www.getpostman.com/apps) Native or Postman [Chrome extension](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en)
- [Postgres](https://www.postgresql.org/download/) Database or create an Online [Elephant sql](https://www.elephantsql.com/) database
- [Git](https://git-scm.com/downloads)

### Installing

If you have all the prerequisites you can use the steps below to setup locally

Open your terminal and `cd` to the directory of this project and run the following commands

```bash
npm install yarn -g
```

```bash
yarn install
```


##### Create and update the env variables
- Run the command below to create a `.env` file from the sample provided
```bash
touch .env
cp .env-sample .env
```
- Now update the environmental variables with the variables you want to use for your installation.

##### Setup database
This section assumes your local PostgreSQL installation has a `postgres` user without password
- Run the command below to create a database
```sh
yarn create:db
```

- Run the command below to to populate the database
```sh
yarn migrate:db
```

Now you've just successfully installed this project locally

## Running in Development mode

- Run

```bash
yarn dev
```
This should start the app in development mode on `http://localhost:3000`

## Running the tests

Some automated integration tests have been setup to test the two features outlined above. To run them

- Run

```bash
yarn test
```

## And coding style tests

To test if the code currently adheres to the coding/linting style guide adopted by it, run

```bash
yarn lint
```

## Deployment

To deploy the app to a live server, ensure the environmental variables outlined in the `.env` file is available in the environment (Node.js).

- Run

```bash
npm install yarn -g
```

```bash
yarn install
```

```bash
yarn start
```

The app should be live on the `PORT` specified on the `.env` file or `http://localhost:3000`.

## API Docs
* [POSTMAN](https://documenter.getpostman.com/view/3397523/SzS8tRET?version=latest)

## Built With

* [Express](https://expressjs.com/) - The node framework used for building for building the app.
* [TypeScript](https://www.typescriptlang.org/) - Used for development, writing cleaner and typed JavaScript.
* [TypeORM](https://typeorm.io/#/) - Used to for data access and manipulation.
* [Eslint](https://eslint.org/) - Used to enforce a coding style in the codebase to ensure consistency.
* [Jest](https://jestjs.io/) - The test runner/framework used to run automated tests.
* [Supertest](https://github.com/visionmedia/supertest) - Used for writing end-2-end tests on the server.

Some other development dependencies are also used as well.
