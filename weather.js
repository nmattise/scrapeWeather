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

function getMonthlyTemp(startDate, airport, callback) {}

function getCustomRangeTemp(startDate, endDate, airport, callback) {}
getHourlyTemp('2013-07-11', 'KAVP', function (weather) {
    console.log(weather);
})
