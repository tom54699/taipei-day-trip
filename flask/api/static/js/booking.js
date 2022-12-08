import {getBookingData,logout,getAccessToken,sendBookingData, sendOrderData} from "./sendDataToBackend.js"
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
        console.log("booking",res)
        if(res[0] == "success"){
            // 如果沒資料
            if(res[1]["status"] == "noData"){
                const memberNameNode = document.getElementById("memberName")
                memberName = res[1]["name"]
                memberNameNode.textContent = memberName
                noBookingPage()
            }else{
            //memberName = res[1][0]["data"]["member"]["name"]
            data_length = Number(res[1].length)
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
            }
        }else if(res[1] == "⚠ 請登入會員"){
            noAuthBookingPage()
        }else if(res[1] == "⚠ 請換發token"){
            let fetchRefreshAccessToken = refreshAccessToken()
            fetchRefreshAccessToken.then(res =>{
                if(res == "error"){
                    logout()
                    checkLogin()
                    noAuthBookingPage()
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
            let fetchDeleteBooking = deleteBooking(Number(bookingId[i].textContent))
            fetchDeleteBooking.then(res => {
                console.log(res)
                if(res["message"] == "⚠ 請換發token"){
                    let fetchRefreshAccessToken = refreshAccessToken()
                    fetchRefreshAccessToken.then(res =>{
                        console.log(res)
                        if(res == "error"){
                            bookingId[i].textContent = "⚠ 發生異常，請重新登入"
                            logout()
                            checkLogin()
                        }else{
                            deleteBooking(Number(bookingId[i].textContent))
                            bookingId[i].textContent = `${bookingId[i].textContent}` + " -- ❌取消訂單中💣"
                            setTimeout("location.href = '/booking'",2500)
                        }
                    })
                }else{
                    bookingId[i].textContent = `${bookingId[i].textContent}` + " -- ❌取消訂單中💣"
                    setTimeout("location.href = '/booking'",2500)
                }
            })
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
        if(getBookingData["message"] == "⚠ 請換發token"){
            return getBookingData
        }
        return "success"
    }
    catch(err){
        console.log("Something Wrong:",err)
    }
}


let totalPrice = 0
/* 總價計算 */
function totalBookingPrice(data_length){
    const totalBookingPrice = document.getElementById("totalBookingPrice")
    const bookingPrice = document.getElementsByClassName("bookingPrice")
    for(let i=0; i<data_length; i++){
        totalPrice = totalPrice + Number(bookingPrice[i].textContent)
    }
    totalBookingPrice.innerHTML = `總價：新台幣 ${totalPrice} 元`
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

/* 沒訂單的頁面反應 */
function noBookingPage(){
    const body = document.getElementById("body")
    const main = document.getElementById("main")
    const footer = document.getElementById("footer")
    const header = document.getElementById("header")
    // 頁面清除
    main.remove()
    let emptyState = document.createElement("div")
    emptyState.setAttribute("class","emptyState")
    emptyState.textContent = "目前沒有任何待預訂的行程"
    body.insertBefore(emptyState,footer)
    let emptyFooter = document.createElement("div")
    emptyFooter.setAttribute("class","emptyFooter")
    body.appendChild(emptyFooter)
}


/* TapPay */

TPDirect.setupSDK(125973, "app_C8T0HTSdPJL2xPPmlQVSltkz992p9Jd6aPsL6k1Lj5Ao7Fyw7iTu2ZUH9fHe", "sandbox")

/* ----------------------------- */
let fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'CCV'
    }
}
TPDirect.card.setup({
    // Display ccv field
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            //5'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            'font-size': '16px'
        },
        // style focus state
        ':focus': {
            'color': '#448899'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'red'
            }
        }
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
})

