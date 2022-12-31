import {
    register,
    login,
    logout,
    storeAccessToken,
    getAccessToken,
    deleteAccessToken,
    confirmEmailForVerifyCode,
    checkVerifyCode,
} from "./fetchAPI.js"
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
const pathname = location.pathname

const bookingMessage = document.getElementById("bookingMessage")

window.addEventListener("load", () => {
    checkLogin()
    checkLoginInput()
    checkRegisterInput()
    forgerPasswordButton()
    goConfirmEmailButton()
})

export async function checkLogin() {
    try {
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
        const response = await fetch("/api/user/auth", config)
        const fetchMemberData = await response.json()
        if (fetchMemberData["message"] == "⚠ 請換發token") {
            const fetchRefreshAccessToken = refreshAccessToken()
            fetchRefreshAccessToken.then((res) => {
                if (res == "error") {
                    logout()
                } else {
                    checkLogin()
                }
            })
        } else if (response.status == 200) {
            memberName = fetchMemberData["data"]["name"]
            dialogMask.classList.add("none")
            loginBox.classList.add("none")
            goLoginButton.classList.add("none")
            if (pathname.slice(0, 12) == "/attraction/") {
                bookingMessage.classList.add("none")
            }
            if (pathname == "/user") {
                logoutButton.classList.remove("none")
            } else {
                memberCenterButton.classList.remove("none")
            }
        } else {
            goLoginButton.classList.remove("none")
            deleteAccessToken()
            if (pathname == "/user") {
                logoutButton.classList.add("none")
                location.href = "/"
            } else {
                memberCenterButton.classList.add("none")
            }
        }
    } catch (err) {
        console.log("Something Wrong:", err)
    }
}
/* 會員登出按鈕  */
logoutButton.addEventListener("click", async () => {
    try {
        const fetchLogout = logout()
        fetchLogout.then((res) => {
            if (res == "success") {
                logoutButton.classList.add("none")
                goLoginButton.classList.remove("none")
                deleteAccessToken()
                checkLogin()
                if (pathname == "/booking") {
                    location.href = "/booking"
                }
            } else {
                console.log(res)
            }
        })
    } catch (err) {
        console.log("Something Wrong:", err)
    }
})
/* 會員登入相關按鈕 */
goLoginButton.addEventListener("click", () => {
    goLogin()
})
goBackLoginButton.addEventListener("click", () => {
    goLogin()
})
function goLogin() {
    dialogMask.classList.remove("none")
    registerBox.classList.add("none")
    loginBox.classList.remove("none")
    clearInputValue()
    clearErrorMessage()
}

/* 會員註冊相關按鈕 */
goRegisterButton.addEventListener("click", () => {
    goRegister()
})
function goRegister() {
    dialogMask.classList.remove("none")
    loginBox.classList.add("none")
    registerBox.classList.remove("none")
    clearInputValue()
    clearErrorMessage()
}

/* 取消叉叉 */
cancelButton[0].addEventListener("click", () => {
    cancelLoginBox()
})
cancelButton[1].addEventListener("click", () => {
    cancelLoginBox()
})
function cancelLoginBox() {
    dialogMask.classList.add("none")
    loginBox.classList.add("none")
    registerBox.classList.add("none")
    findPasswordBox.classList.add("none")
    // 清空input的值
    clearInputValue()
    // 禁用按鈕
    loginButton.style.cursor = "not-allowed"
    registerButton.style.cursor = "not-allowed"
    loginButton.setAttribute("disabled", "")
    registerButton.setAttribute("disabled", "")
    //清空提醒訊息
    clearErrorMessage()
}
const loginEmail = document.getElementById("loginEmail")
const loginPassword = document.getElementById("loginPassword")
const registerName = document.getElementById("registerName")
const registerEmail = document.getElementById("registerEmail")
const registerPassword = document.getElementById("registerPassword")
const errorMessage = document.getElementsByClassName("errorMessage")

/* 拿取登入輸入值 + 準備登入 */
let loginEmailInputValue
let loginPasswordInputValue
let registerNameInputValue
let registerEmailInputValue
let registerPasswordInputValue
let isValidEmail
let isValidPassword

document.addEventListener("input", () => {
    checkLoginInput()
    checkRegisterInput()
    checkConfirmEmailButton()
})

