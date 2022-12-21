import {generateStructure,noPageGenerate} from "./generatePages.js"
import {fetchAttractionPageData,fetchCategoryData} from "./fetchAPI.js"


let isLoading = false
let nextPage 
let keyword 
let fetchName = []
let fetchMrt = []
let fetchCategories = []
let fetchImg = []
let fetchId = []

export const generateAttractions = async (page = 0,keyword="") => {
    isLoading = true
    await fetchAttractionPageData(page,keyword).then(data=>{
        // 定義拿到的資料
        const dataLength = Number(data.data.length)

        if(data["nextPage"] == null){
            nextPage = null
        }else{
            nextPage = Number(data["nextPage"])+1
        }
        const startId = Number(page)*12
        const endId = startId + dataLength
     
        for (const item of data.data) {
            fetchId.push(item.id);
            fetchName.push(item.name);
            fetchMrt.push(item.mrt);
            fetchCategories.push(item.category);
            fetchImg.push(item.images[0]);
        }
        // 畫面結構
        generateStructure(dataLength,fetchId)
        // 註冊
        const picNode = document.getElementsByClassName("cardsImage")
        const nameNode = document.getElementsByClassName("cardName")
        const mrtNode = document.getElementsByClassName("cardMrt")
        const categoryNode = document.getElementsByClassName("cardCategory")
        // 建立後面12張
        for(let i = startId;i<endId;i++){
            const image = document.createElement("img")
            const name = document.createElement("div")
            const mrt = document.createElement("div")
            const category = document.createElement("div")

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

// 取得景點分類
export async function generateCategories(){
    const categories = []
    await fetchCategoryData().then(data=>{
        for(let i of data.data){
            categories.push(i)
        }
        // 建立畫面
        for(let i in data.data){
        const categoriesListNode = document.getElementsByClassName("categoriesList")
        const categoryBoxNode = document.getElementsByClassName("category")
        const category = document.createElement("div")
        let categoryBox = document.createElement("div")
        categoryBox.setAttribute("class","category")
        categoriesListNode[0].appendChild(categoryBox)
        category.textContent = categories[i]
        categoryBoxNode[i].appendChild(category)
        }
    })
}
let queryAttractionInput
// 首次載入
window.addEventListener("DOMContentLoaded",async(e) => {
    observer.observe(scroll)
    await generateAttractions(nextPage)
    await generateCategories()
    // 景點分類名稱填入搜尋框
    const category=document.getElementsByClassName("category");
    const cardCategoryInput=document.getElementById("cardCategoryInput"); 
    for(let i of category){
        i.addEventListener("mousedown", async(e) => {
            cardCategoryInput.value = i.textContent
            queryAttractionInput = cardCategoryInput.value
        })
    }
})


// 輸入關鍵字
cardCategoryInput.addEventListener("input", e => {
    if(e.target.value.trim() === ""){
        queryAttractionInput = undefined
    }else{
        queryAttractionInput = e.target.value  
    }
})


// 按下搜尋按鈕
const sloganBtn = document.getElementById("sloganBtn");
sloganBtn.addEventListener("click", async() => {
    keyword = queryAttractionInput
    fetchName = []
    fetchMrt = []
    fetchCategories = []
    fetchImg = []
    fetchId = []
    // 把畫面清空
    const attractionMainBoxNode=document.getElementsByClassName("attractionMainBox")
    attractionMainBoxNode[0].innerHTML = ""
    if(keyword == undefined){
        noPageGenerate()
    }else{
        await fetchAttractionPageData(0,keyword).then(data=>{
            if(data["data"].length == 0){
                noPageGenerate()
            }else{
                const attractionBox = document.createElement("section")
                attractionBox.setAttribute("class","attractionBox")
                attractionMainBoxNode[0].appendChild(attractionBox)
                generateAttractions(0,keyword)
            }
        })
    }
})


// 卷軸滾動判斷
const scroll = document.getElementById("footer")
const callback = async function ([obj]) {
    if(obj.isIntersecting){
        if(isLoading == false){
            nextPage = await generateAttractions(nextPage,keyword)
        }
        if(nextPage == null){
            // 輸入值刪除
            keyword = ""
        }
    }
};
const observer = new IntersectionObserver(callback, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
});
