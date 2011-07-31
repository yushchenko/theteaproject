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
        selectedTeaIndex: -1,
        brewStartedAt: undefined
    }
};

tm.renderDashboard = function (req, res) {
    var tea = tm.teaList[tm.state.selectedTeaIndex]; // tea is undefinded when selectedTeaIndex = -1
    res.render('dashboard', { layout: false, tea: tea });
};

tm.renderRemote = function (req, res) {
    res.render('remote', { layout: false,  teaList: tm.teaList });
};

tm.selectTea = function (req, res) {
    tm.state.selectedTeaIndex = parseInt(req.params.index, 10);
    tm.state.brewStartedAt = undefined;
    res.send('ok');
};

tm.startBrew = function (req, res) {
    tm.state.brewStartedAt = Date.now();
    res.send('ok');
};

// Routes
app.get('/', tm.renderDashboard);
app.get('/remote', tm.renderRemote);
app.post('/select-tea/:index', tm.selectTea);
app.post('/start-brew', tm.startBrew);

app.listen(3000);

console.log("Tea Mate, port %d.", app.address().port);
console.log("Restart me, please, when update teaDB.json file.");
console.log("Enjoy your tea and have a nice day :)");