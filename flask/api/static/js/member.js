import {register,login,logout,storeAccessToken,getAccessToken,deleteAccessToken} from "./sendDataToBackend.js"
const dialogMask = document.getElementById("dialogMask")
const loginButton = document.getElementById("loginButton")
const registerButton = document.getElementById("registerButton")
const loginBox = document.getElementById("loginBox")
const registerBox = document.getElementById("registerBox")
const goLoginButton = document.getElementById("goLoginButton")
const goRegisterButton = document.getElementById("goRegisterButton")
const goBackLoginButton = document.getElementById("goBackLoginButton")
const cancelButton = document.getElementsByClassName("cancelButton")
const logoutButton = document.getElementById("logoutButton")
const memberCenterButton = document.getElementById("memberCenterButton")
let memberName
let pathname = location.pathname

let bookingMessage = document.getElementById("bookingMessage")
let goBookingButton = document.getElementById("goBookingButton")

window.addEventListener("load", () => {
    checkLogin()
    checkLoginInput()
    checkRegisterInput()
})

export async function checkLogin(){
    console.log(pathname)
    try{
        let access_token = getAccessToken()
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization" : `Bearer ${access_token}`
        }
        let config = {
            method: "GET",
            headers: headers,
        }
        let response = await fetch("/api/user/auth",config)
        let fetchMemberData = await response.json()
        console.log("後端login回傳的資料",fetchMemberData)
        if(fetchMemberData["message"] == "⚠ 請換發token"){
            let fetchRefreshAccessToken = refreshAccessToken()
            fetchRefreshAccessToken.then(res =>{
                console.log(res)
                if(res == "error"){
                    logout()
                }else{
                    checkLogin()
                }
            })
        }
        if(response.status == 200){
            memberName = fetchMemberData["data"]["name"]
            dialogMask.classList.add("none")
            loginBox.classList.add("none")
            goLoginButton.classList.add("none")
            if(pathname.slice(0,12) == "/attraction/"){
                bookingMessage.classList.add("none")
            }
            if(pathname == "/user"){
                logoutButton.classList.remove("none")
            }else{
                memberCenterButton.classList.remove("none")
            }
        }else{
            goLoginButton.classList.remove("none")
            deleteAccessToken()
            console.log(fetchMemberData["message"])
            if(pathname == "/user"){
                logoutButton.classList.add("none")
            }else{
                memberCenterButton.classList.add("none")
            }
        }
    }
    catch(err){
        console.log("Something Wrong:",err)
    }
}
/* 會員登出按鈕  */
logoutButton.addEventListener("click",async() => {
    try{
        const fetchLogout = logout()
        fetchLogout.then(res => {
            if(res == "success"){
                logoutButton.classList.add("none")
                goLoginButton.classList.remove("none")
                deleteAccessToken()
                checkLogin()
                if(pathname == "/booking"){
                    location.href = "/booking"
                }   
            }else{
                console.log(res)
            }
        })
    }
    catch(err){
        console.log("Something Wrong:",err)
    }
})
/* 會員登入相關按鈕 */
goLoginButton.addEventListener("click",() => {
    goLogin()
})
goBackLoginButton.addEventListener("click",() => {
    goLogin()
})
function goLogin(){
    dialogMask.classList.remove("none")
    registerBox.classList.add("none")
    loginBox.classList.remove("none")
    clearInputValue()
    clearErrorMessage()
}

/* 會員註冊相關按鈕 */
goRegisterButton.addEventListener("click",() => {
    goRegister()
})
function goRegister(){
    dialogMask.classList.remove("none")
    loginBox.classList.add("none")
    registerBox.classList.remove("none")
    clearInputValue()
    clearErrorMessage()
}

/* 取消叉叉 */ 
cancelButton[0].addEventListener("click",() => {
    cancelLoginBox()
})
cancelButton[1].addEventListener("click",() => {
    cancelLoginBox()
})
function cancelLoginBox(){
    dialogMask.classList.add("none")
    loginBox.classList.add("none")
    registerBox.classList.add("none")
    // 清空input的值
    clearInputValue()
    // 禁用按鈕
    loginButton.style.cursor = "not-allowed"
    registerButton.style.cursor = "not-allowed"
    loginButton.setAttribute("disabled","")
    registerButton.setAttribute("disabled","")
    //清空提醒訊息
    clearErrorMessage()
}
let loginEmail = document.getElementById("loginEmail")
let loginPassword = document.getElementById("loginPassword")
let registerName = document.getElementById("registerName")
let registerEmail = document.getElementById("registerEmail")
let registerPassword = document.getElementById("registerPassword")
let errorMessage = document.getElementsByClassName("errorMessage")

