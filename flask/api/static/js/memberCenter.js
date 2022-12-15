import {getMemberCenterData,getOrderDataByOrderNumber,updateMemberProfile} from "./sendDataToBackend.js"
import {refreshAccessToken} from "./member.js"
import { generateBookingPageStructure } from "./generatePages.js"


let memberName
let memberNickName
let memberPassword 
let memberEmail
let memberBirthday
let memberPhoneNumber
let memberIntro
const booking_lists = []
const order_lists= []

/* 載入 */
window.addEventListener("DOMContentLoaded", () => {
    checkMemberCenterAuth()
    memberCenterButtonAddEvent()
})
window.addEventListener("resize", () => {
    if(window.innerWidth <= 700){
        smallCalendarAddEvent(tours)
    }else(
        calendarAddEvent(tours)
    )
})

/* 檢查權限 */
function checkMemberCenterAuth(){
    const fetchGetMemberCenterData = getMemberCenterData()
    fetchGetMemberCenterData.then(res => {
        console.log("MemberCenter",res)
        if(res[0] == "success"){
            let memberCenterData = res[1].data
            memberName = memberCenterData.member.name
            memberNickName = memberCenterData.member.nick_name
            memberEmail = memberCenterData.member.email
            memberPassword = String(memberCenterData.member.password)
            memberBirthday = memberCenterData.member.birthday
            memberPhoneNumber = memberCenterData.member.phone_number
            memberIntro = memberCenterData.member.intro
            for(let data of memberCenterData.bookings){
                booking_lists.push(data)
            }
            for(let data of memberCenterData.orders){
                order_lists.push(data)
            }
            // 產生畫面 + 按鈕註冊
            calendarAddEvent()
            memberDateShow()
            memberHistoryOrderShow(order_lists)
            memberHistoryTourShow()
            calendarGenerate()
            popupHistoryOrder()
            popupHistoryOrderCancel()
            memberProfileEditButton()
        }else if(res[1] == "⚠ 請登入會員"){
            location.href = "/"
        }else if(res[1] == "⚠ 請換發token"){
            const fetchRefreshAccessToken = refreshAccessToken()
            fetchRefreshAccessToken.then(res =>{
                if(res == "error"){
                    location.href = "/"
                }else{
                    checkMemberCenterAuth()
                }
            })
        }
    })
}
const tours = []
/* 行事曆產生器 */
function calendarGenerate(){
    let start_time
    let end_time
    for(let i of booking_lists){
        if(i.time == "morning"){
            start_time = "T08:00:00"
            end_time = "T12:00:00"
        }else{
            start_time = "T13:00:00"
            end_time = "T17:00:00"
        }
        let tour = {
            title: i.attraction.name,
            start: `${i.date}${start_time}`,
            end: `${i.date}${end_time}`,
            display: "block"
        }
        tours.push(tour)
    }
    if(window.innerWidth <= 700){
        smallCalendarAddEvent(tours)
    }else(
        calendarAddEvent(tours)
    )
}
/* Calendar */
function calendarAddEvent(tour_lists){
    const calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        navLinks: true,
        locale: "zh-tw",
        navLinks: true,
        height: "100%",
        headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "listWeek timeGridDay,timeGridWeek,dayGridMonth"
        },
        /*eventClick: function(info) {
        var eventObj = info.event;
    
        if (eventObj.url) {
            alert(
            'Clicked ' + eventObj.title + '.\n' +
            'Will open ' + eventObj.url + ' in a new tab'
            );
    
            window.open(eventObj.url);
    
            info.jsEvent.preventDefault(); // prevents browser from following link in current tab.
        } else {
            alert('Clicked ' + eventObj.title);
        }
        },*/
        events: tour_lists,  
        windowResize: function(arg) {
            calendarAddEvent(tours)
          }  
    });
    calendar.render();  
}
/* 小行事曆產生 */
function smallCalendarAddEvent(tour_lists){
    const calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'listWeek',
        navLinks: true,
        locale: "zh-tw",
        navLinks: true,
        height: "100%",
        headerToolbar: {
        left: "prev,next",
        center: "",
        right: "listWeek,dayGridMonth"
        },
        events: tour_lists,  
        windowResize: function(arg) {
            smallCalendarAddEvent(tours)
        }  
    });
    calendar.render();
}


