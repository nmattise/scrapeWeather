var request = require('request'),
    cheerio = require('cheerio'),
    http = require('http'),
    csvParse = require('csv').parse;


/*request('http://www.wunderground.com/history/airport/KPHL/2013/4/17/CustomHistory.html?dayend=17&monthend=5&yearend=2013&req_city=NA&req_state=NA&req_statename=NA', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var meanTemp = (cheerio.load(body)('div.contentData table tbody tr:nth-child(3) td:nth-child(3)').text());
        console.log(parseInt(meanTemp));
    }
})*/

module.exports = {
    getCustomRangeWeather: function (startDate, endDate, airportCode, fn) {
        var dayStart = startDate.substring(8, 10);
        var monthStart = startDate.substring(5, 7);
        var yearStart = startDate.substring(0, 4);
        var dayEnd = endDate.substring(8, 10);
        var monthEnd = endDate.substring(5, 7);
        var yearEnd = endDate.substring(0, 4);
        var url = "http://www.wunderground.com/history/airport/" + airportCode + "/" + yearStart + "/" + monthStart + "/" + dayEnd + "/CustomHistory.html?dayend=" + dayEnd + "&monthend=" + monthEnd + "&yearend=" + yearEnd + "&req_city=NA&req_state=NA&req_statename=NA&format=1";
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                //Parse the body using csvParse
                csvParse(body, function (err, data) {
                    //Double check location of Mean Temp in CSV Array
                    var meanTempLocation = data[0].indexOf('Mean TemperatureF');
                    //console.log(meanTempLocation);
                    //Get Number of Days in Custom Range
                    var days = data.length - 1;
                    //console.log(days);
                    //Sum all mean Temps
                    var sumMeanTemp = 0;
                    data.forEach(function (row) {
                        if (isNaN(row[meanTempLocation]) != true) {
                            sumMeanTemp = sumMeanTemp + parseInt(row[meanTempLocation]);
                        }
                    });
                    //console.log(sumMeanTemp);
                    //Get the Average of the custom range mean temperature
                    var meanTemp = sumMeanTemp / days;
                    fn(meanTemp);
                });
            };
        });

    },

};



//Hourly Link
var hourly = "http://www.wunderground.com/history/airport/KAVP/2006/5/15/MonthlyHistory.html?format=1";
//Month Link
var monthly = "http://www.wunderground.com/history/airport/KAVP/2006/5/15/MonthlyHistory.html?format=1";
//Custom Link
var custom = "http://www.wunderground.com/history/airport/KAVP/2006/5/15/CustomHistory.html?dayend=15&monthend=6&yearend=2006&req_city=NA&req_state=NA&req_statename=NA&format=1";



//use Request to get the body of the CSV page
/*request(custom, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        //Parse the body using csvParse
        csvParse(body, function (err, data) {
            //Double check location of Mean Temp in CSV Array
            var meanTempLocation = data[0].indexOf('Mean TemperatureF');
            //console.log(meanTempLocation);
            //Get Number of Days in Custom Range
            var days = data.length - 1;
            //console.log(days);
            //Sum all mean Temps
            var sumMeanTemp = 0;
            data.forEach(function (row) {
                if (isNaN(row[meanTempLocation]) != true) {
                    sumMeanTemp = sumMeanTemp + parseInt(row[meanTempLocation]);
                }
            });
            //console.log(sumMeanTemp);
            //Get the Average of the custom range mean temperature
            var meanTemp = sumMeanTemp / days;
            console.log(meanTemp);
        });
    };
});*/
