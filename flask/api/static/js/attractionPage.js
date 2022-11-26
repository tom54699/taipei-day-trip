import {fetchAttraction} from "./fetchLocation.js"

let fetchName
let fetchMrt
let fetchCategories
let fetchImg = []
let fetchDescription
let fetchAddress
let fetchTransport
let imgId 
let imageLength

export async function generateAttraction(id){
    await fetchAttraction(id).then(data=>{
        /* Get Data */
        console.log(data)
        
        imageLength = data["data"]["images"].length
        for(let i=0;i<3;i++){
            let newFetchImg = data["data"]["images"][i]
            fetchImg.push(newFetchImg)
        }
        fetchName = data["data"]["name"]
        fetchMrt = data["data"]["mrt"]
        fetchCategories = data["data"]["category"]
        fetchDescription = data["data"]["description"]
        fetchAddress = data["data"]["address"]
        fetchTransport = data["data"]["transport"]

 
        /* Define Node */
        let attractionNameNode = document.getElementsByClassName("attractionName")
        let attractionImgNode = document.getElementsByClassName("attractionImg")
        let attractionCategoryNode = document.getElementsByClassName("attractionCategory")
        let attractionDescriptionNode = document.getElementsByClassName("attractionDescription")
        let attractionAddressNode = document.getElementsByClassName("attractionAddress")
        let attractionTransportNode = document.getElementsByClassName("attractionTransport")

        /* Add Data To Node */
        attractionImgNode[0].style.backgroundImage = `url(${fetchImg[0]})`
        attractionNameNode[0].textContent = fetchName
        attractionCategoryNode[0].textContent = `${fetchCategories} at ${fetchMrt}`
        attractionDescriptionNode[0].textContent = fetchDescription
        attractionAddressNode[0].textContent = fetchAddress
        attractionTransportNode[0].textContent = fetchTransport
    })
}

/* Check if Strings ends with Number */
function endsWithNumber(str) {
    return /[0-9]+$/.test(str);
}

function getNumberAtEnd(str){
    if(endsWithNumber(str)){
        return Number(str.match(/[0-9]+$/)[0]);
    }
    return null
}

/* First Loaded */
window.addEventListener("DOMContentLoaded", async() => {
    let pathname = location.pathname
    let attractionId = getNumberAtEnd(pathname)
    await generateAttraction(attractionId)
    imgId = 0
    dot1.style.backgroundImage = "url(/static/pic/circle_current.png)"
})

/* Img Button */
let leftArrow = document.getElementById("leftArrow");
let rightArrow = document.getElementById("rightArrow");
let dot1 = document.getElementById("dot1");
let dot2= document.getElementById("dot2");
let dot3 = document.getElementById("dot3");

rightArrow.addEventListener("click", () => {
    let attractionImgNode = document.getElementsByClassName("attractionImg")
    imgId = imgId +1
    if(imgId >= 3){
        imgId = 0
    }
    switch(true){
        case(imgId == 0):
        dot1.style.backgroundImage = "url(/static/pic/circle_current.png)"
        dot2.style.backgroundImage = "url(/static/pic/circle.png)"
        dot3.style.backgroundImage = "url(/static/pic/circle.png)"
        break;
        case(imgId == 1):
        dot1.style.backgroundImage = "url(/static/pic/circle.png)"
        dot2.style.backgroundImage = "url(/static/pic/circle_current.png)"
        dot3.style.backgroundImage = "url(/static/pic/circle.png)"
        break;
        case(imgId == 2):
        dot1.style.backgroundImage = "url(/static/pic/circle.png)"
        dot2.style.backgroundImage = "url(/static/pic/circle.png)"
        dot3.style.backgroundImage = "url(/static/pic/circle_current.png)"
        break;
    }
    console.log(imgId)
    attractionImgNode[0].style.backgroundImage = `url(${fetchImg[imgId]})`
})

leftArrow.addEventListener("click", () => {
    let attractionImgNode = document.getElementsByClassName("attractionImg")
    imgId = imgId -1
    if(imgId < 0){
        imgId = 3-1
    }
    switch(true){
        case(imgId == 0):
        dot1.style.backgroundImage = "url(/static/pic/circle_current.png)"
        dot2.style.backgroundImage = "url(/static/pic/circle.png)"
        dot3.style.backgroundImage = "url(/static/pic/circle.png)"
        break;
        case(imgId == 1):
        dot1.style.backgroundImage = "url(/static/pic/circle.png)"
        dot2.style.backgroundImage = "url(/static/pic/circle_current.png)"
        dot3.style.backgroundImage = "url(/static/pic/circle.png)"
        break;
        case(imgId == 2):
        dot1.style.backgroundImage = "url(/static/pic/circle.png)"
        dot2.style.backgroundImage = "url(/static/pic/circle.png)"
        dot3.style.backgroundImage = "url(/static/pic/circle_current.png)"
        break;
    }
    console.log(imgId)
    attractionImgNode[0].style.backgroundImage = `url(${fetchImg[imgId]})`
})

