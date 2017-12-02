// Express Stuff
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 8080;
// Logger
const morgan = require('morgan');

// Mongoose
// const { mongoose } = require('./api/config/Mongoose');
// const User = mongoose.model('Users');

// // Controllers 
// const UserController =  require('./api/controllers/UserController');

// App Configuration
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

// The Routers
const routers = (() => {
	return {
		authed: express.Router(),
		public: express.Router()
	};
})();

// Install Routers
app.use(routers.public);
// app.use(routers.authed.use(UserController.verify));

// Routes
// require('./api/routes/UserRoutes')(routers);

routers.public.get('/hello', (req, res) => {
	let response = {};

	response.token_decoded = req.decoded;

	let db = {
		'59fa3bcd17db4d042dfab825': [{ some: 'hi preston' }, { some: 'jkldsjafja' }, { some: 'yo dog' }, { i_love: 'leah dog' }],
		'5a0e66b1b60fa7341c357487': [{ i_love: 'preston' }, { some: 'data' }, { some: 'data' }, { some: 'data' }]

		//response.data = db[req.decoded._id];
	};res.json(db);
});

routers.authed.all('*', (req, res) => {
	res.status(404).json({ message: '404' });
});

// Start Application
module.exports = app.listen(PORT);
console.log(`Mock Server Running on Port: ${PORT}`);