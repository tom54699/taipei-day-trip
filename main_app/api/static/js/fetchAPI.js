// fetch 景點資料
export async function fetchAttractionPageData(page = 0, keyword = "") {
    try {
        const response = await fetch(`/api/attractions?page=${page}&keyword=${keyword}`)
        const data = await response.json()
        return data
    } catch (err) {
        console.log("fetch failed:", err)
    }
}

export async function fetchCategoryData() {
    try {
        const response = await fetch("/api/categories")
        const data = await response.json()
        return data
    } catch (err) {
        console.log("fetch failed:", err)
    }
}

export async function fetchAttraction(id = 1) {
    try {
        const response = await fetch(`/api/attraction/${id}`)
        let data = await response.json()
        return data
    } catch (err) {
        console.log("fetch failed:", err)
    }
}

/* register */
export async function register(name, email, password) {
    try {
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
        }
        const content = {
            name,
            email,
            password,
        }
        const config = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(content),
        }
        const response = await fetch("/api/user", config)
        const { ok, message, status } = await response.json()
        if (ok == "true") {
            return ["true", "註冊成功"]
        }
        // 回傳資料如果status是error
        if (message === "⚠ 信箱已被註冊" || message === "⚠ 信箱或密碼格式不正確") {
            return [status, message]
        } else {
            return ["error", message]
        }
    } catch (err) {
        console.log("Something Wrong:", err)
        return ["error", err]
    }
}

/* login */
export async function login(email, password) {
    let res = []
    try {
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
        }
        const content = {
            email,
            password,
        }
        const config = {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(content),
        }
        const response = await fetch("/api/user/auth", config)
        const loginData = await response.json()
        if (loginData["ok"] == "true") {
            storeAccessToken(loginData["access_token"])
            const status = loginData["ok"]
            const message = "登入成功"
            res.push(status, message)
            return res
        }
        // 回傳資料如果是信箱或密碼錯誤
        if (loginData["message"] == "⚠ 密碼輸入錯誤" || loginData["message"] == "⚠ 未註冊的信箱，或是輸入錯誤") {
            const errorMessage = loginData["message"]
            const status = loginData["status"]
            res.push(status, errorMessage)
            return res
        } else {
            const errorMessage = loginData["message"]
            const status = "error"
            res.push(status, errorMessage)
            return res
        }
    } catch (err) {
        console.log("Something Wrong:", err)
    }
}
/* logout */
export async function logout() {
    try {
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
        }
        const config = {
            method: "DELETE",
            headers: headers,
        }
        const response = await fetch("/api/user/auth", config)
        const deleteData = await response.json()
        if (deleteData["ok"] == "true") {
            return "success"
        } else {
            console.log(deleteData["message"])
            return "error"
        }
    } catch (err) {
        console.log("Something Wrong:", err)
    }
}

// 存放access_token到localStorage
export function storeAccessToken(data) {
    window.localStorage.setItem("access_token", data)
}
// 拿access_token到localStorage
export function getAccessToken() {
    const access_token = window.localStorage.getItem("access_token")
    return access_token
}
// 刪除access_token
export function deleteAccessToken() {
    window.localStorage.removeItem("access_token")
}

/* 儲存景點精料 */
export async function sendBookingData(attractionId, date, time, price) {
    let res = []
    const access_token = getAccessToken()
    try {
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
        }
        const content = {
            attractionId,
            date,
            time,
            price,
        }
        const config = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(content),
        }
        const response = await fetch("/api/booking", config)
        const getBookingData = await response.json()
        if (getBookingData["ok"] == "true") {
            const status = "ok"
            const message = "預約成功 ☛"
            res.push(status, message)
            return res
        }
        // 回傳Error
        if (getBookingData["error"] == "true") {
            const errorMessage = getBookingData["message"]
            const status = "error"
            res.push(status, errorMessage)
            return res
        }
    } catch (err) {
        console.log("Something Wrong:", err)
    }
}

