require('dotenv').config();
const express = require('express');
const app = express();
// const authRouter = require('./routes/auth');

// app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
	res.send('<h1>Hello World!!</h1>');
});

app.listen(process.env.PORT, () => {
	console.log(`Server running on port ${process.env.PORT}`);
});
