import {getMemberCenterData} from "./sendDataToBackend.js"
import {refreshAccessToken} from "./member.js"
let memberName
let memberNickName
let memberEmail
let memberPassword
let memberBirthday
let memberPhoneNumber
let memberCountry
const booking_lists = []
const order_lists= []

/* 載入 */
window.addEventListener("DOMContentLoaded", () => {
    checkMemberCenterAuth()
    memberCenterButtonAddEvent()
    calendarAddEvent()
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
            memberCountry = memberCenterData.member.country
            for(let data of memberCenterData.bookings){
                booking_lists.push(data)
            }
            for(let data of memberCenterData.orders){
                order_lists.push(data)
            }
            // 產生畫面
            memberDateShow()
            memberHistoryOrderShow(order_lists)
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
/* Calendar */
function calendarAddEvent(){
    const calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: "zh-tw",
        navLinks: true,
        headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "listWeek timeGridDay,timeGridWeek,dayGridMonth"
        },
        eventClick: function(info) {
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
        },
        events: [
        {
            title: "實驗",
            start: "2022-12-12T14:00:00",
            end: "2022-12-12T16:00:00",
            display: "block"
        },
        {
            title: "實驗1",
            start: "2022-12-13",
            allDay: false,
            display: "block",
            url: "/booking"
        }
        ],
        
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

/* 折線圖 */

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: '平均半年旅遊次數',
            data: [0, 1, 3, 5, 2, 1, 2],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
        }]
    },
});


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
    const memberEmailNode = document.getElementById("memberEmail")
    const memberNameNode = document.getElementById("memberName")
    const memberNickNameNode = document.getElementById("memberNickName")
    const memberBirthdayNode = document.getElementById("memberBirthday")
    const memberPhoneNumberNode = document.getElementById("memberPhoneNumber")
    const memberCountryNode = document.getElementById("memberCountry")

    memberEmailNode.textContent = memberEmail
    memberNameNode.textContent = memberName
    if(memberNickName === null){
        memberNickNameNode.textContent = "(空)"
    }else{
        memberNickNameNode.textContent = memberNickName
    }
    if(memberBirthday === null){
        memberBirthdayNode.textContent = "(空)"
    }else{
        memberBirthdayNode.textContent = memberBirthday
    }
    if(memberPhoneNumber === null){
        memberPhoneNumberNode.textContent = "(空)"
    }else{
        memberPhoneNumberNode.textContent = memberPhoneNumber
    }
    if(memberCountry === null){
        memberCountryNode.textContent = "(空)"
    }else{
        memberCountryNode.textContent = memberCountry
    }
}