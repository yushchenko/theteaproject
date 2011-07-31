// Tea Mate by @vyushchenko, MIT license

var express = require('express'),
    fs = require('fs');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

//----------------------------------------------------------------------------//

var tm = {
    teaList: JSON.parse(fs.readFileSync('teaDB.json')),
    state: {
        selectedTeaIndex: undefined,
        brewStartedAt: undefined
    }
};

tm.renderDashboard = function (req, res) {
    res.render('dashboard', { layout: false, name: tm.teaList[0].name });    
};

tm.renderRemote = function (req, res) {
  res.render('remote', { layout: false });    
};

// Routes
app.get('/', tm.renderDashboard);
app.get('/remote', tm.renderRemote);

app.listen(3000);

console.log("Tea Mate, port %d.", app.address().port);
console.log("Restart me, please, when update teaList.json file.");
console.log("Enjoy your tea and have a nice day :)");