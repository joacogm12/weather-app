
const cityWeatherEl = $(".city-weather");
const forecastEl = $("#forecast");

var APIKey = "2266e4f4412f39e387b59d7903274cff";
var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric";

var searchHistoryArr = JSON.parse(localStorage.getItem("searchHistoryArr")) || [];
var city = "";

var check = 0;





function createElements() {
    cityWeatherEl.append('<h1 id="cityName"></h1>');
    cityWeatherEl.append('<div id="wathertoday"></div>');
    const weatherTodayEl = $("#wathertoday");

    weatherTodayEl.append("<p> date: </p> <p id='currentDate'></p>");
    weatherTodayEl.append("<p> Temp: </p> <p id='currentTemp'></p>");
    weatherTodayEl.append("<p> Wind: </p> <p id='currentWind'></p>");
    weatherTodayEl.append("<p> Humidity: </p> <p id='currentHum'></p>");
    weatherTodayEl.append("<p> UV index: </p> <p id='currentUv'></p>");

    for (let i = 0; i < 5; i++) {
        forecastEl.append("<div class='cloudy' id='forecastday" + i + "'></div>");
        const forecast = $("#forecastday" + i + "");

        forecast.append("<h2 id='date" + i + "'></h2>");
        forecast.append("<img id='icon" + i + "' src='Assets/images/cloudy.png' alt='weather-icon'>")
        forecast.append("<p>max temp:</p> <p id='tempMax" + i + "'></p>");
        forecast.append("<p>min temp:</p> <p id='tempMin" + i + "'></p>");
        forecast.append("<p>wind:</p> <p id='wind" + i + "'></p>");
        forecast.append("<p>humidity:</p> <p id='humidity" + i + "'></p>");

        forecastEl.append(forecast);
    }
}





$("#inputCity").on("submit", function apiCall(e) {
    e.preventDefault();

    if (check == 0) {
        city = $('input[name="city-input"]').val();
    }

    url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric";
    console.log(url);
    $.ajax({
        url: url,
        method: "GET",
    }).then(function (response) {
        renderValues(response.coord.lat, response.coord.lon, response.name);

    });
    check = 0;
});





function renderValues(lat, lon, name) {
    var urlforecast = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=metric"

    console.log(urlforecast)
    $.ajax({
        url: urlforecast,
        method: "GET"
    }).then(function (response) {

        console.log(response);

        $("#cityName").html(name);
        $("#currentDate").html(getDatePrint(response.daily[0].dt));
        $("#currentTemp").html(response.current.temp + " °C");
        $("#currentWind").html(response.current.wind_speed + " mph");
        $("#currentHum").html(response.current.humidity + " %");
        $("#currentUv").html(response.current.uvi);

        for (let i = 0; i < 5; i++) {
            $("#date" + i).html(getDatePrint(response.daily[i + 1].dt));
            $("#tempMax" + i).html(response.daily[i + 1].temp.max + "°C");
            $("#tempMin" + i).html(response.daily[i + 1].temp.min + "°C");
            $("#wind" + i).html(response.daily[i + 1].wind_speed + "mph");
            $("#humidity" + i).html(response.daily[i + 1].humidity + "%");

        }
    });


    searchHistory()

    $('input[name="city-input"]').val("");
}





function getDatePrint(dailyForecast) {

    var month = 0;
    var day = 0;

    let forecastDate = dailyForecast;

    forecastDate = forecastDate * 1_000;
    forecastDate = new Date(forecastDate);
    forecastYear = forecastDate.getFullYear();
    forecastMonth = forecastDate.getMonth() + 1;
    forecastDay = forecastDate.getDate();

    if (forecastMonth <= 9) {
        month = "0" + forecastMonth
    } else {
        month = forecastMonth
    }
    if (forecastDay <= 9) {
        day = "0" + forecastDay
    } else {
        day = forecastDay
    }

    actualDate = day + "/" + month + "/" + forecastYear
    return actualDate;
}





function searchHistory() {
    searchHistoryArr.push(city);
    searchHistoryArr.reverse();
    localStorage.setItem("searchHistoryArr", JSON.stringify(searchHistoryArr))
}

window.onload = function () {
    console.log("hola")
    if (searchHistoryArr.length == 0) {

        city = "san luis potosi";
        check = 1;
        $("#inputCity").submit();
    } else {

        city = searchHistoryArr[0]
        check = 1;
        $("#inputCity").submit();
    }
};


createElements();