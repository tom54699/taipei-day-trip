// fetch 景點資料


export async function fetchAttractionPageData(page=0,keyword=""){
    try{
        const response = await fetch(`https://taipeitrip.hopto.org/api/attractions?page=${page}&keyword=${keyword}`);
        let data = await response.json()
        return data
    }
    catch(err){
        console.log("fetch failed:",err)
    }
}

export async function fetchCategoryData(page=0,keyword=""){
    try{
        const response = await fetch("https://taipeitrip.hopto.org/api/categories");
        let data = await response.json()
        return data
    }
    catch(err){
        console.log("fetch failed:",err)
    }
}


