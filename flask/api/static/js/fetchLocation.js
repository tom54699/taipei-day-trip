// fetch 景點資料


export async function fetchAttractionPageData(page=0,keyword=""){
    try{
        const response = await fetch(`https://taipeidaytrip.ddns.net/api/attractions?page=${page}&keyword=${keyword}`);
        let data = await response.json()
        return data
    }
    catch(err){
        console.log("fetch failed:",err)
    }
}

export async function fetchCategoryData(page=0,keyword=""){
    try{
        const response = await fetch("https://taipeidaytrip.ddns.net/api/categories");
        let data = await response.json()
        return data
    }
    catch(err){
        console.log("fetch failed:",err)
    }
}


export async function fetchAttraction(id=1){
    try{
        const response = await fetch(`https://taipeidaytrip.ddns.net/api/attraction/${id}`);
        let data = await response.json()
        return data
    }
    catch(err){
        console.log("fetch failed:",err)
    }
}


