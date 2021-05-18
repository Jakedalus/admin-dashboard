# Admin Dashboard Backend

## Setup

Download or clone the code. cd into the directory, `/backend`.

There, run

`npm install`



### Database

If you have the included `.env` file you should be able to run the app. Otherwise you will need to setup your database and your .env file with the necessary env vars. 
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


## Description

The backend consists mostly of 2 API routes, one for RESTfully creating/updating/reading/deleting Courses, another API for Users. The "users route" is split into auth and users files: users is just the route for getting all the users; the auth route is for signing up, signing in, and changing your password. The "reset" route is for resetting the test database before each test: it is only loaded when in 'test' mode.

The "users" in this app are all admins essentially. A further development would be to create separate routes (or update the 'user' model to include 'types') for teachers and students. At the moment, every user is an admin and has full admin privileges in the app.

Courses also have a very simple model for "Questions." Depending on how real life courses are broken up on an app like this, Courses may have a list of Lessons, each of which then would have a list of Questions, preferably questions of various types, not just the simple version implemented here. 