/* 拿景點資料 */
export async function getBookingData() {
    const res = []
    const access_token = getAccessToken()
    try {
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
        }
        const config = {
            method: "GET",
            headers: headers,
        }
        const response = await fetch("/api/booking", config)
        const getBookingData = await response.json()
        if (response.status == 200) {
            const status = "success"
            res.push(status, getBookingData)
            return res
        } else if (getBookingData["message"] == "⚠ 請換發token") {
            const status = "error"
            const message = "⚠ 請換發token"
            res.push(status, message)
            return res
        } else if (getBookingData["message"] == "⚠ 請登入會員") {
            const status = "error"
            const message = "⚠ 請登入會員"
            res.push(status, message)
            return res
        } else {
            const status = "error"
            res.push(status, getBookingData)
            return res
        }
    } catch (err) {
        console.log("Something Wrong:", err)
    }
}

/* 傳送訂單資訊 order api*/
export async function sendOrderData(orderContent) {
    let res = []
    const access_token = getAccessToken()
    try {
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
        }
        const content = orderContent
        const config = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(content),
        }
        const response = await fetch("/api/orders", config)
        const sendOrderData = await response.json()
        if (response.status == 200) {
            const status = "success"
            res.push(status, sendOrderData)
            return res
        } else if (sendOrderData["message"] == "⚠ 請換發token") {
            const status = "error"
            const message = "⚠ 請換發token"
            res.push(status, message)
            return res
        } else if (sendOrderData["message"] == "⚠ 請登入會員") {
            const status = "error"
            const message = "⚠ 請登入會員"
            res.push(status, message)
            return res
        } else if (sendOrderData["message"] == "⚠ 信箱或密碼格式不正確") {
            const status = "error"
            const message = "⚠ 信箱或密碼格式不正確"
            res.push(status, message)
            return res
        } else if (sendOrderData["message"] == "⚠ 請勿重複付款") {
            const status = "error"
            const message = "⚠ 請勿重複付款"
            res.push(status, message)
            return res
        } else {
            const status = "error"
            res.push(status, sendOrderData["message"])
            return res
        }
    } catch (err) {
        console.log("Something Wrong:", err)
    }
}

/* GET Member Center INFORMATION */
export async function getMemberCenterData() {
    try {
        const res = []
        const access_token = getAccessToken()
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
        }
        const config = {
            method: "GET",
            headers: headers,
        }
        const response = await fetch("/api/user/membercenter", config)
        const fetchMemberData = await response.json()
        if (response.status == 200) {
            const status = "success"
            res.push(status, fetchMemberData)
            return res
        }
        if (fetchMemberData["message"] == "⚠ 請換發token") {
            const status = "error"
            const message = "⚠ 請換發token"
            res.push(status, message)
            return res
        } else if (fetchMemberData["message"] == "⚠ 請登入會員") {
            const status = "error"
            const message = "⚠ 請登入會員"
            res.push(status, message)
            return res
        } else {
            const status = "error"
            res.push(status, fetchMemberData)
            return res
        }
    } catch (err) {
        console.log("Something Wrong:", err)
    }
}

/* GET Order Data By Order Number */
export async function getOrderDataByOrderNumber(orderNumber) {
    try {
        const res = []
        const access_token = getAccessToken()
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
        }
        const config = {
            method: "GET",
            headers: headers,
        }
        const response = await fetch(`api/orders/${orderNumber}`, config)
        const fetchOrderDataByOrderNumber = await response.json()
        if (response.status == 200) {
            const status = "success"
            res.push(status, fetchOrderDataByOrderNumber)
            return res
        }
        if (fetchOrderDataByOrderNumber["message"] == "⚠ 請換發token") {
            const status = "error"
            const message = "⚠ 請換發token"
            res.push(status, message)
            return res
        } else if (fetchOrderDataByOrderNumber["message"] == "⚠ 請登入會員") {
            const status = "error"
            const message = "⚠ 請登入會員"
            res.push(status, message)
            return res
        } else {
            const status = "error"
            res.push(status, fetchOrderDataByOrderNumber)
            return res
        }
    } catch (err) {
        console.log("Something Wrong:", err)
    }
}

