// 首頁景點的架構

export function generateStructure(dataLength, fetchId) {
    // Node
    const attractionBoxNode = document.getElementsByClassName("attractionBox")
    const cardsNode = document.getElementsByClassName("cards")
    const cardsNameNode = document.getElementsByClassName("cardsName")
    const cardsInfoNode = document.getElementsByClassName("cardsInfo")
    const cardInfoNode = document.getElementsByClassName("cardInfo")
    // Generate Structure
    const cardsNodeLength = cardsNode.length
    for (let i = cardsNodeLength; i < cardsNodeLength + dataLength; i++) {
        const cards = document.createElement("a")
        cards.setAttribute("class", "cards")
        cards.setAttribute("href", `/attraction/${fetchId[i]}`)
        attractionBoxNode[0].appendChild(cards)

        const cardsImage = document.createElement("div")
        cardsImage.setAttribute("class", "cardsImage")
        cardsNode[i].appendChild(cardsImage)
        const cardsName = document.createElement("div")
        cardsName.setAttribute("class", "cardsName")
        cardsNode[i].appendChild(cardsName)
        const cardsInfo = document.createElement("div")
        cardsInfo.setAttribute("class", "cardsInfo")
        cardsNode[i].appendChild(cardsInfo)

        const cardName = document.createElement("div")
        cardName.setAttribute("class", "cardName")
        cardsNameNode[i].appendChild(cardName)
        const rectangle = document.createElement("div")
        rectangle.setAttribute("class", "rectangle")
        cardsNameNode[i].appendChild(rectangle)

        const cardInfo = document.createElement("div")
        cardInfo.setAttribute("class", "cardInfo")
        cardsInfoNode[i].appendChild(cardInfo)

        const cardMrt = document.createElement("div")
        cardMrt.setAttribute("class", "cardMrt")
        cardInfoNode[i].appendChild(cardMrt)
        const cardCategory = document.createElement("div")
        cardCategory.setAttribute("class", "cardCategory")
        cardInfoNode[i].appendChild(cardCategory)
    }
}

export function noPageGenerate() {
    const attractionMainBoxNode = document.getElementsByClassName("attractionMainBox")
    const noDataBox = document.createElement("img")
    //noDataBox.textContent = "查詢無相關資料"
    noDataBox.setAttribute("class", "noData")
    noDataBox.setAttribute("src", "/static/pic/404.png")
    attractionMainBoxNode[0].appendChild(noDataBox)
}

export function generateBookingPageStructure(dataLength) {
    const bookingCardBoxNode = document.getElementsByClassName("bookingCardBox")
    const bookingCardNode = document.getElementsByClassName("bookingCard")
    const attractionImageBoxNode = document.getElementsByClassName("attractionImageBox")
    const infoBoxNode = document.getElementsByClassName("infoBox")
    const bookingDateBoxNode = document.getElementsByClassName("bookingDateBox")
    const bookingTimeBoxNode = document.getElementsByClassName("bookingTimeBox")
    const bookingPriceBoxNode = document.getElementsByClassName("bookingPriceBox")
    const attractionAddressBoxNode = document.getElementsByClassName("attractionAddressBox")
    const bookingIdBoxNode = document.getElementsByClassName("bookingIdBox")

    for (let i = 0; i < dataLength; i++) {
        const bookingCard = document.createElement("article")
        bookingCard.setAttribute("class", "bookingCard")
        bookingCardBoxNode[0].appendChild(bookingCard)

        const deleteIcon = document.createElement("img")
        deleteIcon.setAttribute("class", "deleteIcon")
        deleteIcon.setAttribute("src", "/static/pic/icon_delete.png")
        bookingCardNode[i].appendChild(deleteIcon)

        const attractionImageBox = document.createElement("div")
        attractionImageBox.setAttribute("class", "attractionImageBox")
        bookingCardNode[i].appendChild(attractionImageBox)

        const attractionImage = document.createElement("img")
        attractionImage.setAttribute("class", "attractionImage")
        attractionImageBoxNode[i].appendChild(attractionImage)

        const infoBox = document.createElement("div")
        infoBox.setAttribute("class", "infoBox")
        bookingCardNode[i].appendChild(infoBox)

        const attractionName = document.createElement("div")
        attractionName.setAttribute("class", "attractionName")
        infoBoxNode[i].appendChild(attractionName)

        const bookingDateBox = document.createElement("div")
        bookingDateBox.setAttribute("class", "bookingDateBox")
        infoBoxNode[i].appendChild(bookingDateBox)

        const bookingDateTitle = document.createElement("div")
        bookingDateTitle.setAttribute("class", "bookingDateTitle")
        bookingDateTitle.textContent = "日期："
        bookingDateBoxNode[i].appendChild(bookingDateTitle)

        const bookingDate = document.createElement("div")
        bookingDate.setAttribute("class", "bookingDate")
        bookingDateBoxNode[i].appendChild(bookingDate)

        const bookingTimeBox = document.createElement("div")
        bookingTimeBox.setAttribute("class", "bookingTimeBox")
        infoBoxNode[i].appendChild(bookingTimeBox)

        const bookingTimeTitle = document.createElement("div")
        bookingTimeTitle.setAttribute("class", "bookingTimeTitle")
        bookingTimeTitle.textContent = "時間："
        bookingTimeBoxNode[i].appendChild(bookingTimeTitle)

        const bookingTime = document.createElement("div")
        bookingTime.setAttribute("class", "bookingTime")
        bookingTimeBoxNode[i].appendChild(bookingTime)

        const bookingPriceBox = document.createElement("div")
        bookingPriceBox.setAttribute("class", "bookingPriceBox")
        infoBoxNode[i].appendChild(bookingPriceBox)

        const bookingPriceTitle = document.createElement("div")
        bookingPriceTitle.setAttribute("class", "bookingPriceTitle")
        bookingPriceTitle.textContent = "費用："
        bookingPriceBoxNode[i].appendChild(bookingPriceTitle)

        const bookingPrice = document.createElement("div")
        bookingPrice.setAttribute("class", "bookingPrice")
        bookingPriceBoxNode[i].appendChild(bookingPrice)

        const attractionAddressBox = document.createElement("div")
        attractionAddressBox.setAttribute("class", "attractionAddressBox")
        infoBoxNode[i].appendChild(attractionAddressBox)

        const attractionAddressTitle = document.createElement("div")
        attractionAddressTitle.setAttribute("class", "attractionAddressTitle")
        attractionAddressTitle.textContent = "地點："
        attractionAddressBoxNode[i].appendChild(attractionAddressTitle)

        const attractionAddress = document.createElement("div")
        attractionAddress.setAttribute("class", "attractionAddress")
        attractionAddressBoxNode[i].appendChild(attractionAddress)

        const bookingIdBox = document.createElement("div")
        bookingIdBox.setAttribute("class", "bookingIdBox")
        infoBoxNode[i].appendChild(bookingIdBox)

        const bookingIdTitle = document.createElement("div")
        bookingIdTitle.setAttribute("class", "bookingIdTitle")
        bookingIdTitle.textContent = "訂單號碼："
        bookingIdBoxNode[i].appendChild(bookingIdTitle)

        const bookingId = document.createElement("div")
        bookingId.setAttribute("class", "bookingId")
        bookingIdBoxNode[i].appendChild(bookingId)
    }
}
