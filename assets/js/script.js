// current weather = https://api.openweathermap.org/data/2.5/weather?appid=c4bc6124ae143bb4ad40a5546c016dd6&units=imperial&q=Atlanta,Ga,1
// forecast = https://api.openweathermap.org/data/2.5/forecast?appid=c4bc6124ae143bb4ad40a5546c016dd6&units=imperial&q=woodstock,GA,1&cnt=20
// fetch(url)
//     .then(function (response) {
//         console.log(response)
//         return response.json()
//     })
//     .then (function (data){
//         console.log(data)
//     })

const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?appid=c4bc6124ae143bb4ad40a5546c016dd6"
const currentURL = "https://api.openweathermap.org/data/2.5/weather?appid=c4bc6124ae143bb4ad40a5546c016dd6"
const submitEl = document.querySelector('#searchBtn')
const cityListEl = document.querySelector('.cityList')
var savedCity = JSON.parse(localStorage.getItem("cityCache"))

//set savedCity if it doesn't exist
if (!savedCity){savedCity=[]}

//event listner for search button
submitEl.addEventListener("click", function(event){
    event.preventDefault()
    var searchValue = document.querySelector('#searchValue').value
    //only add city if it doesn't exist
    if (!savedCity.includes(searchValue)){
        savedCity.unshift(searchValue)
    }
    localStorage.setItem("cityCache", JSON.stringify(savedCity))
    populateCities()
})

// function for populating saved cities
function populateCities(){
    cityListEl.replaceChildren()
    savedCity.forEach((element)=>{
        var cityListItem = document.createElement("p")
        cityListItem.textContent = element
        cityListEl.appendChild(cityListItem)
    })
}

populateCities()