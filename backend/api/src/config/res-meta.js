module.exports = {
	200: {
		code: 200,
	},
	400: {
		code: 400,
		error_type: 'Bad Request',
		error_message: 'Content was malformed in some way :(',
	},
	401: {
		code: 401,
		error_type: 'Unathorized',
		error_message: 'Access to this resouce is unauthorized',
	}
}