// current weather = https://api.openweathermap.org/data/2.5/weather?appid=c4bc6124ae143bb4ad40a5546c016dd6&units=imperial&q=Atlanta,Ga,1
// forecast = https://api.openweathermap.org/data/2.5/forecast?appid=c4bc6124ae143bb4ad40a5546c016dd6&units=imperial&q=woodstock,GA,1&cnt=20
// 
//geo =http://api.openweathermap.org/geo/1.0/direct?q=canton,ga,1&appid=c4bc6124ae143bb4ad40a5546c016dd6
//fetch(url)
//     .then(function (response) {
//         console.log(response)
//         return response.json()
//     })
//     .then (function (data){
//         console.log(data)
//     })

const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?appid=c4bc6124ae143bb4ad40a5546c016dd6&units=imperial&cnt=40"
const currentURL = "https://api.openweathermap.org/data/2.5/weather?appid=c4bc6124ae143bb4ad40a5546c016dd6&units=imperial"
const geoURL = "http://api.openweathermap.org/geo/1.0/direct?appid=c4bc6124ae143bb4ad40a5546c016dd6"
const submitEl = document.querySelector('#searchBtn')
const cityListEl = document.querySelector('.cityList')
var savedCities = JSON.parse(localStorage.getItem("cityCache"))

//set savedCity if it doesn't exist
if (!savedCities){savedCities={}}

//event listner for search button
submitEl.addEventListener("click", async function(event){
    event.preventDefault()
    //check for incorrect city state format
    var Name = document.querySelector('#searchValue').value
    if (!Name.includes(",")){
        window.alert('Please use "City, State" format')
        return
    }
    var locName={}
    locName.City = document.querySelector('#searchValue').value.split(',')[0].trim()
    locName.State = document.querySelector('#searchValue').value.split(',')[1].trim()
    var results = await getCoord(locName.City, locName.State)
    //if results returned continue, if not prompt user to try again
    if (results.length > 0){
        getWeather(results[0].lat, results[0].lon)
        //only add city if it doesn't exist
        if (!savedCities.Name){savedCities[Name] = locName}
        localStorage.setItem("cityCache", JSON.stringify(savedCities))
        populateCities()
    }else{
        window.alert("That location could not be found. Please try again.")
    }    
})

// function for populating saved cities
function populateCities(){
    cityListEl.replaceChildren()
    Object.keys(savedCities).forEach((element)=>{
        var cityListItem = document.createElement("p")
        cityListItem.textContent = savedCities[element].City + ", " + savedCities[element].State
        cityListEl.appendChild(cityListItem)
    })
}

//function for getting lat and long
async function getCoord(city, state){
    locURL = geoURL + `&q=${city},${state},1`
    let response = await fetch(locURL)
    let data = await response.json()
    return await data
}

//function for getting weather data, current day and 5 day forecast requires 2 fetch calls
async function getWeather(lat, lon){
    let currentWeathURL = currentURL + `&lat=${lat}&lon=${lon}`
    let forecastWeathURL = forecastURL + `&lat=${lat}&lon=${lon}`
    let currentResponse = await fetch(currentWeathURL)
    let currentData = await currentResponse.json()
    let forecastResponse = await fetch(forecastWeathURL)
    let forecastData = await forecastResponse.json()
    buildForecast(currentData, forecastData)
}

//function for building elements and displaying them.
function buildForecast(current, forecast){
    //current weather
    let currentTemp = current.main.temp
    let currentWind = current.wind.speed
    let currentHumidity = current.main.humidity
    let currentIcon = current.weather[0].icon
    let city = current.name
    let currentDate = dayjs(current.dt * 1000).format('MM/DD/YYYY')
    let tempEl = document.createElement('p')
    tempEl.textContent = `Temp: ${Math.floor(currentTemp)}°F`
    let windEl = document.createElement('p')
    windEl.textContent = `Wind Speed: ${currentWind} MPH`
    let humidityEl = document.createElement('p')
    humidityEl.textContent = `Humidity: ${currentHumidity}%`
    let iconEl = document.createElement('img')
    iconEl.src = `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`
    document.querySelector('#cityName').textContent = city + "  " + currentDate
    let forecastContainer = document.querySelector('.currentWeather')
    forecastContainer.appendChild(tempEl, windEl, iconEl, humidityEl)// + windEl + humidityEl + imgSource
    forecastContainer.appendChild(windEl)
    forecastContainer.appendChild(iconEl)
    forecastContainer.appendChild(humidityEl)




    let forecastTemp = forecast.list[0].main.temp
    let forecastWind = forecast.list[0].wind.speed
    let forecastHumidity = forecast.list[0].main.humidity
    let forecastIcon = forecast.list[0].weather[0].icon
    let forecastDate = forecast.list[0].dt_txt
    console.log(forecastTemp, forecastWind, forecastHumidity, forecastIcon, forecastDate)
}

populateCities()