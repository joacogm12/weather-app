//containers for elements created from js
const cityWeatherEl = $(".city-weather");
const forecastEl = $("#forecast");
const optionsEl = $(".options");

//variables to conect to the api
var APIKey = "2266e4f4412f39e387b59d7903274cff";
var url = "HTTPs://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric";

//get elements from local storage
var searchHistoryArr = JSON.parse(localStorage.getItem("searchHistoryArr")) || [];

//name of the city
var city = "";

//amount of buttons for the search history
var btnCount = 0;

//variable to make some validations
var check = 0;

//this function creates all the initial elements of the html
function createElements() {

    //in here the elements for the current weather are created
    cityWeatherEl.append('<h1 id="cityName"></h1>');
    cityWeatherEl.append('<div id="wathertoday"></div>');
    const weatherTodayEl = $("#wathertoday");


    weatherTodayEl.append("<p> date: </p> <p id='currentDate'></p>");
    weatherTodayEl.append("<p> Temp: </p> <p id='currentTemp'></p>");
    weatherTodayEl.append("<p> Wind: </p> <p id='currentWind'></p>");
    weatherTodayEl.append("<p> Humidity: </p> <p id='currentHum'></p>");
    weatherTodayEl.append("<p> UV index: </p> <p id='currentUv'></p>");

    //in here the elements for the 5 days of forecast are created
    for (let i = 0; i < 5; i++) {
        forecastEl.append("<div id='forecastday" + i + "'></div>");
        const forecast = $("#forecastday" + i + "");

        forecast.append("<h2 id='date" + i + "'></h2>");
        forecast.append("<img id='icon" + i + "'alt='weather-icon'>")
        forecast.append("<p>max temp:</p> <p id='tempMax" + i + "'></p>");
        forecast.append("<p>min temp:</p> <p id='tempMin" + i + "'></p>");
        forecast.append("<p>wind:</p> <p id='wind" + i + "'></p>");
        forecast.append("<p>humidity:</p> <p id='humidity" + i + "'></p>");

        forecastEl.append(forecast);
    }

    //in here the buttons are created, the amount of buttons depend on the amount of elements saved in local storage
    for (let i = 0; i < searchHistoryArr.length; i++) {
        btnCount = i;
        optionsEl.append("<button class='city-options' onclick = 'btnClick(this);' value='" + searchHistoryArr[btnCount].city + "'>" + searchHistoryArr[btnCount].city + "</button>")
    }
    optionsEl.append("<button class='clear' onclick='clearHistory()'> clear history </button>")
}

//this function is called when the form in which the user makes the input is submited
$("#inputCity").on("submit", function apiCall(e) {
    e.preventDefault();

    //
    if (check == 0) {
        city = $('input[name="city-input"]').val();
    }

    //first api call to get the lat and lon of the city inputed
    url = "HTTPs://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=metric";
    $.ajax({
        url: url,
        method: "GET",
    }).then(function (response) {
        // calls another function that makes another api call with the lat and lon
        renderValues(response.coord.lat, response.coord.lon, response.name);
    });


    $('input[name="city-input"]').val("");
});


function renderValues(lat, lon, name) {
    //api call that contains more information 
    var urlforecast = "HTTPs://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&units=metric"
    $.ajax({
        url: urlforecast,
        method: "GET"
    }).then(function (response) {

        //values for the current weather are inputed into the elements of the html
        console.log(response)
        $("#cityName").html(name);
        $("#currentDate").html(getDatePrint(response.daily[0].dt));
        $("#currentTemp").html(response.current.temp + " °C");
        $("#currentWind").html(response.current.wind_speed + " mph");
        $("#currentHum").html(response.current.humidity + " %");
        $("#currentUv").html(response.current.uvi);

        //values of the 5 day forecast are inputed into the elements of the html
        for (let i = 0; i < 5; i++) {
            var iconCode = response.daily[i + 1].weather[0].icon;
            var iconurl = "HTTPs://openweathermap.org/img/w/" + iconCode + ".png";
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

//this function transforms the date given by the api into an ctual readable date
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

//saves values into local storage
function searchHistory(lat, lon) {
    //id for each city
    var id = Math.round((lat + lon) * 100) / 100;

    //flag to make validations
    var flag = true;

    searchHistoryArr.reverse();

    //object that saves the name of the city and it´s id
    cityObj = {
        city: city,
        id: id
    }

    //checks if the array already has the value that was inputed by the user 
    //returns true if the value is new and false if there is an equal value
    for (let i = 0; i < searchHistoryArr.length; i++) {
        if (searchHistoryArr[i].id == id) {
            flag = false;
            break
        } else {
            flag = true;
        }
    }

    //if the validation was true cityobj gets pushed into the array
    if (flag == true) {
        searchHistoryArr.push(cityObj);
        btnCount++
        optionsEl.prepend("<button class='city-options' onclick = 'btnClick(this)' value='" + cityObj.city + "'>" + cityObj.city + "</button>")
    }

    searchHistoryArr.reverse();

    //the array gets saved into local storage
    localStorage.setItem("searchHistoryArr", JSON.stringify(searchHistoryArr));
}

//this function is called when the page is loaded
function historyCity() {
    //validates if there is anything in local storage
    //if there is nothing in local storage it will input the city san luis potosi
    //if ther is something in local storage it will input the first element of local storage 
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

//this function is called by the search history buttons
//inputs the value of the buttons 
function btnClick(e) {
    city = e.value;
    console.log(city)
    check = 1;
    $("#inputCity").submit();
}

//clears local storage to clear history
function clearHistory() {
    localStorage.clear();
    location.reload();
}

window.onload = historyCity();
createElements();