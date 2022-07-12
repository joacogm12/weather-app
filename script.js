
const cityWeatherEl = $(".city-weather");
const forecastEl = $("#forecast");
const optionsEl = $(".options");

var APIKey = "2266e4f4412f39e387b59d7903274cff";
var url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric";

var searchHistoryArr = JSON.parse(localStorage.getItem("searchHistoryArr")) || [];
var city = "";
var btnCount = 0;

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
        forecastEl.append("<div id='forecastday" + i + "'></div>");
        const forecast = $("#forecastday" + i + "");

        forecast.append("<h2 id='date" + i + "'></h2>");
        forecast.append("<img id='icon" + i + "' src='Assets/images/cloudy.png' alt='weather-icon'>")
        forecast.append("<p>max temp:</p> <p id='tempMax" + i + "'></p>");
        forecast.append("<p>min temp:</p> <p id='tempMin" + i + "'></p>");
        forecast.append("<p>wind:</p> <p id='wind" + i + "'></p>");
        forecast.append("<p>humidity:</p> <p id='humidity" + i + "'></p>");

        forecastEl.append(forecast);
    }

    for (let i = 0; i < searchHistoryArr.length; i++) {
        btnCount = i;
        optionsEl.append("<button class='city-options' onclick = 'btnClick(this);' value='" + searchHistoryArr[btnCount].city + "'>" + searchHistoryArr[btnCount].city + "</button>")
    }
    optionsEl.append("<button class='clear' onclick='clearHistory()'> clear history </button>")
}


$("#inputCity").on("submit", function apiCall(e) {
    e.preventDefault();

    if (check == 0) {
        city = $('input[name="city-input"]').val();
    }

    url = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric";
    $.ajax({
        url: url,
        method: "GET",
    }).then(function (response) {
        renderValues(response.coord.lat, response.coord.lon, response.name);
    });


    $('input[name="city-input"]').val("");
});


function renderValues(lat, lon, name) {
    var urlforecast = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=metric"
    $.ajax({
        url: urlforecast,
        method: "GET"
    }).then(function (response) {

        console.log(response)
        $("#cityName").html(name);
        $("#currentDate").html(getDatePrint(response.daily[0].dt));
        $("#currentTemp").html(response.current.temp + " °C");
        $("#currentWind").html(response.current.wind_speed + " mph");
        $("#currentHum").html(response.current.humidity + " %");
        $("#currentUv").html(response.current.uvi);

        for (let i = 0; i < 5; i++) {

            var iconCode = response.daily[i + 1].weather[0].icon;
            var iconurl = "http://openweathermap.org/img/w/" + iconCode + ".png";
            $("#icon" + i).attr('src', iconurl);
            $("#date" + i).html(getDatePrint(response.daily[i + 1].dt));
            $("#tempMax" + i).html(Math.round(response.daily[i + 1].temp.max) + "°C");
            $("#tempMin" + i).html(Math.round(response.daily[i + 1].temp.min) + "°C");
            $("#wind" + i).html(Math.round(response.daily[i + 1].wind_speed) + "mph");
            $("#humidity" + i).html(Math.round(response.daily[i + 1].humidity) + "%");

        }

    });


    searchHistory(lat, lon)
    check = 0;
    //createBtn()

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
        month = "0" + forecastMonth;
    } else {
        month = forecastMonth;
    }
    if (forecastDay <= 9) {
        day = "0" + forecastDay;
    } else {
        day = forecastDay;
    }

    actualDate = day + "/" + month + "/" + forecastYear;
    return actualDate;
}


function searchHistory(lat, lon) {
    var id = Math.round((lat + lon) * 100) / 100;
    var flag = true;

    searchHistoryArr.reverse();

    cityObj = {
        city: city,
        id: id
    }

    for (let i = 0; i < searchHistoryArr.length; i++) {
        if (searchHistoryArr[i].id == id) {
            console.log("false");
            flag = false;
            break
        } else {
            flag = true;
        }
    }

    if (flag == true) {
        searchHistoryArr.push(cityObj);
        btnCount++
        optionsEl.prepend("<button class='city-options' onclick = 'btnClick(this)' value='" + cityObj.city + "'>" + cityObj.city + "</button>")
    }

    searchHistoryArr.reverse();
    localStorage.setItem("searchHistoryArr", JSON.stringify(searchHistoryArr));
}


window.onload = historyCity();


function historyCity() {
    if (searchHistoryArr.length == 0) {

        city = "san luis potosi";
        check = 1;
        $("#inputCity").submit();
    } else {

        city = searchHistoryArr[0].city;
        check = 1;
        $("#inputCity").submit();
    }
}


function btnClick(e) {
    city = e.value;
    console.log(city)
    check = 1;
    $("#inputCity").submit();
}


function clearHistory() {
    localStorage.clear();
    location.reload();
}

createElements();