/* 呼叫會員資料更新api */
export async function updateMemberProfile(newName, newNickName, newBirthday, newPhone, newIntro) {
    let res = []
    try {
        const access_token = getAccessToken()
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
        }
        const content = {
            name: newName,
            nick_name: newNickName,
            birthday: newBirthday,
            phone_number: newPhone,
            intro: newIntro,
        }
        const config = {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(content),
        }
        const response = await fetch("/api/user/profile", config)
        const fetchUpdateMemberProfile = await response.json()
        if (response.status == 200) {
            const status = "success"
            res.push(status, fetchUpdateMemberProfile)
            return res
        }
        if (fetchUpdateMemberProfile["message"] == "⚠ 請換發token") {
            const status = "error"
            const message = "⚠ 請換發token"
            res.push(status, message)
            return res
        } else if (fetchUpdateMemberProfile["message"] == "⚠ 請登入會員") {
            const status = "error"
            const message = "⚠ 請登入會員"
            res.push(status, message)
            return res
        } else {
            const status = "error"
            res.push(status, fetchUpdateMemberProfile)
            return res
        }
    } catch (err) {
        console.log("Something Wrong:", err)
    }
}

/* 呼叫會員密碼更新api */
export async function updateMemberPassword(old_password, new_password, check_password) {
    let res = []
    try {
        const access_token = getAccessToken()
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
        }
        const content = {
            old_password,
            new_password,
            check_password,
        }
        const config = {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(content),
        }
        const response = await fetch("api/user/password", config)
        const fetchUpdateMemberProfile = await response.json()
        if (response.status == 200) {
            const status = "success"
            res.push(status, fetchUpdateMemberProfile)
            return res
        }
        if (fetchUpdateMemberProfile["message"] == "⚠ 請換發token") {
            const status = "error"
            const message = "⚠ 請換發token"
            res.push(status, message)
            return res
        } else if (fetchUpdateMemberProfile["message"] == "⚠ 請登入會員") {
            const status = "error"
            const message = "⚠ 請登入會員"
            res.push(status, message)
            return res
        } else {
            const status = "error"
            res.push(status, fetchUpdateMemberProfile["message"])
            return res
        }
    } catch (err) {
        console.log("Something Wrong:", err)
    }
}
/* 發驗證碼到信箱 */
export async function confirmEmailForVerifyCode(confirmEmail) {
    try {
        const res = []
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
        }
        const content = {
            confirm_email: confirmEmail,
        }
        const config = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(content),
        }
        const response = await fetch("/api/user/verifycode", config)
        const fetchConfirmEmailForVerifyCode = await response.json()
        if (response.status == 200) {
            const status = "success"
            res.push(status, fetchConfirmEmailForVerifyCode)
            return res
        } else {
            return fetchConfirmEmailForVerifyCode
        }
    } catch (err) {
        console.log("Something Wrong:", err)
    }
}

/* 驗證碼確認正確與否 */
export async function checkVerifyCode(confirmEmail, verifyCode) {
    try {
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
        }
        const content = {
            confirm_email: confirmEmail,
            verify_code: verifyCode,
        }
        const config = {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(content),
        }
        const response = await fetch("/api/user/verifycode", config)
        const fetchConfirmEmailForVerifyCode = await response.json()
        return fetchConfirmEmailForVerifyCode
    } catch (err) {
        console.log("Something Wrong:", err)
    }
}

/* S3 get 大頭貼 */
export async function getMemberHeadShot() {
    try {
        const access_token = getAccessToken()
        const headers = {
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
        }
        const config = {
            method: "GET",
            headers: headers,
        }
        const response = await fetch("api/user/headshot", config)
        const fetchGetMemberHeadShot = await response.json()
        return fetchGetMemberHeadShot
    } catch (err) {
        console.log("Something Wrong:", err)
    }
}

export async function putMemberHeadShot(image, imageType) {
    try {
        const access_token = getAccessToken()
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
        }
        const content = {
            image_type: imageType,
            headshot: Array.from(new Uint8Array(image)),
        }
        const config = {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(content),
        }
        const response = await fetch("api/user/headshot", config)
        const fetchGetMemberHeadShot = await response.json()
        return fetchGetMemberHeadShot
    } catch (err) {
        console.log("Something Wrong:", err)
    }
}
