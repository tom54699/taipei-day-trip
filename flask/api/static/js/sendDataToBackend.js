

/* register */
export async function register(name,email,password){
    let res = []
    try{
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        let content = {
            "name": name,
            "email": email,
            "password": password
        }
        let config = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(content)
        }
        let response = await fetch("/api/user",config)
        let registerData = await response.json()
        console.log("後端login回傳的資料",registerData)
        if(registerData["ok"] == "true"){
            let status = registerData["ok"]
            let message = "註冊成功"
            res.push(status,message)
            return res
        }
        // 回傳資料如果status是error
        if(registerData["message"] == "⚠ 信箱已被註冊" || registerData["message"] == "⚠ 信箱或密碼格式不正確"){
            let errorMessage = registerData["message"]
            let status = registerData["status"]
            res.push(status,errorMessage)
            return res
        }else{
            let errorMessage = registerData["message"]
            let status = "error"
            res.push(status,errorMessage)
            return res
        }
    }
    catch(err){
        console.log("Something Wrong:",err)
        let errorMessage = err
        let status = "error"
        res.push(status,errorMessage)
        return res
    }
}


/* login */
export async function login(email,password){
    let res = []
    try{
        //let access_token = getAccessToken()
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            //"Authorization" : `Bearer ${access_token}`
        }
        let content = {
            "email": email,
            "password": password
        }
        let config = {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(content)
        }
        let response = await fetch("/api/user/auth",config)
        let loginData = await response.json()
        console.log("後端login回傳的資料",loginData)
        if(loginData["ok"] == "true"){
            storeAccessToken(loginData["access_token"])
            function clock(){
                window.setTimeout(( () => console.log("Token has expired") ), 60000)
            }
            clock()
            let status = loginData["ok"]
            let message = "登入成功"
            let name = loginData["name"]
            res.push(status,message,name)
            return res
        }
        // 回傳資料如果是信箱或密碼錯誤
        if(loginData["message"] == "⚠ 密碼輸入錯誤" || loginData["message"] == "⚠ 未註冊的信箱，或是輸入錯誤"){
            let errorMessage = loginData["message"]
            let status = loginData["status"]
            res.push(status,errorMessage)
            return res
        }else{
            let errorMessage = loginData["message"]
            let status = "error"
            res.push(status,errorMessage)
            return res
        }
    }
    catch(err){
        console.log("Something Wrong:",err)
        let errorMessage = err
        let status = "error"
        res.push(status,errorMessage)
        return res
    }
}






// 存放access_token到sessionStorage
function storeAccessToken(data){
    window.sessionStorage.setItem("access_token",data)
}
// 拿access_token到sessionStorage
function getAccessToken(){
    const access_token = window.sessionStorage.getItem("access_token")
    return access_token
}