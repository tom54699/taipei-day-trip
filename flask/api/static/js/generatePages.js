// 首頁景點的架構

export function generateStructure(data_length,fetchId){
    // Node
    let attractionBoxNode=document.getElementsByClassName("attractionBox")
    let cardsNode = document.getElementsByClassName("cards")
    let cardsNameNode = document.getElementsByClassName("cardsName")
    let cardsInfoNode = document.getElementsByClassName("cardsInfo")
    let cardInfoNode = document.getElementsByClassName("cardInfo")
    // Generate Structure
    let cardsNodeLength = cardsNode.length
    for(let i=cardsNodeLength;i<cardsNodeLength+data_length;i++){
        let cards = document.createElement("a")
        cards.setAttribute("class","cards")
        cards.setAttribute("href",`/attraction/${fetchId[i]}`)
        attractionBoxNode[0].appendChild(cards)

        let cardsImage=document.createElement("div")
        cardsImage.setAttribute("class","cardsImage")
        cardsNode[i].appendChild(cardsImage)
        let cardsName = document.createElement("div")
        cardsName.setAttribute("class","cardsName")
        cardsNode[i].appendChild(cardsName)
        let cardsInfo = document.createElement("div")
        cardsInfo.setAttribute("class","cardsInfo")
        cardsNode[i].appendChild(cardsInfo)


        let cardName = document.createElement("div")
        cardName.setAttribute("class","cardName")
        cardsNameNode[i].appendChild(cardName)
        let rectangle = document.createElement("div")
        rectangle.setAttribute("class","rectangle")
        cardsNameNode[i].appendChild(rectangle)

        let cardInfo = document.createElement("div")
        cardInfo.setAttribute("class","cardInfo")
        cardsInfoNode[i].appendChild(cardInfo)

        let cardMrt = document.createElement("div")
        cardMrt.setAttribute("class","cardMrt")
        cardInfoNode[i].appendChild(cardMrt)
        let cardCategory = document.createElement("div")
        cardCategory.setAttribute("class","cardCategory")
        cardInfoNode[i].appendChild(cardCategory)
    }
}

export function noPageGenerate(){
    let attractionMainBoxNode=document.getElementsByClassName("attractionMainBox")
    let noDataBox = document.createElement("img")
    //noDataBox.textContent = "查詢無相關資料"
    noDataBox.setAttribute("class","noData")
    noDataBox.setAttribute("src","/static/pic/404.png")
    attractionMainBoxNode[0].appendChild(noDataBox)
}
