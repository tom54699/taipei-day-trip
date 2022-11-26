import {generateStructure,noPageGenerate} from "./generatePages.js"
import {fetchAttractionPageData} from "./fetchLocation.js"
import {generateCategories} from "./inputQuery.js"

let isLoading = false
let nextPage 
let keyword 
let fetchName = []
let fetchMrt = []
let fetchCategories = []
let fetchImg = []
let fetchId = []

export async function generateAttractions(page = 0,keyword=""){
    isLoading = true
    await fetchAttractionPageData(page,keyword).then(data=>{
        // 定義拿到的資料
        console.log(data)
        let data_length=Number(data["data"].length)
        if(data["nextPage"] == null){
            nextPage = null
        }else{
            nextPage = Number(data["nextPage"])+1
        }
        let startId = Number(page)*12
        let endId = startId+data_length
     
        for(let i=0;i<data_length;i++){
            let newFetchId = data["data"][i]["id"]
            fetchId.push(newFetchId)
            let newFetchName = data["data"][i]["name"]
            fetchName.push(newFetchName)
            let newFetchMrt = data["data"][i]["mrt"]
            fetchMrt.push(newFetchMrt)
            let newFetchCategories = data["data"][i]["category"]
            fetchCategories.push(newFetchCategories)
            let newFetchImg = data["data"][i]["images"][0]
            fetchImg.push(newFetchImg)
        }

        // 準備產生畫面

        // 畫面結構
        generateStructure(data_length,fetchId)
        // 註冊
        let picNode=document.getElementsByClassName("cardsImage")
        let nameNode=document.getElementsByClassName("cardName")
        let mrtNode=document.getElementsByClassName("cardMrt")
        let categoryNode=document.getElementsByClassName("cardCategory")
        // 建立後面12張
        for(let i=startId;i<endId;i++){
            let image=document.createElement("img")
            let name=document.createElement("div")
            let mrt=document.createElement("div")
            let category=document.createElement("div")

            image.setAttribute("src",`${fetchImg[i]}`)
            name.textContent=fetchName[i]
            mrt.textContent=fetchMrt[i]
            category.textContent=fetchCategories[i]
            picNode[i].appendChild(image)
            nameNode[i].appendChild(name)
            mrtNode[i].appendChild(mrt)
            categoryNode[i].appendChild(category)
        }
        // 清空input的值
        if (cardCategoryInput.value != "") {
            cardCategoryInput.value = "";
        }
        isLoading = false
    })
    return nextPage
}
let queryAttractionInput
// 首次載入
window.addEventListener("DOMContentLoaded",async(e) => {
    observer.observe(scroll)
    await generateAttractions(nextPage)
    await generateCategories()
    // 景點分類名稱填入搜尋框
    let category=document.getElementsByClassName("category");
    let cardCategoryInput=document.getElementById("cardCategoryInput"); 
    for(let i =0; i<category.length; i++){
        category[i].addEventListener("mousedown", async(e) => {
            cardCategoryInput.value = category[i].textContent
            queryAttractionInput = cardCategoryInput.value
        })
    }
})


// 輸入關鍵字
cardCategoryInput.addEventListener("input", e => {
    console.log(e.target.value.trim() === "")
    if(e.target.value.trim() === ""){
        queryAttractionInput = undefined
    }else{
        queryAttractionInput = e.target.value  
    }
})


// 按下搜尋按鈕
let sloganBtn = document.getElementById("sloganBtn");
sloganBtn.addEventListener("click", async() => {
    keyword = queryAttractionInput
    fetchName = []
    fetchMrt = []
    fetchCategories = []
    fetchImg = []
    fetchId = []
    // 把畫面清空
    let attractionMainBoxNode=document.getElementsByClassName("attractionMainBox")
    attractionMainBoxNode[0].innerHTML = ""
    if(keyword == undefined){
        noPageGenerate()
    }else{
        await fetchAttractionPageData(0,keyword).then(data=>{
            if(data["data"].length == 0){
                noPageGenerate()
            }else{
                let attractionBox = document.createElement("section")
                attractionBox.setAttribute("class","attractionBox")
                attractionMainBoxNode[0].appendChild(attractionBox)
                generateAttractions(0,keyword)
            }
        })
    }
})


// 卷軸滾動判斷
let scroll = document.getElementById("footer")
let callback = async function ([obj]) {
    if(obj.isIntersecting){
        console.log(isLoading)
        if(isLoading == false){
            nextPage = await generateAttractions(nextPage,keyword)
        }
        if(nextPage == null){
            // 輸入值刪除
            keyword = ""
        }
    }
};
let observer = new IntersectionObserver(callback, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
});

