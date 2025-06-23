import {
    AcademicLevel, CommomTextbox, CopyText, Deadline, SubjectTypes,
    PaperTypes, ExistEmail, Extra, PaperFormat, PaymentAccount, PriceOrder
} from "../constants/defaultvalue";
import { LOCATE_NEWFORM } from "../constants/locate";
import { ROUTERS } from "../constants/url";
import signinPage from "../../e2e/WPH/pages/signinPage";
export function generateRandom(length, type) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    if (type === 'number') {
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10);
        }
    } else if (type === 'string') {
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
    }

    return result;
};
export function findValueByLevelAndUrgency(level, urgency) {
    const foundItem = PriceOrder.find(item => item.level === level && item.urgency === urgency);
    if (foundItem) {
        return foundItem.value;
    }
}
export function totalPriceUpdate(value, numberOfPage, numberOfSlide, spacing, extra, discount) {

    const pricePage = numberOfPage * value
    const priceSlide = numberOfSlide * (value / 2)
    var priceSpacing = 0
    if (spacing === 'Double' || spacing === null) {
        // return priceSpacing
    } else if (spacing === 'Single') {
        priceSpacing = pricePage
    }
    let price = pricePage + priceSlide + priceSpacing
    let extraFee = (price / 100) * extra
    let discountFee = ((price + extraFee) / 100) * discount
    let GrandTotal = (price + extraFee) - discountFee
    // return GrandTotal
    return {
        price,
        extraFee,
        discountFee,
        GrandTotal,
    }
}
export function ShowValue({ callback }) {
    let PageValue = 0
    let SlideValue = 0
    let SpacingValue
    let DeadLineValue
    let Level = ''
    let ExtraValue = 0
    let DiscountValue = 0
    cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
        .find('span')
        .as('FindSpan')
        .contains('Pages')
        .parent()
        .next()
        .invoke('text')
        .then((item) => {
            const matches = item.match(/\d+/)
            PageValue = parseInt(matches[0])
        })
        .then(() => {
            cy.get('@FindSpan')
                .contains('Deadline')
                .parent()
                .next()
                .invoke('text')
                .then((deadline) => {
                    if (deadline === '1 day') {
                        DeadLineValue = '24 hours'
                    } else if (deadline === '2 days') {
                        DeadLineValue = '48 hours'
                    } else {
                        DeadLineValue = deadline
                    }
                })
        })
        .then(() => {
            cy.get('@FindSpan')
                .then(($span) => {
                    if ($span.text().includes('PowerPoint slides')) {
                        cy.get('@FindSpan')
                            .contains('PowerPoint slides')
                            .parent()
                            .next()
                            .invoke('text')
                            .then((slide) => {
                                const matchesa = slide.match(/\d+/)
                                SlideValue = parseInt(matchesa[0])
                            })
                    } else {
                        SlideValue = 0
                    }
                })
        })
        .then(() => {
            cy.get('@FindSpan')
                .then(($span) => {
                    if ($span.text().includes('Page')) {
                        cy.get('@FindSpan')
                            .contains('Page')
                            .parent()
                            .next()
                            .invoke('text')
                            .then((spacing) => {
                                const matchesa = spacing.match(/Double|Single/i)
                                SpacingValue = matchesa[0]
                            })
                    } else {
                        return SpacingValue
                    }
                })

        })
        .then(() => {
            cy.get('@FindSpan')
                .then(($span) => {
                    if ($span.text().includes("Writer's category")) {
                        cy.get('.preview-item__text')
                            .invoke('text')
                            .then((text) => {
                                const idToFind = text.trim(); // Loại bỏ khoảng trắng thừa
                                const item = Extra.find((extraItem) => extraItem.id === idToFind)
                                if (item) {
                                    ExtraValue = item.value
                                }
                            })
                    }
                    else {
                        return ExtraValue
                    }
                })
        })
        .then(() => {
            cy.get('@FindSpan')
                .contains('Academic Level')
                .parent()
                .next()
                .invoke('text')
                .then((Aca) => {
                    Level = Aca
                })
        })
        .then(() => {
            cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                .find('p')
                .then(($p) => {
                    if ($p.text().includes("Discount")) {
                        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                            .contains('GAINED BY CODE')
                            .invoke('text')
                            .then(($item) => {
                                const regex = /(\d+)%/; // Biểu thức chính quy để tìm số theo sau bởi %
                                const match = $item.match(regex)
                                const numberWithoutPercent = parseInt(match[1]); // Chuyển số sang dạng số nguyên
                                console.log('b:' + numberWithoutPercent)
                                DiscountValue = numberWithoutPercent
                            })
                    }
                    else {
                        console.log('hihi')
                        return DiscountValue
                    }
                })

        })
        .then(() => {
            let level = Level
            let urgency = DeadLineValue
            const value = findValueByLevelAndUrgency(level, urgency)
            const PriceValue = totalPriceUpdate(value, PageValue, SlideValue, SpacingValue, ExtraValue, DiscountValue)

            const ExtraFee = PriceValue.extraFee
            const TotalPrice = PriceValue.GrandTotal
            const Discount = PriceValue.discountFee
            const Price = PriceValue.price

            const roundedExtra = Math.round(ExtraFee * 100) / 100
            const roundedNumber = Math.round(TotalPrice * 100) / 100
            const roundedDiscount = Math.round(Discount * 100) / 100
            const roundedPrice = Math.round(Price * 100) / 100

            const TotalPriceFix = (parseFloat(roundedNumber)).toFixed(2)
            const ExtraFix = (parseFloat(roundedExtra)).toFixed(2)
            const DiscountFix = (parseFloat(roundedDiscount)).toFixed(2)
            const PriceFix = (parseFloat(roundedPrice)).toFixed(2)
            console.log('a :' + DiscountValue)
            callback({
                TotalPriceFix: TotalPriceFix,
                ExtraFix: ExtraFix,
                DiscountFix: DiscountFix,
                PriceFix: PriceFix
            })

        })
}
export function Signin() {
    cy.visit(ROUTERS.SIGN_IN)
    cy.get(signinPage.TXT_EMAIL)
        .type(ExistEmail.email)
    cy.get(signinPage.TXT_PASSWORD)
        .type(ExistEmail.password)
    cy.get(signinPage.BTN_SUB)
        .click({ force: true })
        .wait(6000)
}
export function GotoStep5WithAccountHaveMoney() {
    cy.visit(ROUTERS.SIGN_IN)
    cy.get(signinPage.TXT_EMAIL)
        .type(ExistEmail.emailHaveMoney)
    cy.get(signinPage.TXT_PASSWORD)
        .type(ExistEmail.password)
    cy.get(signinPage.BTN_SUB)
        .click({ force: true })
    cy.wait(6000)
    cy.contains('Order Now')
        .click({ force: true })
    cy.contains(AcademicLevel[1], { timeout: 20000 })
        .click({ force: true })
    cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
        .type(PaperTypes[1].title)
    cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
        .type(SubjectTypes[1].title, { force: true })
    cy.contains(`${PaperFormat[1]}`)
        .click({ force: true })
    cy.get(LOCATE_NEWFORM.BTN_NEXT)
        .click({ force: true })

    // Go to step 2
    cy.get(LOCATE_NEWFORM.TXT_TITLE)
        .type(CopyText)
    cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
        .type(CommomTextbox.Letter)
        .click({ force: true })
    cy.get(LOCATE_NEWFORM.BTN_NEXT)
        .click({ force: true })
    // Go to step 3
    cy.get(LOCATE_NEWFORM.BTN_INC_PAGES)
        .click()
    cy.get(LOCATE_NEWFORM.BTN_INC_SLIDE)
        .click()
    cy.get(LOCATE_NEWFORM.BTN_INC_SOURCE)
        .click()
    cy.get(LOCATE_NEWFORM.SEL_DEADLINE)
        .contains(Deadline[1])
        .click()
    cy.get(LOCATE_NEWFORM.SEL_SPACING)
        .find('button:not(.active)')
        .click({ force: true })
    cy.get(LOCATE_NEWFORM.BTN_NEXT)
        .click({ force: true })
    // Go to step 4
    cy.get(LOCATE_NEWFORM.ORDER_INPUT)
        .contains(Extra[2].id)
        .click({ force: true })
    cy.get(LOCATE_NEWFORM.BTN_NEXT)
        .click({ force: true })
}
// export function PaymentByPaypal() {
//     cy.origin("https://www.sandbox.paypal.com/", () => {
//         // cy.get('.css-ltr-1m7plzc-button-Button')
//         cy.contains('Đăng nhập')
//             .click({ force: true })
//         cy.wait(5000)
//         cy.get('#email')
//             .type('sb-8rgty15774225@personal.example.com', { force: true })
//         cy.get('#btnNext')
//             .click({ force: true })
//         cy.get('#password')
//             .type('DtBBsL-4')
//         cy.get('#btnLogin')
//             .click({ force: true })
//         cy.get('[data-testid="submit-button-initial"]').click({ force: true })
//     })
// }
export function PaymentByPaypal() {
    cy.contains('Đăng nhập', { timeout: 10000 }).should('be.visible').click()
    cy.get('#email', { timeout: 10000 }).should('be.visible')
        .type('sb-8rgty15774225@personal.example.com')
    cy.get('#btnNext').click()
    cy.get('#password', { timeout: 10000 }).should('be.visible')
        .type('DtBBsL-4')
    cy.get('#btnLogin').click()
    cy.get('[data-testid="submit-button-initial"]', { timeout: 10000 }).should('be.visible').click()
    // Bước 1: Lấy URL hiện tại nếu nó chứa 'writersperhour.dev'
    cy.url().should('include', 'writersperhour.dev')
        .then((currentUrl) => {
            // Bước 2: Chỉnh sửa URL để bao gồm thông tin đăng nhập và giữ lại query string
            const urlWithAuth = `https://kamora:iamafriend@${new URL(currentUrl).host}${new URL(currentUrl).pathname}${new URL(currentUrl).search}`;

            // Bước 3: Lưu URL với thông tin đăng nhập và chờ 10 giây
            cy.wait(10000);  // 10 giây

            // Bước 4: Truy cập lại URL đã chỉnh sửa
            cy.visit(urlWithAuth);
        });

    // Set localStorage sau khi trang đã load xong
    cy.window().then((window) => {
        window.localStorage.setItem('isTest', 'true');
    });
}
export function capitalizeFirstLetter(str) {
    str = str.trim(); // Loại bỏ khoảng trắng đầu và cuối
    if (!str) return ''; // Xử lý chuỗi rỗng
    return str.charAt(0).toUpperCase() + str.slice(1);
}

Cypress.on('uncaught:exception', (err, runnable) => {
    // Kiểm tra nếu lỗi đến từ React
    if (err.message.includes('Minified React error')) {
      return false; // Bỏ qua lỗi và không fail test
    }
	if (err.message.includes('Failed to fetch')) {
		return false; // Bỏ qua lỗi và không fail test
	}
  });
// support/e2e.js hoặc support/index.js
Cypress.on('fail', (error, runnable) => {
	if (runnable.hookName === 'before each') {
		cy.log('A "before each" hook failed.');
		// Có thể ghi log lỗi vào file hoặc làm gì đó tùy nhu cầu
	}
	throw error; // Vẫn ném lỗi để test case thất bại
});
