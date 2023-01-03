import { sendBookingData, logout, fetchAttraction } from "./fetchAPI.js"
import { refreshAccessToken, checkLogin } from "./member.js"

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
export async function generateAttraction(id) {
    await fetchAttraction(id).then((data) => {
        /* Get Data */

        imageLength = data.data.images.length
        for (let i of data.data.images) {
            fetchImg.push(i)
        }
        fetchId = data.data.id
        fetchName = data.data.name
        fetchMrt = data.data.mrt
        fetchCategories = data.data.category
        fetchDescription = data.data.description
        fetchAddress = data.data.address
        fetchTransport = data.data.transport
        titleChange()

        /* Define Node */
        const dotBoxNode = document.getElementsByClassName("dotBox")
        const attractionNameNode = document.getElementsByClassName("attractionName")
        const attractionImgBoxNode = document.getElementsByClassName("attractionImgBox")
        const attractionCategoryNode = document.getElementsByClassName("attractionCategory")
        const attractionDescriptionNode = document.getElementsByClassName("attractionDescription")
        const attractionAddressNode = document.getElementsByClassName("attractionAddress")
        const attractionTransportNode = document.getElementsByClassName("attractionTransport")
        const googleMap = document.getElementById("googleMap")
        const loadingBox = document.getElementsByClassName("loadingBox")
        const loadingNumber = document.getElementsByClassName("loadingNumber")
        /* Add Data To Node */
        attractionNameNode[0].textContent = fetchName
        attractionCategoryNode[0].textContent = `${fetchCategories} at ${fetchMrt}`
        attractionDescriptionNode[0].textContent = fetchDescription
        attractionAddressNode[0].textContent = fetchAddress
        attractionTransportNode[0].textContent = fetchTransport
        googleMap.src = `https://maps.google.com.tw/maps?f=q&hl=zh-TW&geocode=&q=${fetchAddress}&z=16&output=embed&t=`
        const images = []
        let imageCounter = 0
        let imageLoadPercentage = 0
        for (let i in fetchImg) {
            const image = new Image()
            images.push(image)
        }
        for (let i = 0; i < imageLength; i++) {
            attractionImgBoxNode[0].appendChild(images[i])
            images[i].onload = () => {
                if (images[i].complete) {
                    imageCounter++
                    imageLoadPercentage = Math.round((imageCounter / imageLength) * 100)
                    loadingNumber[0].textContent = `${imageLoadPercentage} %`
                }
                if (imageCounter == imageLength) {
                    loadingBox[0].classList.add("none")
                }
            }
            images[i].setAttribute("src", `${fetchImg[i]}`)
            images[i].setAttribute("class", "attractionImg fade")
            if (i != 0) {
                images[i].setAttribute("class", "attractionImg fade none")
            }
        }
        /* Add Dot*/
        for (let i = 0; i < imageLength; i++) {
            const dot = document.createElement("section")
            dot.setAttribute("class", "dot")
            dotBoxNode[0].appendChild(dot)
        }
    })
}

/* Check if Strings ends with Number */
function endsWithNumber(str) {
    return /[0-9]+$/.test(str)
}

function getNumberAtEnd(str) {
    if (endsWithNumber(str)) {
        return Number(str.match(/[0-9]+$/)[0])
    }
    return null
}

/* First Loaded */
window.addEventListener("DOMContentLoaded", async () => {
    const pathname = location.pathname
    const attractionId = getNumberAtEnd(pathname)
    await generateAttraction(attractionId)
    imgId = 0
    dot[imgId].style.backgroundImage = "url(/static/pic/circle_current.png)"
})

/* Img Button */
const leftArrow = document.getElementById("leftArrow")
const rightArrow = document.getElementById("rightArrow")
const dot = document.getElementsByClassName("dot")

rightArrow.addEventListener("click", () => {
    const attractionImg = document.getElementsByClassName("attractionImg")
    imgId = imgId + 1
    if (imgId >= imageLength) {
        imgId = 0
    }
    if (imgId == 0) {
        dot[imageLength - 1].style.backgroundImage = "url(/static/pic/circle.png)"
        dot[imgId].style.backgroundImage = "url(/static/pic/circle_current.png)"
        attractionImg[imageLength - 1].classList.add("none")
        attractionImg[imgId].classList.remove("none")
    } else {
        dot[imgId - 1].style.backgroundImage = "url(/static/pic/circle.png)"
        dot[imgId].style.backgroundImage = "url(/static/pic/circle_current.png)"
        attractionImg[imgId - 1].classList.add("none")
        attractionImg[imgId].classList.remove("none")
    }
})

