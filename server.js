var koa = require('koa'),
    serve = require('koa-static'),
    send = require('koa-send'),
    router = require('koa-router')(),
    moment = require('moment'),
    jsonfile = require('jsonfile'),
    fs = require('fs'),
    numToWord = require('./lib/numToWord');

var app = koa();
app.use(serve(__dirname + '/tmp'));

var sitePages = [
  "report",
  "/"
]

var dateFile = __dirname+'/data.json';

function *getDaysPassed() {
  var recordedDate = yield jsonfile.readFileSync(dateFile);
  var lastPuke = moment(recordedDate.date);
  var now = moment();

  console.log(numToWord(now.diff(lastPuke, 'days')))

  this.body = numToWord(now.diff(lastPuke, 'days'))
}

router
  .get('/days-passed', getDaysPassed)
  .put('/blagh', function *() {
  	jsonfile.readFile(dateFile, function (err, obj) {
     
      var now = moment();
      if (obj === (undefined)||Object.keys(obj).length === 0) {
        var obj = {date:moment()}
        jsonfile.writeFile(dateFile, obj, function(err) {
          // console.log("error", err)
        });
      }
      else {
        var startDate = moment(obj.date);
        var endDate = moment();
        
        console.log(startDate, endDate, startDate.diff(endDate, 'seconds'))

        if (startDate.diff(endDate, 'seconds') < 0) {
          var obj = {date:endDate}
          jsonfile.writeFile(dateFile, obj, function(err) {
            if (err) {console.log("error", err)}
          });
        }

       }
    })
    this.body = "done";
  });

router.get('/:page', function *() {
  var requestedResource = this.request.url.split("/").filter(function(v){return v!==''})[0]

  if (requestedResource === undefined) {
    console.log(requestedResource + " is undefined", sitePages)
    yield send(this,__dirname + '/tmp/index.html');
  }
  else {
    yield send(this,__dirname + '/tmp/'+requestedResource+'.html');
  }
});

app.use(router.routes());


var port = parseFloat(process.env.PORT) || 80;
app.listen(port, function(){
  console.log('Server is now running on port ' + port);
});