/* 輸入聯絡欄位格式錯誤 */
const contactName= document.getElementById("contactName")
const contactEmail = document.getElementById("contactEmail")
const contactPhone = document.getElementById("contactPhone")
const errorContactMessage = document.getElementsByClassName("errorContactMessage")
let contactNameInputValue
let contactEmailInputValue
let contactPhoneInputValue
let bookingIsValidName = false
let bookingIsValidEmail = false
let bookingIsValidPhone = false
contactName.addEventListener("input",() => {
    bookingIsValidName = true
    errorContactMessage[0].classList.add("none")
    contactNameInputValue = contactName.value
    if(contactNameInputValue == "" || contactNameInputValue == undefined){
        bookingIsValidName = false
    }
})
contactEmail.addEventListener("input",() => {
    bookingIsValidName = true
    checkContactEmailInput()
    contactEmailInputValue = contactEmail.value
    if(contactEmailInputValue == "" || contactEmailInputValue == undefined){
        bookingIsValidEmail = false
    }
})
contactPhone.addEventListener("input",() => {
    bookingIsValidName = true
    checkContactPhoneInput()
    contactPhoneInputValue = contactPhone.value
    if(contactPhoneInputValue == "" || contactPhoneInputValue == undefined){
        bookingIsValidPhone = false
    }
})
function checkContactEmailInput(){
    bookingIsValidEmail = contactEmail.checkValidity()
    if(bookingIsValidEmail != true){
        errorContactMessage[1].textContent = "⚠ 格式錯誤，請重新輸入"
        errorContactMessage[1].classList.remove("none")
    }else{
        errorContactMessage[1].classList.add("none")
    }
}
function checkContactPhoneInput(){
    bookingIsValidPhone = contactPhone.checkValidity()
    if(bookingIsValidPhone != true){
        errorContactMessage[2].textContent = "⚠ 格式錯誤，請重新輸入"
        errorContactMessage[2].classList.remove("none")
    }else{
        errorContactMessage[2].classList.add("none")
    }
}

function checkContactInput(){
    if(contactNameInputValue == undefined || contactNameInputValue == ""){
        errorContactMessage[0].textContent = "⚠ 必填"
        errorContactMessage[0].classList.remove("none")
    }
    if(contactEmailInputValue == undefined || contactEmailInputValue == ""){
        errorContactMessage[1].textContent = "⚠ 必填"
        errorContactMessage[1].classList.remove("none")
    }
    if(contactPhoneInputValue == undefined || contactPhoneInputValue == ""){
        errorContactMessage[2].textContent = "⚠ 必填"
        errorContactMessage[2].classList.remove("none")
    }
}
/*  get prime */
const bookingButton = document.getElementById("bookingButton")
const errorCardMessage = document.getElementsByClassName("errorCardMessage")
let prime
bookingButton.addEventListener("click", () => {
    if(!bookingIsValidName || !bookingIsValidEmail || !bookingIsValidPhone){
        checkContactInput()
        return
    }
    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    console.log(tappayStatus)

    // 確認是否可以 getPrime

    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert('get prime error' + result.msg)
            errorCardMessage[0].classList.remove("none")
            return
        }
        prime = result.card.prime
        errorCardMessage[0].classList.add("none")
        alert('get prime 成功，prime: ' + result.card.prime)

        const order_data = {
            "prime": prime,
            "order": {
                "price": totalPrice,
                "trip": [],
                "contact":{
                    "name": contactNameInputValue,
                    "email": contactEmailInputValue,
                    "phone": contactPhoneInputValue
                }    
            },
        }

        for(let i=0; i<data_length; i++){
            let trips = {
                "attraction":{
                    "id": bookingIdList[i],
                    "name": attractionNameList[i],
                    "address": attractionAddressList[i],
                    "image": attractionImgList[i],
                    "bookingId": bookingIdList[i]
                },
                "date": bookingDateList[i],
                "time": bookingTimeList[i]
            }
            order_data["order"]["trip"].push(trips)
        }

        sendOrderData(order_data)
    })
})