/* 欄位切換 */

function memberCenterButtonAddEvent(){
    const memberProfileButton = document.getElementsByClassName("memberProfileButton")
    const memberHistoryOrderButton = document.getElementsByClassName("memberHistoryOrderButton")
    const calendarButton = document.getElementsByClassName("calendarButton")
    const memberProfileBox = document.getElementById("memberProfileBox")
    const memberHistoryOrderBox = document.getElementById("memberHistoryOrderBox")
    const calendarBox = document.getElementsByClassName("calendarBox")

    memberProfileButton[0].addEventListener("click", () => {
        memberProfileBox.classList.remove("none")
        memberHistoryOrderBox.classList.add("none")
        calendarBox[0].classList.add("none")
    })
    memberHistoryOrderButton[0].addEventListener("click", () => {
        memberProfileBox.classList.add("none")
        memberHistoryOrderBox.classList.remove("none")
        calendarBox[0].classList.add("none")
    })
    calendarButton[0].addEventListener("click", () => {
        memberProfileBox.classList.add("none")
        memberHistoryOrderBox.classList.add("none")
        calendarBox[0].classList.remove("none")
    })
}

/* 折線圖產生器 */
function memberHistoryTourShow(){
    const today = new Date();
    const year = today.getFullYear()
    const date_lists = []
    const years = {
        "jan": 0,
        "feb": 0,
        "mar": 0,
        "apr": 0,
        "may": 0,
        "jun": 0,
        "jul": 0,
        "aug": 0,
        "sep": 0,
        "oct": 0,
        "nov": 0,
        "dec": 0,
    }
    for(let i of booking_lists){
        let date = i.date.slice(5,7)
        date_lists.push(date)
    }
    for(let i of date_lists){
        switch(true){
            case(i == "01"):
            years.jan ++
            break;
            case(i == "02"):
            years.feb ++
            break;
            case(i == "03"):
            years.mar ++
            break;
            case(i == "04"):
            years.apr ++
            break;
            case(i == "05"):
            years.may ++
            break;
            case(i == "06"):
            years.jun ++
            break;
            case(i == "07"):
            years.jul ++
            break;
            case(i == "08"):
            years.aug ++
            break;
            case(i == "09"):
            years.sep++
            break;
            case(i == "10"):
            years.oct ++
            break;
            case(i == "11"):
            years.nov ++
            break;
            case(i == "12"):
            years.dec ++
            break;
        }
    }
    /* 折線圖設定 */
    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [{
                label: ` ${year}年旅遊次數`,
                data: [`${years.jan}`, `${years.feb}`, `${years.mar}`, `${years.apr}`, `${years.may}`, `${years.jun}`, `${years.jul}`, `${years.aug}`, `${years.sep}`, `${years.oct}`, `${years.nov}`, `${years.dec}`],
                fill: false,
                borderColor: "rgb(75, 192, 192)",
            }]
        },
    });
}



/* 歷史訂單+花費產生器 */
function memberHistoryOrderShow(data_length){
    const memberHistoryOrderNode = document.getElementsByClassName("memberHistoryOrder")
    const memberHistoryOrderCardNode = document.getElementsByClassName("memberHistoryOrderCard")
    const memberHistoryConsume = document.getElementById("memberHistoryConsume")
    let totalMoney = 0
    for(let i in data_length){
        const memberHistoryOrderCard = document.createElement("div")
        memberHistoryOrderCard.setAttribute("class","memberHistoryOrderCard")
        memberHistoryOrderNode[0].appendChild(memberHistoryOrderCard)
    
        const memberHistoryOrderTitle = document.createElement("div")
        memberHistoryOrderTitle.setAttribute("class","memberHistoryOrderTitle")
        memberHistoryOrderTitle.textContent = `歷史訂單${Number(i)+1}`
        memberHistoryOrderCardNode[i].appendChild(memberHistoryOrderTitle)
    
        const memberHistoryOrderNumber = document.createElement("a")
        memberHistoryOrderNumber.setAttribute("class","memberHistoryOrderNumber")
        memberHistoryOrderNumber.textContent = order_lists[i].order_number
        memberHistoryOrderCardNode[i].appendChild(memberHistoryOrderNumber)
        totalMoney += Number(order_lists[i].price)
    }
    memberHistoryConsume.textContent = `${totalMoney} NT$`
}

