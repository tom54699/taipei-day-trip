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

export function generateBookingPageStructure(data_length){
    const bookingCardBoxNode = document.getElementsByClassName("bookingCardBox")
    const bookingCardNode = document.getElementsByClassName("bookingCard")
    const attractionImageBoxNode = document.getElementsByClassName("attractionImageBox")
    const infoBoxNode = document.getElementsByClassName("infoBox")
    const bookingDateBoxNode = document.getElementsByClassName("bookingDateBox")
    const bookingTimeBoxNode = document.getElementsByClassName("bookingTimeBox")
    const bookingPriceBoxNode = document.getElementsByClassName("bookingPriceBox")
    const attractionAddressBoxNode = document.getElementsByClassName("attractionAddressBox")
    const bookingIdBoxNode = document.getElementsByClassName("bookingIdBox")

    for(let i=0; i<data_length; i++){
        let bookingCard = document.createElement("article")
        bookingCard.setAttribute("class","bookingCard")
        bookingCardBoxNode[0].appendChild(bookingCard)

        let deleteIcon = document.createElement("img")
        deleteIcon.setAttribute("class","deleteIcon")
        deleteIcon.setAttribute("src","/static/pic/icon_delete.png")
        bookingCardNode[i].appendChild(deleteIcon)
    
        let attractionImageBox = document.createElement("div")
        attractionImageBox.setAttribute("class","attractionImageBox")
        bookingCardNode[i].appendChild(attractionImageBox)

        let attractionImage = document.createElement("img")
        attractionImage.setAttribute("class","attractionImage")
        attractionImageBoxNode[i].appendChild(attractionImage)

        let infoBox = document.createElement("div")
        infoBox.setAttribute("class","infoBox")
        bookingCardNode[i].appendChild(infoBox)

        let attractionName = document.createElement("div")
        attractionName.setAttribute("class","attractionName")
        infoBoxNode[i].appendChild(attractionName)

        let bookingDateBox = document.createElement("div")
        bookingDateBox.setAttribute("class","bookingDateBox")
        infoBoxNode[i].appendChild(bookingDateBox)

        let bookingDateTitle = document.createElement("div")
        bookingDateTitle.setAttribute("class","bookingDateTitle")
        bookingDateTitle.textContent = "日期："
        bookingDateBoxNode[i].appendChild(bookingDateTitle)

        let bookingDate = document.createElement("div")
        bookingDate.setAttribute("class","bookingDate")
        bookingDateBoxNode[i].appendChild(bookingDate)
        
        let bookingTimeBox = document.createElement("div")
        bookingTimeBox.setAttribute("class","bookingTimeBox")
        infoBoxNode[i].appendChild(bookingTimeBox)

        let bookingTimeTitle = document.createElement("div")
        bookingTimeTitle.setAttribute("class","bookingTimeTitle")
        bookingTimeTitle.textContent = "時間："
        bookingTimeBoxNode[i].appendChild(bookingTimeTitle)

        let bookingTime = document.createElement("div")
        bookingTime.setAttribute("class","bookingTime")
        bookingTimeBoxNode[i].appendChild(bookingTime)

        let bookingPriceBox = document.createElement("div")
        bookingPriceBox.setAttribute("class","bookingPriceBox")
        infoBoxNode[i].appendChild(bookingPriceBox)

        let bookingPriceTitle = document.createElement("div")
        bookingPriceTitle.setAttribute("class","bookingPriceTitle")
        bookingPriceTitle.textContent = "費用："
        bookingPriceBoxNode[i].appendChild(bookingPriceTitle)

        let bookingPrice = document.createElement("div")
        bookingPrice.setAttribute("class","bookingPrice")
        bookingPriceBoxNode[i].appendChild(bookingPrice)

        let attractionAddressBox = document.createElement("div")
        attractionAddressBox.setAttribute("class","attractionAddressBox")
        infoBoxNode[i].appendChild(attractionAddressBox)

        let attractionAddressTitle = document.createElement("div")
        attractionAddressTitle.setAttribute("class","attractionAddressTitle")
        attractionAddressTitle.textContent = "地點："
        attractionAddressBoxNode[i].appendChild(attractionAddressTitle)

        let attractionAddress = document.createElement("div")
        attractionAddress.setAttribute("class","attractionAddress")
        attractionAddressBoxNode[i].appendChild(attractionAddress)

        let bookingIdBox = document.createElement("div")
        bookingIdBox.setAttribute("class","bookingIdBox")
        infoBoxNode[i].appendChild(bookingIdBox)

        let bookingIdTitle = document.createElement("div")
        bookingIdTitle.setAttribute("class","bookingIdTitle")
        bookingIdTitle.textContent = "訂單號碼："
        bookingIdBoxNode[i].appendChild(bookingIdTitle)

        let bookingId = document.createElement("div")
        bookingId.setAttribute("class","bookingId")
        bookingIdBoxNode[i].appendChild(bookingId)

    }
}