leftArrow.addEventListener("click", () => {
    const attractionImg = document.getElementsByClassName("attractionImg")
    imgId = imgId - 1
    if (imgId < 0) {
        imgId = imageLength - 1
    }
    if (imgId == imageLength - 1) {
        dot[0].style.backgroundImage = "url(/static/pic/circle.png)"
        dot[imgId].style.backgroundImage = "url(/static/pic/circle_current.png)"
        attractionImg[0].classList.add("none")
        attractionImg[imgId].classList.remove("none")
    } else {
        dot[imgId + 1].style.backgroundImage = "url(/static/pic/circle.png)"
        dot[imgId].style.backgroundImage = "url(/static/pic/circle_current.png)"
        attractionImg[imgId + 1].classList.add("none")
        attractionImg[imgId].classList.remove("none")
    }
})

/* 上下半天按鈕切換 */
const morning = document.getElementById("morning")
const afternoon = document.getElementById("afternoon")
const tourFee = document.getElementById("tourFee")

morning.addEventListener("click", () => {
    checkTourTime()
})
afternoon.addEventListener("click", () => {
    checkTourTime()
})

function checkTourTime() {
    if (morning.checked == true) {
        tourFee.textContent = "新台幣 2000 元"
    } else if (afternoon.checked == true) {
        tourFee.textContent = "新台幣 2500 元"
    }
}

/* 預設 INPUT DATE */
const bookingDate = document.getElementById("bookingDate")
function setNowDate() {
    const today = new Date()
    bookingDate.value = today.toISOString().substr(0, 10)
    const year = today.getFullYear() + 1
    const month = ("0" + (today.getMonth() + 1)).slice(-2)
    const date = ("0" + today.getDate()).slice(-2)
    const time = `${year}-${month}-${date}`
    const tomorrow = `${year - 1}-${month}-${Number(date) + 1}`
    bookingDate.setAttribute("max", time)
    bookingDate.setAttribute("min", tomorrow)
}

/* 開始預約行程按鈕 */
const bookingAttractionButton = document.getElementById("bookingAttractionButton")
const bookingMessage = document.getElementById("bookingMessage")
const goBookingButton = document.getElementById("goBookingButton")
bookingAttractionButton.addEventListener("click", async function enterBookingPage() {
    /* 抓取填寫的資料 */
    const date = String(bookingDate.value)
    let time
    let price
    if (morning.checked == true) {
        time = "morning"
        price = 2000
    } else if (afternoon.checked == true) {
        time = "afternoon"
        price = 2500
    }
    const fetchSendBookingData = sendBookingData(fetchId, date, time, price)

    fetchSendBookingData.then((res) => {
        if (res[0] == "ok") {
            bookingMessage.textContent = res[1]
            bookingMessage.classList.remove("none")
            // 倒數自動跳轉
            goBookingButton.textContent = "3 ...自動跳轉中"
            let number = 3
            const timeout1 = setInterval(() => {
                number--
                goBookingButton.textContent = number + " ...自動跳轉中"
                if (number <= 0) {
                    goBookingButton.textContent = "準備付款"
                    clearInterval(timeout1)
                }
            }, 1000)
            setTimeout("location.href = '/booking'", 3500)
            goBookingButton.classList.remove("none")
        } else if (res[0] == "error") {
            if (res[1] == "⚠ 請登入會員") {
                bookingMessage.textContent = res[1]
                bookingMessage.classList.remove("none")
                goBookingButton.classList.add("none")
                checkLogin()
            }
            if (res[1] == "⚠ 請換發token") {
                bookingMessage.textContent = res[1]
                bookingMessage.classList.remove("none")
                goBookingButton.classList.add("none")
                const fetchRefreshAccessToken = refreshAccessToken()
                fetchRefreshAccessToken.then((res) => {
                    if (res == "error") {
                        bookingMessage.textContent = "⚠ 發生異常，請重新登入"
                        logout()
                        checkLogin()
                    } else {
                        enterBookingPage()
                    }
                })
            }
            if (res[1] == "⚠ 已在這個時段預約行程") {
                bookingMessage.textContent = res[1]
                bookingMessage.classList.remove("none")
                goBookingButton.classList.add("none")
            }
        } else {
            bookingMessage.textContent = "⚠ 未知原因失敗"
            bookingMessage.classList.remove("none")
        }
    })
})

/* title動態變化 */
function titleChange() {
    document.title = `Taipei Trip 台北一日遊 | ${fetchName}`
}
