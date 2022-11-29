

/* register */
export async function register(name,email,password){
    let res = []
    try{
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        let content = {
            "status": "success",
            "registerName": name,
            "registerEmail": email,
            "registerPassword": password
        }
        let config = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(content)
        }
        let response = await fetch("/api/member",config)
        let registerData = await response.json()
        console.log("後端login回傳的資料",registerData)
        // 回傳資料如果status是error
        if(registerData["status"] == "emailDuplicate"){
            let errorMessage = registerData["message"]
            let status = registerData["status"]
            res.push(status,errorMessage)
            return res
        }
        if(registerData["status"] == "success"){
            let status = registerData["status"]
            let message = "註冊成功"
            res.push(status,message)
            return res
        }
        if(loginData["status"] == "error"){
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
            "status": "success",
            "loginEmail": email,
            "loginPassword": password
        }
        let config = {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(content)
        }
        let response = await fetch("/api/member",config)
        let loginData = await response.json()
        console.log("後端login回傳的資料",loginData)
        // 回傳資料如果是信箱或密碼錯誤
        if(loginData["status"] == "wrongPassword" || loginData["status"] == "noAccount"){
            let errorMessage = loginData["message"]
            let status = loginData["status"]
            res.push(status,errorMessage)
            return res
        }
        if(loginData["status"] == "success"){
            storeAccessToken(loginData["access_token"])
            function clock(){
                window.setTimeout(( () => console.log("Token has expired") ), 60000)
            }
            clock()
            let status = loginData["status"]
            let message = "登入成功"
            let name = loginData["name"]
            res.push(status,message,name)
            return res
        }
        if(loginData["status"] == "error"){
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