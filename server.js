var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    mongooseWhen = require('mongoose-when'),
    _ = require('underscore');


var app = express();

global.config = require('./config/' + (app.get('env') || 'default') + '.json');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', require('uinexpress').__express);
app.engine('js', require('uinexpress').__express);
app.set('view engine', 'html')
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.limit('15mb'));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


// mongo and models
//app.set('db', mongoose.connect(config.mongo.url, { db: { safe: true }}));

var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
    if (file.match(/\.js$/)) {
        require(models_path+'/'+file);
    }
});

// routes
var monitorDollarOfficialRoute = require('./routes/api/monitor/dollar/official');
app.get('/api/monitor/dollar/official', monitorDollarOfficialRoute.get);

var monitorDollarParallelRoute = require('./routes/api/monitor/dollar/parallel');
app.get('/api/monitor/dollar/parallel', monitorDollarParallelRoute.get);


app.locals(global.config);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Server listening on port ' + app.get('port') + ' on ' + app.get('env') + ' env.');
});