loginButton.addEventListener("click", () => {
    // login api + 顯示登入結果
    const fetchLoginMessage = login(loginEmailInputValue, loginPasswordInputValue)
    fetchLoginMessage.then((res) => {
        if (res[1] == "⚠ 未註冊的信箱，或是輸入錯誤") {
            errorMessage[0].classList.remove("none")
            errorMessage[0].textContent = res[1]
            loginEmail.style.borderColor = "red"
            loginEmail.style.borderWidth = "2px"
            isValidEmail = false
            clearInputValue()
        } else if (res[1] == "⚠ 密碼輸入錯誤") {
            errorMessage[1].classList.remove("none")
            errorMessage[1].textContent = res[1]
            errorMessage[1].style.color = "red"
            loginPassword.style.borderColor = "red"
            loginPassword.style.borderWidth = "2px"
            isValidPassword = false
            // 清空input的值
            if (loginPassword.value != "") {
                loginPassword.value = ""
            }
            loginPasswordInputValue = ""
        } else if (res[0] == "true") {
            checkLogin()
            // 清空input的值
            clearInputValue()
            if (pathname == "/booking") {
                location.href = "/booking"
            }
        } else {
            console.log(res[1])
        }
    })
})
/* checkLoginInput  */
function checkLoginInput() {
    loginEmail.addEventListener("input", () => {
        checkLoginEmailInput()
        loginEmailInputValue = loginEmail.value
    })
    loginPassword.addEventListener("input", () => {
        checkLoginPasswordInput()
        loginPasswordInputValue = loginPassword.value
    })
    if (isValidEmail && isValidPassword) {
        loginButton.style.cursor = "pointer"
        loginButton.removeAttribute("disabled")
    } else {
        loginButton.style.cursor = "not-allowed"
        loginButton.setAttribute("disabled", "")
    }
}
/* 拿取註冊輸入值 + 準備註冊 */
registerButton.addEventListener("click", () => {
    // login api
    const fetchRegisterMessage = register(registerNameInputValue, registerEmailInputValue, registerPasswordInputValue)
    fetchRegisterMessage.then((res) => {
        if (res[1] == "⚠ 信箱已被註冊") {
            errorMessage[2].classList.remove("none")
            errorMessage[2].textContent = res[1]
            registerEmail.style.borderColor = "red"
            registerEmail.style.borderWidth = "2px"
            isValidEmail = false
            clearInputValue()
        } else if (res[1] == "⚠ 信箱或密碼格式不正確") {
            errorMessage[3].classList.remove("none")
            errorMessage[3].textContent = res[1]
            errorMessage[3].style.color = "red"
            clearInputValue()
        } else if (res[0] == "true") {
            registerBox.classList.add("none")
            loginBox.classList.remove("none")
            errorMessage[1].classList.remove("none")
            errorMessage[1].textContent = "註冊成功，請登入"
            errorMessage[1].style.color = "blue"
            clearInputValue()
        } else {
            console.log(res[1])
            clearInputValue()
        }
    })
})
function checkRegisterInput() {
    registerName.addEventListener("input", () => {
        registerNameInputValue = registerName.value
    })

    registerEmail.addEventListener("input", () => {
        checkRegisterEmailInput()
        registerEmailInputValue = registerEmail.value
    })
    registerPassword.addEventListener("input", () => {
        checkRegisterPasswordInput()
        registerPasswordInputValue = registerPassword.value
    })
    if (isValidEmail && isValidPassword) {
        registerEmail.style.borderColor = "#CCCCCC"
        registerEmail.style.borderWidth = "1px"
        registerButton.style.cursor = "pointer"
        registerButton.removeAttribute("disabled")
    } else {
        registerButton.style.cursor = "not-allowed"
        registerButton.setAttribute("disabled", "")
    }
}

