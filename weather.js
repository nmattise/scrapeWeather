var csv = require('csv');
var cheerio = require('cheerio');
var request = require('request');


function getHourlyTemp(date, airport, callback) {
    var urlDate = date.split("-"),
        url = "http://www.wunderground.com/history/airport/" + airport + "/" + urlDate[0] + "/" + urlDate[1] + "/" + urlDate[2] + "/DailyHistory.html?format=1",
        weather = new Object();
    request(url, function (error, response, body) {
        csv.parse(body, function (err, data) {
            function newWeather(time, temp) {
                this[time] = temp;
            }
            weather[date] = [];
            for (var i = 1; i < data.length; i++) {
                weather[date].push(new newWeather(data[i][0], data[i][1]))
            };
            callback(weather);
        })
    });
}
/*getHourlyTemp('2013-07-11', 'KAVP', function (weather) {
    console.log(weather);
})*/
function getMonthlyTemp(month, airport, callback) {
    var urlDate = month.split("-"),
        url = "http://www.wunderground.com/history/airport/" + airport + "/"+urlDate[0]+"/"+urlDate[1]+"/"+urlDate[2]+"/MonthlyHistory.html?format=1",
        weather = new Object();
    request(url, function(err, response, body){
        csv.parse(body, function(err, data){
            var tempLoc = data[0].indexOf("Mean TemperatureF");
            data.forEach(function(row){
                weather[row[0]] = row[tempLoc];
            });
            callback(weather);
        })
    })
};

/*getMonthlyTemp('2013-07-11', 'KAVP', function(weather){
    console.log(weather);
});*/

function getCustomRangeTemp(startDate, endDate,requestedResults, airport, callback) {
    var startDate = startDate.split('-'),
        endDate = endDate.split('-'),
        url = "http://www.wunderground.com/history/airport/"+airport+"/"+startDate[0]+"/"+startDate[1]+"/"+startDate[2]+"/CustomHistory.html?dayend="+endDate[2]+"&monthend="+endDate[1]+"&yearend="+endDate[0]+"&req_city=NA&req_state=NA&req_statename=NA&format=1",
        weather = new Object();
    function weatherDate(row, refRow, reqs){
        this[row[0]]={};
        for (var i=0; i<reqs.length;i++){
            this[row[0]][reqs[i]] = row[refRow.indexOf(reqs[i])];
        };
    };
    request(url, function(err, response, body){
        csv.parse(body, function(err, data){

            callback(weather);
        });
    });
}
getCustomRangeTemp('2013-07-11','2013-08-11',['Max TemperatureF','Mean TemperatureF','Min TemperatureF'], 'KAVP', function(weather){
    console.log(weather);
});
