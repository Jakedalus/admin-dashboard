const tokenExtractor = (req, res, next) => {
	const authorization = req.get('authorization');

	if (
		authorization &&
		authorization.toLowerCase().startsWith('bearer')
	) {
		req.token = authorization.substring(7);
	} else {
		req.token = null;
	}

	next();
};

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
	tokenExtractor,
	errorHandler,
	unknownEndpoint
};
