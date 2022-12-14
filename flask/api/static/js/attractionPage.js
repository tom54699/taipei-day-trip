import {fetchAttraction} from "./fetchLocation.js"
import{sendBookingData,logout} from "./sendDataToBackend.js"
import {refreshAccessToken,checkLogin} from "./member.js"

let fetchId
let fetchName
let fetchMrt
let fetchCategories
let fetchImg = []
let fetchDescription
let fetchAddress
let fetchTransport
let imgId 
let imageLength

window.addEventListener("load", () => {
    setNowDate()
})
export async function generateAttraction(id){
    await fetchAttraction(id).then(data=>{
        /* Get Data */
        console.log(data)
        
        imageLength = data["data"]["images"].length
        for(let i=0;i<imageLength;i++){
            let newFetchImg = data["data"]["images"][i]
            fetchImg.push(newFetchImg)
        }
        fetchId = data["data"]["id"]
        fetchName = data["data"]["name"]
        fetchMrt = data["data"]["mrt"]
        fetchCategories = data["data"]["category"]
        fetchDescription = data["data"]["description"]
        fetchAddress = data["data"]["address"]
        fetchTransport = data["data"]["transport"]
        titleChange()
 
        /* Define Node */
        let dotBoxNode=document.getElementsByClassName("dotBox")
        let attractionNameNode = document.getElementsByClassName("attractionName")
        let attractionImgBoxNode = document.getElementsByClassName("attractionImgBox")
        let attractionCategoryNode = document.getElementsByClassName("attractionCategory")
        let attractionDescriptionNode = document.getElementsByClassName("attractionDescription")
        let attractionAddressNode = document.getElementsByClassName("attractionAddress")
        let attractionTransportNode = document.getElementsByClassName("attractionTransport")
        let googleMap = document.getElementById("googleMap")
        /* Add Data To Node */
        attractionNameNode[0].textContent = fetchName
        attractionCategoryNode[0].textContent = `${fetchCategories} at ${fetchMrt}`
        attractionDescriptionNode[0].textContent = fetchDescription
        attractionAddressNode[0].textContent = fetchAddress
        attractionTransportNode[0].textContent = fetchTransport
        googleMap.src = `https://maps.google.com.tw/maps?f=q&hl=zh-TW&geocode=&q=${fetchAddress}&z=16&output=embed&t=`
        for(let i=0;i<imageLength;i++){
            let image = document.createElement("img")
            image.setAttribute("src",`${fetchImg[i]}`)
            image.setAttribute("class","attractionImg fade")
            if(i != 0){
                image.setAttribute("class","attractionImg fade none")
            }
            attractionImgBoxNode[0].appendChild(image)
        }
        /* Add Dot*/
        for(let i=0;i<imageLength;i++){
            let dot = document.createElement("section")
            dot.setAttribute("class","dot")
            dotBoxNode[0].appendChild(dot)
        }
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
    dot[imgId].style.backgroundImage = "url(/static/pic/circle_current.png)"
})

/* Img Button */
let leftArrow = document.getElementById("leftArrow");
let rightArrow = document.getElementById("rightArrow");
let dot = document.getElementsByClassName("dot")

rightArrow.addEventListener("click", () => {
    let attractionImg = document.getElementsByClassName("attractionImg")
    imgId = imgId +1
    if(imgId >= imageLength){
        imgId = 0
    }
    if(imgId == 0){
        dot[imageLength-1].style.backgroundImage = "url(/static/pic/circle.png)"
        dot[imgId].style.backgroundImage = "url(/static/pic/circle_current.png)" 
        attractionImg[imageLength-1].classList.add("none")
        attractionImg[imgId].classList.remove("none")

    }else{
        dot[imgId-1].style.backgroundImage = "url(/static/pic/circle.png)"
        dot[imgId].style.backgroundImage = "url(/static/pic/circle_current.png)" 
        attractionImg[imgId-1].classList.add("none")
        attractionImg[imgId].classList.remove("none")
    }
})

leftArrow.addEventListener("click", () => {
    let attractionImg = document.getElementsByClassName("attractionImg")
    imgId = imgId -1
    if(imgId < 0){
        imgId = imageLength-1
    }
    if(imgId == imageLength-1){
        dot[0].style.backgroundImage = "url(/static/pic/circle.png)"
        dot[imgId].style.backgroundImage = "url(/static/pic/circle_current.png)" 
        attractionImg[0].classList.add("none")
        attractionImg[imgId].classList.remove("none")

    }else{
        dot[imgId+1].style.backgroundImage = "url(/static/pic/circle.png)"
        dot[imgId].style.backgroundImage = "url(/static/pic/circle_current.png)" 
        attractionImg[imgId+1].classList.add("none")
        attractionImg[imgId].classList.remove("none")
    }
})


/* 上下半天按鈕切換 */
let morning = document.getElementById("morning")
let afternoon = document.getElementById("afternoon")
let tourFee = document.getElementById("tourFee")

morning.addEventListener("click",() => {
    checkTourTime()
})
afternoon.addEventListener("click",() => {
    checkTourTime()
})

function checkTourTime(){
    if(morning.checked == true){
        tourFee.textContent = "新台幣 2000 元"
    }else if(afternoon.checked == true){
        tourFee.textContent = "新台幣 2500 元"
    }
}

/* 預設 INPUT DATE */
let bookingDate = document.getElementById("bookingDate") 
function setNowDate(){
    let today = new Date();
    bookingDate.value = today.toISOString().substr(0, 10);
    let year = today.getFullYear()+1
    let month = ('0'+ (today.getMonth() + 1)).slice(-2)
    let date = ('0' + today.getDate()).slice(-2)
    let time = year+"-"+month+"-"+date
    bookingDate.setAttribute("max", time)
}



/* 開始預約行程按鈕 */
let bookingAttractionButton = document.getElementById("bookingAttractionButton")
let bookingMessage = document.getElementById("bookingMessage")
let goBookingButton = document.getElementById("goBookingButton")
bookingAttractionButton.addEventListener("click",async function enterBookingPage(){
    /* 抓取填寫的資料 */
    let date = String(bookingDate.value)
    let time
    let price
    if(morning.checked == true){
        time = "morning"
        price = 2000
    }else if(afternoon.checked == true){
        time = "afternoon"
        price = 2500
    }
    let fetchSendBookingData = sendBookingData(fetchId,date,time,price)

    fetchSendBookingData.then(res=>{
        console.log(res)
        if(res[0] == "ok"){
            bookingMessage.textContent = res[1]
            bookingMessage.classList.remove("none")
            // 倒數自動跳轉
            goBookingButton.textContent = "3 ...自動跳轉中"
            let number = 3
            let timeout1 = setInterval( () => {
                console.log(number)
                number --
                goBookingButton.textContent = number + " ...自動跳轉中"
                if(number <= 0){
                    goBookingButton.textContent = "滾去付錢 🖕"
                    clearInterval(timeout1)
                }
            }, 1000);
            setTimeout("location.href = '/booking'",3500)
            goBookingButton.classList.remove("none") 
            
        }else if(res[0] == "error"){
            if(res[1] == "⚠ 請登入會員"){
                bookingMessage.textContent = res[1]
                bookingMessage.classList.remove("none")
                goBookingButton.classList.add("none")
                checkLogin()
            }
            if(res[1] == "⚠ 請換發token"){
                bookingMessage.textContent = res[1]
                bookingMessage.classList.remove("none")
                goBookingButton.classList.add("none")
                let fetchRefreshAccessToken = refreshAccessToken()
                fetchRefreshAccessToken.then(res =>{
                    console.log(res)
                    if(res == "error"){
                        bookingMessage.textContent = "⚠ 發生異常，請重新登入"
                        logout()
                        checkLogin()
                    }else{
                        enterBookingPage()
                    }
                })
            }
            if(res[1] == "⚠ 已在這個時段預約行程"){
                bookingMessage.textContent = res[1]
                bookingMessage.classList.remove("none")
                goBookingButton.classList.add("none")
            }
        }else{
            bookingMessage.textContent = "⚠ 未知原因失敗"
            bookingMessage.classList.remove("none") 
        }
    })
})

/* title動態變化 */
function titleChange(){
    document.title = `Taipei Trip 台北一日遊 | ${fetchName}`
}