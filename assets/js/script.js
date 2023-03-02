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
submitEl.addEventListener("click", function(event){
    event.preventDefault()
    var Name = document.querySelector('#searchValue').value
    var locName={}
    locName.City = document.querySelector('#searchValue').value.split(',')[0].trim()
    locName.State = document.querySelector('#searchValue').value.split(',')[1].trim()
    //only add city if it doesn't exist
    if (!savedCities.Name){savedCities[Name] = locName}
    localStorage.setItem("cityCache", JSON.stringify(savedCities))
    populateCities()
})

// function for populating saved cities
function populateCities(){
    cityListEl.replaceChildren()
    Object.keys(savedCities).forEach((element)=>{
        console.log(savedCities[element])
        var cityListItem = document.createElement("p")
        cityListItem.textContent = savedCities[element].City + ", " + savedCities[element].State
        cityListEl.appendChild(cityListItem)
    })
}

//function for getting lat and long
function getCoord(city, state){

}

populateCities()