/* 拿取登入輸入值 + 準備登入 */
let loginEmailInputValue 
let loginPasswordInputValue 
let registerNameInputValue 
let registerEmailInputValue 
let registerPasswordInputValue 
let isValidEmail
let isValidPassword

document.addEventListener("input", ()=>{
    checkLoginInput()
    checkRegisterInput()
})

loginButton.addEventListener("click",() => {
    // login api + 顯示登入結果
    let fetchLoginMessage = login(loginEmailInputValue,loginPasswordInputValue)
    fetchLoginMessage.then(res=>{
        console.log(res)
        if(res[1] == "⚠ 未註冊的信箱，或是輸入錯誤"){
            errorMessage[0].classList.remove("none")
            errorMessage[0].textContent = res[1]
            loginEmail.style.borderColor = "red"
            loginEmail.style.borderWidth = "2px"
            isValidEmail = false
            clearInputValue()
        }else if(res[1] == "⚠ 密碼輸入錯誤"){
            errorMessage[1].classList.remove("none")
            errorMessage[1].textContent = res[1]
            loginPassword.style.borderColor = "red"
            loginPassword.style.borderWidth = "2px"
            isValidPassword = false
            // 清空input的值
            if (loginPassword.value != "") {
                loginPassword.value = ""
            }
            loginPasswordInputValue = ""
        }else if(res[0] == "true"){
            checkLogin()
            // 清空input的值
            clearInputValue()
            if(pathname == "/booking"){
                location.href = "/booking"
            }
        }else{
            console.log(res[1])
        }
    })
})
/* checkLoginInput  */
function checkLoginInput(){
    loginEmail.addEventListener("input",() => {
        checkLoginEmailInput()
        loginEmailInputValue = loginEmail.value
    })
    loginPassword.addEventListener("input",() => {
        checkLoginPasswordInput()
        loginPasswordInputValue = loginPassword.value
    })
    if(isValidEmail && isValidPassword){
        loginButton.style.cursor = "pointer"
        loginButton.removeAttribute("disabled")
    }else{
        loginButton.style.cursor = "not-allowed"
        loginButton.setAttribute("disabled","")
    }
}
/* 拿取註冊輸入值 + 準備註冊 */
registerButton.addEventListener("click",() => {
    // login api
    let fetchRegisterMessage = register(registerNameInputValue,registerEmailInputValue,registerPasswordInputValue)

    fetchRegisterMessage.then(res=>{
        console.log(res)
        if(res[1] == "⚠ 信箱已被註冊"){
            errorMessage[2].classList.remove("none")
            errorMessage[2].textContent = res[1]
            registerEmail.style.borderColor = "red"
            registerEmail.style.borderWidth = "2px"
            isValidEmail = false
            clearInputValue()
        }else if(res[1] == "⚠ 信箱或密碼格式不正確"){
            errorMessage[3].classList.remove("none")
            errorMessage[3].textContent = res[1]
            errorMessage[3].style.color = "red"
            clearInputValue()
        }else if(res[0] == "true"){
            registerBox.classList.add("none")
            loginBox.classList.remove("none")
            errorMessage[1].classList.remove("none")
            errorMessage[1].textContent = "註冊成功，請登入"
            errorMessage[1].style.color = "blue"
            clearInputValue()
        }else{
            console.log(res[1])
            clearInputValue()
        }
    })
})
function checkRegisterInput(){
    registerName.addEventListener("input",() => {
        registerNameInputValue = registerName.value
    })
    
    registerEmail.addEventListener("input",() => {
        checkRegisterEmailInput()
        registerEmailInputValue = registerEmail.value
    })
    registerPassword.addEventListener("input",() => {
        checkRegisterPasswordInput()
        registerPasswordInputValue = registerPassword.value
    })
    if(isValidEmail && isValidPassword){
        registerEmail.style.borderColor = "#CCCCCC"
        registerEmail.style.borderWidth = "1px"
        registerButton.style.cursor = "pointer"
        registerButton.removeAttribute("disabled")
    }else{
        registerButton.style.cursor = "not-allowed"
        registerButton.setAttribute("disabled","")
    }
}


