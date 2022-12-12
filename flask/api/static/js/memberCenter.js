/* 載入 */
window.addEventListener("DOMContentLoaded", () => {
    memberCenterButtonAddEvent()
    calendarAddEvent()
})

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


var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
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