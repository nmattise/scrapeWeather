/*var getWeather = require("./index.js").getCustomRangeWeather;

var startDate = "2010-01-01";
var endDate = "2010-02-02";
var airportCode = "KPHL";
var i = 0;
var place = 1;
while (i < 100) {
    getWeather(startDate, endDate, airportCode, function (meanTemp) {
        console.log(place + " : " + meanTemp);
        place++;
    });
    i++;
}*/

var csv = require('csv');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

function temperature(time, temperature) {
    this.time = time;
    this.temp = temperature;
}
/*
fs.readFile('daily.csv', 'utf8', function (err, data) {
    if (err) throw err;
    csv.parse(data, function (err, data) {
        var date = data[1][data[1].length - 1];
        var weather = new Object();

        function newWeather(time, temp) {
            this.time = time;
            this.temp = temp;
        }
        weather[date] = [];
        for (var i = 1; i < data.length; i++) {
            weather[date].push(new newWeather(data[i][0], data[i][1]))
        };
        //console.log(weather);
    });
})*/

var url = "http://www.wunderground.com/history/airport/KAVP/2014/6/18/DailyHistory.html?format=1";
request(url, function (error, response, body) {
    console.log(body);
    if (!error && response.statusCode == 200) {
        csv.parse(body, function (err, data) {
            var date = data[1][data[1].length - 1];
            var weather = new Object();

            function newWeather(time, temp) {
                this[time]= temp;
            }
            weather[date] = [];
            for (var i = 1; i < data.length; i++) {
                weather[date].push(new newWeather(data[i][0], data[i][1]))
            };
            console.log(weather);
        });
    }
});
