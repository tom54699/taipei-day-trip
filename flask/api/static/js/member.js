import {register,login} from "./sendDataToBackend.js"

let dialogMask = document.getElementById("dialogMask")
let loginButton = document.getElementById("loginButton")
let registerButton = document.getElementById("registerButton")
let loginBox = document.getElementById("loginBox")
let registerBox = document.getElementById("registerBox")
let goLoginButton = document.getElementById("goLoginButton")
let goRegisterButton = document.getElementById("goRegisterButton")
let goBackLoginButton = document.getElementById("goBackLoginButton")
let cancelButton = document.getElementsByClassName("cancelButton")
let logoutButton = document.getElementById("logoutButton")
let isLogin = false;

window.addEventListener("load", () => {
    checkLogin()
    checkLoginInput()
    checkRegisterInput()
})

async function checkLogin(){
    try{
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        let config = {
            method: "GET",
            headers: headers,
        }
        let response = await fetch("/api/member",config)
        let getMemberData = await response.json()
        console.log("後端login回傳的資料",getMemberData)
        if(getMemberData["status"] == "success"){
            dialogMask.classList.add("none")
            loginBox.classList.add("none")
            logoutButton.classList.remove("none")
            goLoginButton.classList.add("none")
            isLogin = true
        }else{
            console.log(getMemberData["message"])
            isLogin = false
        }
    }
    catch(err){
        console.log("Something Wrong:",err)
    }
}
/* 會員登出按鈕  */
logoutButton.addEventListener("click",async() => {
    try{
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        let config = {
            method: "DELETE",
            headers: headers,
        }
        let response = await fetch("/api/member",config)
        let deleteData = await response.json()
        console.log("後端login回傳的資料",deleteData)
        if(deleteData["status"] == "success"){
            logoutButton.classList.add("none")
            goLoginButton.classList.remove("none")
            isLogin = true
        }else{
            console.log(deleteData["message"])
            isLogin = false
        }
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
}

/* 會員註冊相關按鈕 */
goRegisterButton.addEventListener("click",() => {
    goRegister()
})
function goRegister(){
    dialogMask.classList.remove("none")
    loginBox.classList.add("none")
    registerBox.classList.remove("none")
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
        if(res[0] == "noAccount"){
            errorMessage[0].classList.remove("none")
            errorMessage[0].textContent = res[1]
            loginEmail.style.borderColor = "red"
            loginEmail.style.borderWidth = "2px"
            clearInputValue()
        }else if(res[0] == "wrongPassword"){
            errorMessage[1].classList.remove("none")
            errorMessage[1].textContent = res[1]
            loginPassword.style.borderColor = "red"
            loginPassword.style.borderWidth = "2px"
            // 清空input的值
            if (loginPassword.value != "") {
                loginPassword.value = ""
            }
            loginPasswordInputValue = ""
        }else if(res[0] == "success"){
            checkLogin()
            // 清空input的值
            clearInputValue()
        }else{
            console.log(res[1])
        }
    })
})
/* checkLoginInput  */
function checkLoginInput(){
    console.log("執行")
    loginEmail.addEventListener("input",() => {
        console.log("執行1")
        checkLoginEmailInput()
        loginEmailInputValue = loginEmail.value
    })
    loginPassword.addEventListener("input",() => {
        console.log("執行2")
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
    // 清空input的值
    if (registerName.value != "" && registerEmail.value != "" && registerPassword.value != "") {
        registerName.value = ""
        registerEmail.value = ""
        registerPassword.value = ""
    }
    // login api
    let fetchRegisterMessage = register(registerNameInputValue,registerEmailInputValue,registerPasswordInputValue)

    fetchRegisterMessage.then(res=>{
        console.log(res)
        if(res[0] == "emailDuplicate"){
            errorMessage[2].classList.remove("none")
            errorMessage[2].textContent = res[1]
            registerEmail.style.borderColor = "red"
            registerEmail.style.borderWidth = "2px"
        }else if(res[0] == "success"){
            console.log(res[1])
            errorMessage[3].classList.remove("none")
            errorMessage[3].textContent = "註冊成功，請返回登入"
            errorMessage[3].style.color = "blue"
        }else{
            console.log(res[1])
        }
    })

    // 清空值
    registerNameInputValue = ""
    registerEmailInputValue = "" 
    registerPasswordInputValue = ""
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
    console.log(isValidEmail)
    if(isValidEmail != true){
        errorMessage[0].classList.remove("none")
        errorMessage[0].textContent = "⚠ 信箱格式錯誤"
        loginEmail.style.borderColor = "black"
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
        loginPassword.style.borderColor = "black"
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
        registerEmail.style.borderColor = "black"
    }else{
        errorMessage[2].classList.add("none")
    }
}
function checkRegisterPasswordInput(){
    isValidPassword = registerPassword.checkValidity()
    if(isValidPassword != true){
        errorMessage[3].classList.remove("none")
    }else{
        errorMessage[3].classList.add("none")
    }
}

/* 清空input值*/

function clearInputValue(){
    // 清空input的值
    if (loginEmail.value != "" && loginPassword.value != "") {
        loginPassword.value = ""
        loginEmail.value = ""
    }
    if (registerName.value != "" && registerEmail.value != "" && registerPassword.value != "") {
        registerName.value = ""
        registerEmail.value = ""
        registerPassword.value = ""
    }
    // 清空值
    loginEmailInputValue = ""
    loginPasswordInputValue = ""
    registerNameInputValue = ""
    registerEmailInputValue = "" 
    registerPasswordInputValue = ""
}