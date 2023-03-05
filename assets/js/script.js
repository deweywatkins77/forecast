const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?appid=c4bc6124ae143bb4ad40a5546c016dd6&units=imperial&cnt=40"
const currentURL = "https://api.openweathermap.org/data/2.5/weather?appid=c4bc6124ae143bb4ad40a5546c016dd6&units=imperial"
const geoURL = "https://api.openweathermap.org/geo/1.0/direct?appid=c4bc6124ae143bb4ad40a5546c016dd6"
const submitEl = document.querySelector('#searchBtn')
const cityListEl = document.querySelector('.cityList')
var savedCities = JSON.parse(localStorage.getItem("cityCache"))

//set savedCity if it doesn't exist
if (!savedCities){savedCities={}}

//event listner for search button
submitEl.addEventListener("click", async function(event){
    event.preventDefault()
    //check for incorrect city state format
    var Name = document.querySelector('#searchValue').value.toLowerCase()
    if (!Name.includes(",")){
        window.alert('Please use "City, State" format')
        return
    }
    var locName={}
    locName.City = document.querySelector('#searchValue').value.split(',')[0].trim().toLowerCase()
    locName.State = document.querySelector('#searchValue').value.split(',')[1].trim().toLowerCase()
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
        var cityListItem = document.createElement("li")
        cityListItem.textContent = savedCities[element].City + ", " + savedCities[element].State
        cityListItem.dataset.city = savedCities[element].City
        cityListItem.dataset.state = savedCities[element].State
        var delEl = document.createElement('button')
        delEl.textContent = 'X'
        delEl.dataset.citystate = savedCities[element].City + ", " + savedCities[element].State
        cityListItem.appendChild(delEl)
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

//function for building forecasts and displaying them.
function buildForecast(current, forecast){
    //current weather, first clear out old data
    let currentWeather = document.querySelector('.currentWeather')
    currentWeather.replaceChildren()
    let currentTemp = current.main.temp
    let currentWind = current.wind.speed
    let currentHumidity = current.main.humidity
    let city = current.name
    let currentDate = dayjs(current.dt * 1000).format('MM/DD/YYYY')
    let tempEl = document.createElement('p')
    tempEl.textContent = `Temp: ${Math.floor(currentTemp)}°F`
    let windEl = document.createElement('p')
    windEl.textContent = `Wind Speed: ${Math.floor(currentWind)} MPH`
    let humidityEl = document.createElement('p')
    humidityEl.textContent = `Humidity: ${currentHumidity}%`
    let iconEl = document.createElement('img')
    iconEl.src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`
    let h2El = document.createElement('h2')
    h2El.textContent = city + "  " + currentDate
    currentWeather.appendChild(h2El)
    currentWeather.appendChild(iconEl)
    currentWeather.appendChild(tempEl)
    currentWeather.appendChild(windEl)
    currentWeather.appendChild(humidityEl)

    //five day forecast
    let today = dayjs()
    //createdate array for the five days
    let forecastDays = []
    for (i=0; i<5; i++){
        let nextday = today.add(i+1, 'day').set('hour', 15).set('minute', 00).set('second', 00)
        forecastDays[i] = nextday.format('YYYY-MM-DD HH:mm:ss')
    }
    //clear out previous data
    for (i=0; i<5; i++){
        document.querySelector(`#day-${i}`).replaceChildren()
    }
    //populate new data
    forecast.list.forEach(function(forecastWeather){
        //compare with forecast date and time, if not in array go to next array index
        if(!forecastDays.includes(forecastWeather.dt_txt)){
            return
        }
        forecastDiv = document.querySelector(`#day-${forecastDays.indexOf(forecastWeather.dt_txt)}`)
        let forecastDateEl = document.createElement('h2')
        forecastDateEl.textContent = dayjs(forecastWeather.dt_txt).format('MM/DD/YYYY')
        let forecastImg = document.createElement('img')
        forecastImg.src = `https://openweathermap.org/img/wn/${forecastWeather.weather[0].icon}@2x.png`
        let forecastTempEl = document.createElement('p')
        forecastTempEl.textContent = `Temp: ${Math.floor(forecastWeather.main.temp)}°F`
        let forecastWindEl = document.createElement('p')
        forecastWindEl.textContent = `Wind: ${Math.floor(forecastWeather.wind.speed)} MPH`
        let forecastHumidityEl = document.createElement('p')
        forecastHumidityEl.textContent = `Humidity: ${forecastWeather.main.humidity}%`
        forecastDiv.appendChild(forecastDateEl)
        forecastDiv.appendChild(forecastImg)
        forecastDiv.appendChild(forecastTempEl)
        forecastDiv.appendChild(forecastWindEl)
        forecastDiv.appendChild(forecastHumidityEl)
    })
}

//function for citylist event listner
cityListEl.addEventListener('click', async function(event){
    let clickedEl = event.target
    if (clickedEl.tagName.toLowerCase() == 'button'){
        delete savedCities[clickedEl.dataset.citystate]
        localStorage.setItem("cityCache", JSON.stringify(savedCities))
        populateCities()
        return
    }
    let clickedResults = await getCoord(clickedEl.dataset.city, clickedEl.dataset.state)
    //if results returned continue, if not prompt user to try again
    if (clickedResults.length > 0){
        getWeather(clickedResults[0].lat, clickedResults[0].lon)
    }else{
        window.alert("That location could not be found. Please try again.")
    }
})

populateCities()