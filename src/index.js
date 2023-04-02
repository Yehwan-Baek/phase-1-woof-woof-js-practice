document.addEventListener("DOMContentLoaded",() => {
    let filter = document.querySelector("#good-dog-filter")
    filter.addEventListener("click", toggleFilter)
    getDogs().then(addAllDogs)
})

function toggleFilter (e) {
    let filter = document.querySelector("#good-dog-filter")
    if (filter.innerHTML.includes("OFF")) {
        filter.innerHTML = "Filter good dogs: ON"
        updateDog()
    } else {
        filter.innerHTML = "Filter good dogs : OFF"
        updateDog()
    }
}

function addAllDogs(dogArr, filter = false) {
    let dogBar = document.querySelector("#dog-bar")
    dogBar.innerHTML = ""
    if (filter) {
        dogArr.filter(dog=>dog.isGoodDog).forEach(addSpanDogs)
    } else {
        dogArr.forEach(addSpanDogs)
    }
}

function addSpanDogs (dog) {
    let dogBar = document.querySelector("#dog-bar")
    let dogSpan = document.createElement("span")

    dogSpan.innerHTML = dog.name;
    dogSpan.dataset.id = dog.id;

    dogSpan.addEventListener("click", onDogSpan)
    dogBar.append(dogSpan)
}

function onDogSpan(e) {
    getSingleDog(e.target.dataset.id)
    .then(addDogInfo)
}

function addDogInfo(dog) {
    let dogInfo = document.querySelector("#dog-info")
    dogInfo.innerHTML = ""
    let dogImg = document.createElement("Img")
    dogImg.src = dog.image

    let dogTitle = document.createElement("h2")
    dogTitle.innerHTML = dog.name

    let dogBtn = document.createElement("btn")
    dogBtn.innerHTML = dog.isGood ? "Good Dog!" : "Bad Dog"
    dogBtn.dataset.id = dog.id
    dogBtn.addEventListener("click", onGoodDogBtn)

    dogInfo.append(dogImg, dogTitle, dogBtn)
}

function onGoodDogBtn(e) {
    let newValue;
    if (e.target.innerHTML.includes("Good")){
        e.target.innerHTML = "Bad Dog"
        newValue = false
    } else {
        e.target.innerHTML = "Good Dog"
        newValue = true
    }
    toggleGoodDog(e.target.dataset.id, newValue).then(updateDog)
}

function updateDog() {
    let filter = document.querySelector("#good-dog-filter")
    if (filter.innerHTML.includes("OFF")) {
        getDogs().then(dogArr => addAllDogs(dogArr))
    } else {
        getDogs().then(dogArr => addAllDogs(dogArr, true))
    }
}

let url = "http://localhost:3000/pups";

function getDogs() {
    return fetch(url)
    .then(res=>res.json())
}

function getSingleDog(id) {
    return fetch(url + `/${id}`)
    .then(res=>res.json())
}

function toggleGoodDog(id, newValue) {
    let options = {
        method: "PATCH",
        headers: {
        "content-type": "application/json"
        },
        body: JSON.stringify({
        isGoodDog: newValue
        })
    }
    return fetch(url + `/${id}`, options)
    .then(res => res.json())
}