/* --- */
function checkLoginEmailInput() {
    isValidEmail = loginEmail.checkValidity()
    if (isValidEmail != true) {
        errorMessage[0].classList.remove("none")
        errorMessage[0].textContent = "⚠ 信箱格式錯誤"
        loginEmail.style.borderColor = "#CCCCCC"
        loginEmail.style.borderWidth = "1px"
    } else {
        errorMessage[0].classList.add("none")
    }
}
function checkLoginPasswordInput() {
    isValidPassword = loginPassword.checkValidity()
    if (isValidPassword != true) {
        errorMessage[1].classList.remove("none")
        errorMessage[1].textContent = "⚠ 密碼長度須介於5到10字元，禁止非法字元"
        errorMessage[1].style.color = "red"
        loginPassword.style.borderColor = "#CCCCCC"
        loginPassword.style.borderWidth = "1px"
    } else {
        errorMessage[1].classList.add("none")
    }
}

function checkRegisterEmailInput() {
    isValidEmail = registerEmail.checkValidity()
    if (isValidEmail != true) {
        errorMessage[2].classList.remove("none")
        errorMessage[2].textContent = "⚠ 信箱格式錯誤"
        registerEmail.style.borderColor = "#CCCCCC"
        registerEmail.style.borderWidth = "1px"
    } else {
        errorMessage[2].classList.add("none")
    }
}
function checkRegisterPasswordInput() {
    isValidPassword = registerPassword.checkValidity()
    if (isValidPassword != true) {
        errorMessage[3].classList.remove("none")
        errorMessage[3].textContent = "⚠ 密碼長度須介於5到10字元，禁止非法字元"
        errorMessage[3].style.color = "red"
        registerPassword.style.borderColor = "#CCCCCC"
        registerPassword.style.borderWidth = "1px"
    } else {
        errorMessage[3].classList.add("none")
    }
}

/* 清空input值*/

function clearInputValue() {
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
    loginButton.setAttribute("disabled", "")
    registerButton.setAttribute("disabled", "")
}

/* 清空提示訊息 + 按鈕disable判斷 */
function clearErrorMessage() {
    errorMessage[0].classList.add("none")
    errorMessage[1].classList.add("none")
    errorMessage[2].classList.add("none")
    errorMessage[3].classList.add("none")
    errorMessage[4].classList.add("none")
    errorMessage[5].classList.add("none")
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
    isValidConfirmEmail = false
}

/* 換發access_token */
export async function refreshAccessToken() {
    try {
        const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
        }
        const config = {
            method: "GET",
            headers: headers,
        }
        const response = await fetch("/api/refresh", config)
        if (response.status == 401) {
            //以防refresh token過期
            //location.href = pathname
        }
        const refreshData = await response.json()
        const access_token = refreshData["access_token"]
        if (refreshData["status"] == "success") {
            storeAccessToken(access_token)
            return "success"
        } else {
            const message = "⚠ 換發 Refresh Token 失敗"
            console.log(message)
            return "error"
        }
    } catch (err) {
        console.log("Something Wrong:", err)
    }
}

/* 預定行程按鈕 */
const goBookingNavButton = document.getElementById("goBookingNavButton")
goBookingNavButton.addEventListener("click", async () => {
    try {
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
        const response = await fetch("/api/user/auth", config)
        const fetchMemberData = await response.json()
        if (fetchMemberData["message"] == "⚠ 請換發token") {
            const fetchRefreshAccessToken = refreshAccessToken()
            fetchRefreshAccessToken.then((res) => {
                if (res == "error") {
                    logout()
                } else {
                    checkLogin()
                }
            })
        } else if (response.status == 200) {
            location.href = "/booking"
        } else {
            goLoginButton.classList.remove("none")
            dialogMask.classList.remove("none")
            loginBox.classList.remove("none")
            deleteAccessToken()
        }
    } catch (err) {
        console.log("Something Wrong:", err)
    }
})
const findPasswordBox = document.getElementById("findPasswordBox")
/* 忘記密碼+取消找回密碼頁面按鈕 */
function forgerPasswordButton() {
    const findPasswordButton = document.getElementById("findPasswordButton")
    const confirmEmailButton = document.getElementById("confirmEmailButton")
    const verifyCode = document.getElementById("verifyCode")
    const verifyButton = document.getElementById("verifyButton")
    findPasswordButton.addEventListener("click", () => {
        loginBox.classList.add("none")
        findPasswordBox.classList.remove("none")
        confirmEmailButton.textContent = "確認信箱"
        confirmEmailButton.setAttribute("disabled", true)
        confirmEmailButton.style.cursor = "not-allowed"
        confirmEmail.removeAttribute("readonly")
        verifyButton.setAttribute("disabled", true)
        verifyButton.style.cursor = "not-allowed"
        clearInputValue()
        clearErrorMessage()
        cancelButton[2].addEventListener("click", () => {
            cancelLoginBox()
            confirmEmail.value = ""
            verifyCode.value = ""
        })
    })
}

