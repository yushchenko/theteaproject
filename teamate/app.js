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
    state: 'selecting', // in [selecting, selected, brewing]
    selectedTeaIndex: undefined, // int
    brewStartedAt: undefined // Date
};

tm.renderDashboard = function (req, res) {
    var tea = tm.teaList[tm.selectedTeaIndex]; // tea is undefinded when selectedTeaIndex = undefined
    res.render('dashboard', { layout: false, state: tm.state, tea: tea });
};

tm.renderRemote = function (req, res) {
    res.render('remote', { layout: false, state: tm.state, teaList: tm.teaList });
};

tm.selectTea = function (req, res) {
    tm.state = 'selected';
    tm.selectedTeaIndex = parseInt(req.params.index, 10);
    tm.brewStartedAt = undefined;

    res.send('ok');
};

tm.resetTea = function(req, res) {
    tm.state = 'selecting';
    tm.selectedTeaIndex = undefined;

    res.send('ok');
};

tm.startBrew = function (req, res) {
    tm.state = 'brewing';
    tm.brewStartedAt = Date.now();

    res.send('ok');
};

tm.done = function(req, res) {
    tm.state = 'selecting';
    tm.selectedTeaIndex = undefined;
    tm.brewStartedAt = undefined;

    res.send('ok');
};

// Routes
app.get('/', tm.renderDashboard);
app.get('/remote', tm.renderRemote);

app.post('/selecting-selected/:index', tm.selectTea);
app.post('/selected-selecting', tm.resetTea);
app.post('/selected-brewing', tm.startBrew);
app.post('/brewing-selecting', tm.done);

app.listen(3000);

console.log("Tea Mate, port %d.", app.address().port);
console.log("Restart me, please, when update teaDB.json file.");
console.log("Enjoy your tea and have a nice day :)");