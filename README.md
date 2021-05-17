# Admin Dashboard Frontend

Download or clone the code. cd into the directory, `/backend`.

There, run

`npm install`

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


