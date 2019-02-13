/**
* Created by Kuei in Kueiapp.com
* It follows GNU General Public License
**/
require('webduino-js');
require('webduino-blockly');
var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId: '',
  channelSecret: '',
  channelAccessToken: ''
});

var app = express();
var port = process.env.PORT || 3000;

// Add your linebot information your self
var linebotParser = bot.parser();

var myBoard2, led, dht, matrix, myData, relay;

/** linebot **/
bot.on('message', function(event) {
   var botMsg;
    if (event.message.type === 'text') {
       botMsg = doText(event,event.message.text)
    }
    if (event.message.type === 'sticker') {
       botMsg = '挖鼻！';
    }
    if (event.message.type === 'image') {
       botMsg = '這照片好帥！';
    }
   
   // bot speak back
   sendMessage(event,botMsg);
});

// 溫溼度是在async處理
// 無法return處理
function sendMessage(eve,msg){
   eve.reply(msg).then(function(data) {
      console.log(msg);
   }).catch(function(error) {
      console.log('Bot error to reply text');
   });
}

function doText(event,text){

  if(text == '溫溼度' || text == '溫濕度'){
      return '溫度：' + dht.temperature + '度, 溼度：' + dht.humidity + '%';
   }
   else if(text == '開燈'){
      relay.on();
      return '開囉';
   }
   else if(text == '關燈'){
      relay.off();
      return '好啦，關了';
   }
   else{
      return text;
   }
   
}

function get_date(t) {
  var varDay = new Date(),
    varYear = varDay.getFullYear(),
    varMonth = varDay.getMonth() + 1,
    varDate = varDay.getDate();
  var varNow;
  if (t == "ymd") {
    varNow = varYear + "/" + varMonth + "/" + varDate;
  } else if (t == "mdy") {
    varNow = varMonth + "/" + varDate + "/" + varYear;
  } else if (t == "dmy") {
    varNow = varDate + "/" + varMonth + "/" + varYear;
  } else if (t == "y") {
    varNow = varYear;
  } else if (t == "m") {
    varNow = varMonth;
  } else if (t == "d") {
    varNow = varDate;
  }
  return varNow;
}

function get_time(t) {
  var varTime = new Date(),
    varHours = varTime.getHours(),
    varMinutes = varTime.getMinutes(),
    varSeconds = varTime.getSeconds();
  var varNow;
  if (t == "hms") {
    varNow = varHours + ":" + varMinutes + ":" + varSeconds;
  } else if (t == "h") {
    varNow = varHours;
  } else if (t == "m") {
    varNow = varMinutes;
  } else if (t == "s") {
    varNow = varSeconds;
  }
  return varNow;
}

//以下為檢查webduino是否已連線成功的函式

function deviceIsConnected2(){
   if (myBoard2 === undefined){
      return false;
   }
   else if (myBoard2.isConnected === undefined){
      return false;
   }
   else{
      console.log('device2 status:'+myBoard2.isConnected);
      return myBoard2.isConnected;
   }
}

boardReady({
   board: '{DEVICE_TYPE}', 
   device: '{DEVICE_ID}', 
   transport: 'mqtt',
   multi: true
}, function (board) {
     
    board.samplingInterval = 150;
    dht = new webduino.module.Dht(board, board.getDigitalPin(5));
    
    //持續執行
    dht.read(function(evt){
        console.log('溼度: ' + dht.humidity);
    }, 5000); // msec
   
});

/**
 doGet 
app.get('/', function(request, response) {
  response.send('Hello World Linebot!');
});
**/

/** doPost **/
app.post('/', linebotParser);

/** main **/
app.listen(port, function() {
  console.log("Listening on ",port);
});