/* 會員資料產生器 */
function memberDateShow(){
    const memberProfile = document.getElementsByClassName("memberProfile")

    memberProfile[0].textContent = memberEmail
    memberProfile[1].textContent = memberName
    if(memberNickName === null){
        memberProfile[2].textContent = "(空)"
    }else{
        memberProfile[2].textContent = memberNickName
    }
    if(memberBirthday === null){
        memberProfile[3].textContent = "(空)"
    }else{
        memberProfile[3].textContent = memberBirthday
    }
    if(memberPhoneNumber === null){
        memberProfile[4].textContent = "(空)"
    }else{
        memberProfile[4].textContent = memberPhoneNumber
    }
    if(memberIntro === null){
        memberProfile[5].textContent = "(空)"
    }else{
        memberProfile[5].textContent = memberIntro
    }
}


let bookingIdList = []
let attractionNameList = []
let attractionAddressList = []
let attractionImgList = []
let bookingPriceList = []
let bookingDateList = []
let bookingTimeList = []

/* 點擊歷史訂單彈出畫面 */
function popupHistoryOrder(){
    const popupHistoryOrder = document.getElementsByClassName("popupHistoryOrder")
    const memberHistoryOrderNumber = document.getElementsByClassName("memberHistoryOrderNumber")
    const totalPrice = document.getElementById("totalPrice")
    const contactName = document.getElementById("contactName")
    const contactEmail = document.getElementById("contactEmail")
    const contactPhone = document.getElementById("contactPhone")

    let trip_length

    for(let i of memberHistoryOrderNumber){
        i.addEventListener("click", function generatePopupHistoryOrder(){
            let order_number = i.textContent
            console.log(order_number)
            popupHistoryOrder[0].classList.remove("none")
            dialogMask.classList.remove("none")
            let fetchGetOrderDataByOrderNumber = getOrderDataByOrderNumber(order_number)
            fetchGetOrderDataByOrderNumber.then(res =>{
                console.log(res)
                if(res[0] == "success"){
                    const order_data = res[1].data
                    trip_length = order_data.trip.length
                    contactName.textContent = order_data.contact.name
                    contactEmail.textContent = order_data.contact.email
                    contactPhone.textContent = order_data.contact.phone
                    totalPrice.textContent = order_data.price
                    for(let i in order_data.trip){
                        bookingIdList.push(order_data.trip[i].booking_id)
                        bookingPriceList.push(order_data.trip[i].booking_price)
                        bookingDateList.push(order_data.trip[i].date)
                        bookingTimeList.push(order_data.trip[i].time)
                        attractionNameList.push(order_data.trip[i].attraction.name)
                        attractionAddressList.push(order_data.trip[i].attraction.address)
                        attractionImgList.push(order_data.trip[i].attraction.image[0])
                    }
                    generateBookingPageStructure(trip_length)
                    generateBookingPage(trip_length)
                    //  清空
                    bookingIdList = []
                    attractionNameList = []
                    attractionAddressList = []
                    attractionImgList = []
                    bookingPriceList = []
                    bookingDateList = []
                    bookingTimeList = []
                }else if(res[1] == "⚠ 請登入會員"){
                    location.href = "/"
                }else if(res[1] == "⚠ 請換發token"){
                    const fetchRefreshAccessToken = refreshAccessToken()
                    fetchRefreshAccessToken.then(res =>{
                        if(res == "error"){
                            location.href = "/"
                        }else{
                            generatePopupHistoryOrder()
                        }
                    })
                }
            })
        })
    }
}

