# Admin Dashboard Backend

Download or clone the code. cd into the directory, `/backend`.

There, run

`npm install`



### Database

Before starting the server, you will need to setup your database and your .env file with the necessary env vars. 
I recommend [Mongo Atlas](https://www.mongodb.com/cloud/atlas), which I am using 
for the app. 

Your `.env` file will require the following variables

- MONGODB_URI
- TEST_MONGODB_URI
- PORT
- SECRET


the MONGODB_URI and TEST_MONGODB_URI are your regular and test database URIs respectively. Mongo Atlas's documentation can 
walk you through the necessary steps there.

I just have my PORT set to 3001.

The SECRET var is the salt for your bcrypt has, which must match the REACT_APP_SECRET in the frontend .env (if you are using my frontend).

__Make sure you include .env in your .gitignore!!__

---

Once that is finished, you can start up the app by running

`npm start`

This starts up the standard server with Node. 

If you are working on the app, it would be useful to use the dev server instead. Run

`npm run dev`

to start the dev server, which will restart on each save.

## To run the integration tests

To run the backend tests, which tests the API, run

`npm test`


## To run the E2E Cypress tests on the frontend

The frontend Cypress tests requires the backend to be running in 'test' mode, which 
you can do by running

`npm run start:test`

You must do this before starting Cypress or it will not work.


