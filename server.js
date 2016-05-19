var express = require('express'),
	 stylus = require('stylus'),
	 logger = require('morgan'),
	 bodyParser = require('body-parser'),
	 mongoose = require('mongoose');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

//** start config
function compile(str, path) {
	return stylus(str).set('filename', path);
}

app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(stylus.middleware ( 
	{
		src: __dirname + '/public',
		compile: compile
	}
));
app.use(express.static(__dirname + '/public'));
//** end config

//** mongoose
mongoose.connect('mongodb://localhost:27017/multivision')
var db = mongoose.connection;
db.on('error', function(err) {
	console.error(err);
});
db.once('open', function cb() {
	console.log('multivision db openend');
})
var messageSchema = mongoose.Schema({message: String});
var Message = mongoose.model('Message', messageSchema);
var mongoMessage;
Message.findOne().exec( function(err, messageDoc) {
	mongoMessage = messageDoc.message;
	console.log('message='+mongoMessage);
})
//** mongoose


app.get('/partials/:partialPath', function(req, res) {
	res.render('partials/' + req.params.partialPath);
})

app.get('*', function(req, res) {
	res.render('index', {
		mongoMessage: mongoMessage 
	});
});

var port = 3030;
app.listen(port);
console.log('listening on port: '+ port);