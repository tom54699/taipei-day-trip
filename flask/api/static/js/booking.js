import {getBookingData,logout,getAccessToken} from "./sendDataToBackend.js"
import { refreshAccessToken,checkLogin,} from "./member.js"
import { generateBookingPageStructure } from "./generatePages.js"


let memberName
const bookingIdList = []
const attractionNameList = []
const attractionAddressList = []
const attractionImgList = []
const bookingPriceList = []
const bookingDateList = []
const bookingTimeList = []
let data_length

window.addEventListener("load", () => {
    checkBookingAuth()

})
/* 檢查權限 */
export function checkBookingAuth(){
    const fetchGetBookingData = getBookingData()
    fetchGetBookingData.then((res) => {
        if(res[0] == "success"){
            // 如果沒資料
            if(res[1]["status"] == "noData"){
                memberName = res[1]["name"]
                console.log(memberName)
            }
            //memberName = res[1][0]["data"]["member"]["name"]
            data_length = res[1].length
            for(let i=0; i <data_length; i++){
                let data = res[1][i]["data"]
                memberName = data["member"]["name"]
                bookingIdList.push(data["id"])
                attractionNameList.push(data["attraction"]["name"])
                attractionAddressList.push(data["attraction"]["address"])
                attractionImgList.push(data["attraction"]["image"][0])
                bookingPriceList.push(data["price"])
                bookingDateList.push(data["date"])
                bookingTimeList.push(data["time"])
            }
            // 產生畫面
            generateBookingPageStructure(data_length)
            generateBookingPage(data_length)
            totalBookingPrice(data_length)
            deleteBookingButton(data_length)
        }else if(res[1] == "⚠ 請登入會員"){
            noAuthBookingPage()
        }else if(res[1] == "⚠ 請換發token"){
            let fetchRefreshAccessToken = refreshAccessToken()
            fetchRefreshAccessToken.then(res =>{
                if(res == "error"){
                    //bookingMessage.textContent = "⚠ 發生異常，請重新登入"
                    const fetchLogout = logout()
                    fetchLogout.then(res => {
                        if(res == "success"){
                            checkLogin()
                        }else{
                            console.log(res)
                        }
                    })
                }else{
                    checkBookingAuth()
                }
            })
        }
    })
}
/* 插入booking內容 */
export function generateBookingPage(data_length){
    const memberNameNode = document.getElementById("memberName")
    const attractionImage = document.getElementsByClassName("attractionImage")
    const attractionName = document.getElementsByClassName("attractionName")
    const bookingDate = document.getElementsByClassName("bookingDate")
    const bookingTime = document.getElementsByClassName("bookingTime")
    const bookingPrice = document.getElementsByClassName("bookingPrice")
    const attractionAddress = document.getElementsByClassName("attractionAddress")
    const bookingId = document.getElementsByClassName("bookingId")

    memberNameNode.textContent = memberName
    for(let i=0; i<data_length; i++){
        attractionImage[i].setAttribute("src",`${attractionImgList[i]}`)
        attractionName[i].textContent = `台北一日遊：${attractionNameList[i]}`
        bookingDate[i].textContent = bookingDateList[i]
        bookingTime[i].textContent = bookingTimeList[i]
        bookingPrice[i].textContent = bookingPriceList[i]
        attractionAddress[i].textContent = attractionAddressList[i]
        bookingId[i].textContent = bookingIdList[i]
    }
}

/* 註冊刪除 Booking Button */
export function deleteBookingButton(data_length){
    const deleteIcon = document.getElementsByClassName("deleteIcon")
    const bookingId = document.getElementsByClassName("bookingId")
    for(let i=0; i<data_length;i++){
        deleteIcon[i].addEventListener("click",() => {
            deleteBooking(Number(bookingId[i].textContent))
            bookingId[i].textContent = `${bookingId[i].textContent}` + " -- ❌取消訂單中💣"
            setTimeout("location.href = '/booking'",2500)
        })
    }
}
 /* 呼叫Delete Booking API */
 export async function deleteBooking(bookingId){
    const access_token = getAccessToken()
    try{
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization" : `Bearer ${access_token}`
        }
        const content = {
            "bookingId": bookingId
        }
        const config = {
            method: "DELETE",
            headers: headers,
            body: JSON.stringify(content)
        }
        console.log(bookingId)
        const response = await fetch("/api/booking",config)
        const getBookingData = await response.json()
        console.log("後端getBookingData回傳的資料",getBookingData)
    }
    catch(err){
        console.log("Something Wrong:",err)
    }
}



/* 總價計算 */
function totalBookingPrice(data_length){
    const totalBookingPrice = document.getElementById("totalBookingPrice")
    const bookingPrice = document.getElementsByClassName("bookingPrice")
    let total = 0
    for(let i=0; i<data_length; i++){
        total = total + Number(bookingPrice[i].textContent)
    }
    totalBookingPrice.innerHTML = `總價：新台幣 ${total} 元`
}


/* 沒登入的頁面反應 */
function noAuthBookingPage(){
    const errorMessage = document.getElementsByClassName("errorMessage")
    const header = document.getElementById("header")
    const main = document.getElementById("main")
    // 頁面清除
    header.remove()
    main.remove()
    dialogMask.classList.remove("none")
    loginBox.classList.remove("none")
    errorMessage[1].textContent = "⚠ 請登入"
    errorMessage[1].classList.remove("none")

}