/* 插入歷史訂單popup畫面 */
function generateBookingPage(data_length){
    const attractionImage = document.getElementsByClassName("attractionImage")
    const attractionName = document.getElementsByClassName("attractionName")
    const bookingDate = document.getElementsByClassName("bookingDate")
    const bookingTime = document.getElementsByClassName("bookingTime")
    const bookingPrice = document.getElementsByClassName("bookingPrice")
    const attractionAddress = document.getElementsByClassName("attractionAddress")
    const bookingId = document.getElementsByClassName("bookingId")

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

/* 歷史訂單彈出視窗關閉紐 */
function popupHistoryOrderCancel(){
    const popupHistoryOrderCancelButton = document.getElementsByClassName("popupHistoryOrderCancelButton")
    const popupHistoryOrder = document.getElementsByClassName("popupHistoryOrder")
    const bookingCardBox = document.getElementsByClassName("bookingCardBox")
    popupHistoryOrderCancelButton[0].addEventListener("click", ()=> {
        popupHistoryOrder[0].classList.add("none")
        dialogMask.classList.add("none")
        bookingCardBox[0].innerHTML = ""
    })
} 

/* 會員個人資料修改按鈕 */ 
let profileIsValidPhone = true

function memberProfileEditButton(){
    const editProfileButton = document.getElementsByClassName("editProfileButton")
    const sendProfileButton = document.getElementsByClassName("sendProfileButton")
    const resetProfileButton = document.getElementsByClassName("resetProfileButton")
    const profileEditInput = document.getElementsByClassName("profileEditInput")
    const passwordEditInput = document.getElementsByClassName("passwordEditInput")
    const memberProfile = document.getElementsByClassName("memberProfile")
    const phoneInput = document.querySelector("#memberPhone")
    const errorProfileMessage = document.getElementsByClassName("errorProfileMessage")
    let newPhone 
    editProfileButton[0].addEventListener("click", () => {
        editProfileButton[0].classList.add("none")
        sendProfileButton[0].classList.remove("none")
        resetProfileButton[0].classList.remove("none")
        /* 電話區碼下拉 */
        window.intlTelInput(phoneInput, {
        separateDialCode: true,
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        preferredCountries: ["tw", "sg"]
        });
        for(let i of profileEditInput){
            i.classList.remove("none")

        }
        for(let i of memberProfile){
            if(i.id !== "memberEmail"){
                i.classList.add("none")
            }
        }
        profileEditInput[0].value = memberName
        profileEditInput[1].value = memberNickName
        profileEditInput[2].value = memberBirthday
        profileEditInput[3].value = memberPhoneNumber
        profileEditInput[4].value = memberIntro
    })
    resetProfileButton[0].addEventListener("click", () => {
        profileEditInput[0].value = memberName
        profileEditInput[1].value = memberNickName
        profileEditInput[2].value = memberBirthday
        profileEditInput[3].value = memberPhoneNumber
        profileEditInput[4].value = memberIntro
    })
    sendProfileButton[0].addEventListener("click", function sendProfileButtonClick(){
        const newName = profileEditInput[0].value
        const newNickName = profileEditInput[1].value
        const newBirthday = profileEditInput[2].value
        newPhone = window.intlTelInputGlobals.getInstance(phoneInput).getNumber()
        const newIntro = profileEditInput[4].value
        if(!profileIsValidPhone){
            console.log("不可以傳")
            errorProfileMessage[0].classList.remove("none")
        }else{
            console.log(newName,newNickName,newBirthday,newPhone,newIntro)
            let fetchUpdateMemberProfile = updateMemberProfile(newName,newNickName,newBirthday,newPhone,newIntro)
            fetchUpdateMemberProfile.then(res =>{
                console.log(res)
                if(res[0] == "success"){
                    location.href = "/user"
                }else if(res[1] == "⚠ 請登入會員"){
                    location.href = "/"
                }else if(res[1] == "⚠ 請換發token"){
                    const fetchRefreshAccessToken = refreshAccessToken()
                    fetchRefreshAccessToken.then(res =>{
                        if(res == "error"){
                            location.href = "/"
                        }else{
                            sendProfileButtonClick()
                        }
                    })
                }
            })
        }
    })
    /* 監控手機格式 */
    phoneInput.addEventListener("input", () => {
        checkProfilePhoneInput()
    })

    function checkProfilePhoneInput(){
        const isValid = window.intlTelInputGlobals.getInstance(phoneInput).isValidNumber();
        newPhone = window.intlTelInputGlobals.getInstance(phoneInput).getNumber()
        if(newPhone == ""){
            console.log("2",newPhone)
            profileIsValidPhone = true
            errorProfileMessage[0].classList.add("none")
        }else if(!isValid){
            profileIsValidPhone = false
            errorProfileMessage[0].classList.remove("none")
        }else{
            profileIsValidPhone = true
            errorProfileMessage[0].classList.add("none")
        }
    }
}
