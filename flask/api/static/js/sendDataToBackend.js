
import { refreshAccessToken } from "./member.js"

/* register */
export async function register(name,email,password){
    let res = []
    try{
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        const content = {
            "name": name,
            "email": email,
            "password": password
        }
        const config = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(content)
        }
        const response = await fetch("/api/user",config)
        const registerData = await response.json()
        console.log("後端login回傳的資料",registerData)
        if(registerData["ok"] == "true"){
            const status = registerData["ok"]
            const message = "註冊成功"
            res.push(status,message)
            return res
        }
        // 回傳資料如果status是error
        if(registerData["message"] == "⚠ 信箱已被註冊" || registerData["message"] == "⚠ 信箱或密碼格式不正確"){
            const errorMessage = registerData["message"]
            const status = registerData["status"]
            res.push(status,errorMessage)
            return res
        }else{
            const errorMessage = registerData["message"]
            const status = "error"
            res.push(status,errorMessage)
            return res
        }
    }
    catch(err){
        console.log("Something Wrong:",err)
        const errorMessage = err
        const status = "error"
        res.push(status,errorMessage)
        return res
    }
}


/* login */
export async function login(email,password){
    let res = []
    try{
        //let access_token = getAccessToken()
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            //"Authorization" : `Bearer ${access_token}`
        }
        const content = {
            "email": email,
            "password": password
        }
        const config = {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(content)
        }
        const response = await fetch("/api/user/auth",config)
        const loginData = await response.json()
        console.log("後端login回傳的資料",loginData)
        if(loginData["ok"] == "true"){
            storeAccessToken(loginData["access_token"])
            setInterval(( () => console.log("Token has expired") ), 60000)
            const status = loginData["ok"]
            const message = "登入成功"
            res.push(status,message)
            return res
        }
        // 回傳資料如果是信箱或密碼錯誤
        if(loginData["message"] == "⚠ 密碼輸入錯誤" || loginData["message"] == "⚠ 未註冊的信箱，或是輸入錯誤"){
            const errorMessage = loginData["message"]
            const status = loginData["status"]
            res.push(status,errorMessage)
            return res
        }else{
            const errorMessage = loginData["message"]
            const status = "error"
            res.push(status,errorMessage)
            return res
        }
    }
    catch(err){
        console.log("Something Wrong:",err)
        const errorMessage = err
        const status = "error"
        res.push(status,errorMessage)
        return res
    }
}


/* logout */
export async function logout(){
    try{
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        const config = {
            method: "DELETE",
            headers: headers,
        }
        const response = await fetch("/api/user/auth",config)
        const deleteData = await response.json()
        console.log("後端login回傳的資料",deleteData)
        if(deleteData["ok"] == "true"){
            return "success"
        }else{
            console.log(deleteData["message"])
            return "error"
        }
    }
    catch(err){
        console.log("Something Wrong:",err)
        const errorMessage = err
        const status = "error"
        res.push(status,errorMessage)
        return res
    }
}



// 存放access_token到sessionStorage
export function storeAccessToken(data){
    window.sessionStorage.setItem("access_token",data)
}
// 拿access_token到sessionStorage
export function getAccessToken(){
    const access_token = window.sessionStorage.getItem("access_token")
    return access_token
}
// 刪除access_token
export function deleteAccessToken(){
    window.sessionStorage.removeItem("access_token")
}

/* 儲存景點精料 */
export async function sendBookingData(attractionId,date,time,price){
    let res = []
    const access_token = getAccessToken()
    try{
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization" : `Bearer ${access_token}`
        }
        const content = {
            "attractionId": attractionId,
            "date": date,
            "time": time,
            "price": price
        }
        const config = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(content)
        }
        const response = await fetch("/api/booking",config)
        const getBookingData = await response.json()
        console.log("後端getBookingData回傳的資料",getBookingData)
        if(getBookingData["ok"] == "true"){
            const status = "ok"
            const message = "預約成功 ☛"
            res.push(status,message)
            return res
        }
        // 回傳Error
        if(getBookingData["error"] == "true"){
            const errorMessage = getBookingData["message"]
            const status = "error"
            res.push(status,errorMessage)
            return res
        }
    }
    catch(err){
        console.log("Something Wrong:",err)
        const errorMessage = err
        const status = "error"
        res.push(status,errorMessage)
        return res
    }
}

/* 拿景點資料 */
export async function getBookingData(){
    let res = []
    const access_token = getAccessToken()
    try{
        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization" : `Bearer ${access_token}`
        }
        const config = {
            method: "GET",
            headers: headers,
        }
        const response = await fetch("/api/booking",config)
        const getBookingData = await response.json()
        console.log("後端getBookingData回傳的資料",getBookingData)
        if(getBookingData["message"] == "⚠ 請換發token"){
            const status = "error"
            const message = "⚠ 請換發token"
            res.push(status, message)
            return res
        }else if(getBookingData["message"] == "⚠ 請登入會員"){
            const status = "error"
            const message = "⚠ 請登入會員"
            res.push(status, message)
            return res
        }else{
            const status = "success"
            res.push(status,getBookingData)
            return res
        }
    }
    catch(err){
        console.log("Something Wrong:",err)
        const errorMessage = err
        const status = "error"
        res.push(status,errorMessage)
        return res
    }
}
