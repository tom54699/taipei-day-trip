/* TapPay */

TPDirect.setupSDK(125973, "app_C8T0HTSdPJL2xPPmlQVSltkz992p9Jd6aPsL6k1Lj5Ao7Fyw7iTu2ZUH9fHe", "sandbox")

/* ----------------------------- */
let fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'CCV'
    }
}
TPDirect.card.setup({
    // Display ccv field
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            //5'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            'font-size': '16px'
        },
        // style focus state
        ':focus': {
            'color': '#448899'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'red'
            }
        }
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
})

/* 輸入聯絡欄位格式錯誤 */
const contactName= document.getElementById("contactName")
const contactEmail = document.getElementById("contactEmail")
const contactPhone = document.getElementById("contactPhone")
const errorContactMessage = document.getElementsByClassName("errorContactMessage")
let contactNameInputValue
let contactEmailInputValue
let contactPhoneInputValue
let bookingIsValidEmail
let bookingIsValidPhone
contactName.addEventListener("input",() => {
    contactNameInputValue = contactName.value
})
contactEmail.addEventListener("input",() => {
    checkContactEmailInput()
    contactEmailInputValue = contactEmail.value
})
contactPhone.addEventListener("input",() => {
    checkContactPhoneInput()
    contactPhoneInputValue = contactPhone.value
})
function checkContactEmailInput(){
    bookingIsValidEmail = contactEmail.checkValidity()
    if(bookingIsValidEmail != true){
        errorContactMessage[0].classList.remove("none")
    }else{
        errorContactMessage[0].classList.add("none")
    }
}
function checkContactPhoneInput(){
    bookingIsValidPhone = contactPhone.checkValidity()
    if(bookingIsValidPhone != true){
        errorContactMessage[1].classList.remove("none")
    }else{
        errorContactMessage[1].classList.add("none")
    }
}
/*  get prime */
const bookingButton = document.getElementById("bookingButton")
bookingButton.addEventListener("click", () => {
    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    console.log(tappayStatus)

    // 確認是否可以 getPrime

    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert('get prime error ' + result.msg)
            return
        }
        alert('get prime 成功，prime: ' + result.card.prime)
    })
})