let isValidConfirmEmail = false
const confirmEmail = document.getElementById("confirmEmail")
function checkIsValidConfirmEmail() {
    isValidConfirmEmail = confirmEmail.checkValidity()
    if (!isValidConfirmEmail || confirmEmail.value == "") {
        isValidConfirmEmail = false
        errorMessage[4].classList.remove("none")
        errorMessage[4].textContent = "⚠ 信箱格式錯誤"
    } else {
        isValidConfirmEmail = true
        errorMessage[4].classList.add("none")
    }
}
confirmEmail.addEventListener("input", () => {
    checkIsValidConfirmEmail()
})

function checkConfirmEmailButton() {
    const confirmEmailButton = document.getElementById("confirmEmailButton")
    if (isValidConfirmEmail) {
        confirmEmailButton.removeAttribute("disabled")
        confirmEmailButton.style.cursor = "pointer"
    } else {
        confirmEmailButton.setAttribute("disabled", "")
        confirmEmailButton.style.cursor = "not-allowed"
    }
}
function goConfirmEmailButton() {
    const confirmEmailButton = document.getElementById("confirmEmailButton")
    const verifyButton = document.getElementById("verifyButton")
    confirmEmailButton.addEventListener("click", () => {
        const confirmEmailValue = confirmEmail.value
        const fetchConfirmEmailForVerifyCode = confirmEmailForVerifyCode(confirmEmailValue)
        fetchConfirmEmailForVerifyCode.then((res) => {
            if (res[0] == "success") {
                errorMessage[4].classList.remove("none")
                errorMessage[4].textContent = "✉ 請去信箱收取驗證碼"
                verifyButton.removeAttribute("disabled")
                verifyButton.style.cursor = "pointer"
                confirmEmail.setAttribute("readonly", true)
                confirmEmailButton.textContent = "再傳送一次驗證碼"
                check_verify_code_button()
            } else if (res["message"] == "⚠ 這組信箱沒有註冊過") {
                errorMessage[4].classList.remove("none")
                errorMessage[4].textContent = "⚠ 這組信箱沒有註冊過"
            }
        })
    })
}

/* 確認驗證碼按鈕 */
function check_verify_code_button() {
    const verifyCode = document.getElementById("verifyCode")
    const getBackupPasswordBox = document.getElementById("getBackupPasswordBox")
    const findPasswordBox = document.getElementById("findPasswordBox")
    const getBackupPassword = document.getElementById("getBackupPassword")
    verifyButton.addEventListener("click", () => {
        const confirmEmailValue = confirmEmail.value
        const verifyCodeValue = verifyCode.value
        const fetchCheckVerifyCode = checkVerifyCode(confirmEmailValue, verifyCodeValue)
        fetchCheckVerifyCode.then((res) => {
            if (res["ok"] == "true") {
                errorMessage[5].classList.add("none")
                findPasswordBox.classList.add("none")
                getBackupPasswordBox.classList.remove("none")
                getBackupPassword.value = res["data"]
                errorMessage[6].classList.remove("none")
            } else if (res["message"] == "⚠ 驗證碼錯誤") {
                errorMessage[5].classList.remove("none")
                errorMessage[5].textContent = "⚠ 驗證碼錯誤"
            }
        })
    })
}

/* 取得新密碼頁面按鈕 */
const getBackupPasswordBox = document.getElementById("getBackupPasswordBox")
const returnLoginButton = document.getElementById("returnLoginButton")
cancelButton[3].addEventListener("click", () => {
    getBackupPasswordBox.classList.add("none")
    dialogMask.classList.add("none")
    errorMessage[6].classList.add("none")
})
returnLoginButton.addEventListener("click", () => {
    getBackupPasswordBox.classList.add("none")
    errorMessage[6].classList.add("none")
    loginBox.classList.remove("none")
})
