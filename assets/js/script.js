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

const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?appid=c4bc6124ae143bb4ad40a5546c016dd6"
const currentURL = "https://api.openweathermap.org/data/2.5/weather?appid=c4bc6124ae143bb4ad40a5546c016dd6"
const geoURL = "http://api.openweathermap.org/geo/1.0/direct?appid=c4bc6124ae143bb4ad40a5546c016dd6"
const submitEl = document.querySelector('#searchBtn')
const cityListEl = document.querySelector('.cityList')
var savedCities = JSON.parse(localStorage.getItem("cityCache"))

//set savedCity if it doesn't exist
if (!savedCities){savedCities={}}

//event listner for search button
submitEl.addEventListener("click", async function(event){
    event.preventDefault()
    var Name = document.querySelector('#searchValue').value
    var locName={}
    locName.City = document.querySelector('#searchValue').value.split(',')[0].trim()
    locName.State = document.querySelector('#searchValue').value.split(',')[1].trim()
    var results = await getCoord(locName.City, locName.State)
    console.log(results[0])
    //if results returned continue, if not prompt user to try again
    if (results.length > 0){
        var weatherData = await getWeather(results[0].lat, results[0].lon)
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
    console.log(locURL)
    let response = await fetch(locURL)
    let data = await response.json()
    return await data
}

populateCities()