/* --- */
function checkLoginEmailInput(){
    isValidEmail = loginEmail.checkValidity()
    if(isValidEmail != true){
        errorMessage[0].classList.remove("none")
        errorMessage[0].textContent = "⚠ 信箱格式錯誤"
        loginEmail.style.borderColor = "#CCCCCC"
        loginEmail.style.borderWidth = "1px"
    }else{
        errorMessage[0].classList.add("none")
    }
}
function checkLoginPasswordInput(){
    isValidPassword = loginPassword.checkValidity()
    if(isValidPassword != true){
        errorMessage[1].classList.remove("none")
        errorMessage[1].textContent = "⚠ 密碼長度須介於5到10字元，禁止非法字元"
        loginPassword.style.borderColor = "#CCCCCC"
        loginPassword.style.borderWidth = "1px"
    }else{
        errorMessage[1].classList.add("none")
    }
}

function checkRegisterEmailInput(){
    isValidEmail = registerEmail.checkValidity()
    if(isValidEmail != true){
        errorMessage[2].classList.remove("none")
        errorMessage[2].textContent = "⚠ 信箱格式錯誤"
        registerEmail.style.borderColor = "#CCCCCC"
        registerEmail.style.borderWidth = "1px"
    }else{
        errorMessage[2].classList.add("none")
    }
}
function checkRegisterPasswordInput(){
    isValidPassword = registerPassword.checkValidity()
    if(isValidPassword != true){
        errorMessage[3].classList.remove("none")
        errorMessage[3].textContent = "⚠ 密碼長度須介於5到10字元，禁止非法字元"
        errorMessage[3].style.color = "red"
        registerPassword.style.borderColor = "#CCCCCC"
        registerPassword.style.borderWidth = "1px"

    }else{
        errorMessage[3].classList.add("none")
    }
}

/* 清空input值*/

function clearInputValue(){
    // 清空input的值
    loginPassword.value = ""
    loginEmail.value = ""
    registerName.value = ""
    registerEmail.value = ""
    registerPassword.value = ""

    // 清空值
    loginEmailInputValue = ""
    loginPasswordInputValue = ""
    registerNameInputValue = ""
    registerEmailInputValue = "" 
    registerPasswordInputValue = ""
    // 禁用按鈕
    loginButton.style.cursor = "not-allowed"
    registerButton.style.cursor = "not-allowed"
    loginButton.setAttribute("disabled","")
    registerButton.setAttribute("disabled","")
}

/* 清空提示訊息 + 按鈕disable判斷 */
function clearErrorMessage(){
    errorMessage[0].classList.add("none")
    errorMessage[1].classList.add("none")
    errorMessage[2].classList.add("none")
    errorMessage[3].classList.add("none")
    loginEmail.style.borderColor = "#CCCCCC"
    loginPassword.style.borderColor = "#CCCCCC"
    registerEmail.style.borderColor = "#CCCCCC"
    registerPassword.style.borderColor = "#CCCCCC"
    loginEmail.style.borderWidth = "1px"
    loginPassword.style.borderWidth = "1px"
    registerEmail.style.borderWidth = "1px"
    registerPassword.style.borderWidth = "1px"
    isValidEmail = false
    isValidPassword = false
}


/* 換發access_token */
export async function refreshAccessToken(){
    try{
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        let config = {
            method: "GET",
            headers: headers,
        }
        let response = await fetch("/api/refresh",config)
        if(response.status == 401){
            //以防refresh token過期
            //location.href = pathname
        }
        let refreshData = await response.json()
        console.log("後端refresh回傳的資料",refreshData)
        let access_token = refreshData["access_token"]
        if(refreshData["status"] == "success"){
            storeAccessToken(access_token)
            return "success"
        }else{
            const message = "⚠ 換發 Refresh Token 失敗"
            console.log(message)
            return "error"
        }
    }
    catch(err){
        console.log("Something Wrong:",err)
    }
}


