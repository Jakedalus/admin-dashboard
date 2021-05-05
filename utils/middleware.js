const errorHandler = (error, req, res, next) => {
	console.log(`error`, error);
	if (error.name === 'ValidationError') {
		return res.status(400).send({ error: error.message });
	}

	next(error);
};

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' });
};

module.exports = {
	errorHandler,
	unknownEndpoint
};
