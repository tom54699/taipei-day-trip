import {fetchCategoryData} from "./fetchLocation.js"



// 取得景點分類

export async function generateCategories(){
    let categories = []
    await fetchCategoryData().then(data=>{
        let data_length=Number(data["data"].length)
        for(let i=0;i<data_length;i++){
            let newFetchCategories = data["data"][i]
            categories.push(newFetchCategories)
        }
        // 建立結構
        let categoriesListNode = document.getElementsByClassName("categoriesList")
        for(let i=0;i<data_length;i++){
        let categoryBox = document.createElement("div")
        categoryBox.setAttribute("class","category")
        categoriesListNode[0].appendChild(categoryBox)
        }
        // 建立畫面
        for(let i=0;i<data_length;i++){
        let categoryBoxNode = document.getElementsByClassName("category")
        let category = document.createElement("div")
        category.textContent = categories[i]
        categoryBoxNode[i].appendChild(category)
        }
    })
}


