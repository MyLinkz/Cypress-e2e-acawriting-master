// https://docs.google.com/spreadsheets/d/19Knmyxh26B4wYwJcTvxwRQkVIHzEilkQdaaHmwQ-76Q/edit#gid=1173477861
// import 'cypress-wait-until';
import Calculator from '../../support/calculator';
import { ROUTERS } from '../../support/constants/url';
import {LOCATE_SIGNUP} from "../../support/constants/locate";
import {ValidEmail} from "../../support/constants/validate";
// import Price from '../../getData/prices';
const Price = require('../../getData/prices.js');
describe("Step 5", () => {

    it('should calculate page price correctly', () => {
        cy.visit(ROUTERS.HOME); // Visit the home page

        const calculator = new Calculator();

        const orderFormData = {
            ID: 1,
            type: "writing",
            acalevelNumb: "2",
            TYPE_OF_DOCUMENT: "Analysis Paper",
            DISCIPLINE: "Agriculture",
            PAPER_FORMAT: "APA",
            TITLE: "Lorem Ipsum",
            INSTRUCTIONS: "Lorem Ipsum",
            FILE_UPLOAD: "",
            SOURCES: 3,
            DEADLINE: "48 hours",
            pages: 4,
            spacing: "Single",
            slides: 3,
            writerLvl: "ADVANCED (+25%)",
            isAbsPrice: "Yes",
            isPreWriter: "No",
            PAYMENT_METHOD: "Stripe",
            disCode: "paper15"
        };

        // Gọi phương thức setValuesFromOrderForm để nhập dữ liệu
        // calculator.setValuesFromOrderForm(orderFormData);

        // Tính toán expectedPagePrice hoặc lấy từ dữ liệu mẫu
        const expectedPagePrice = 123.45;

        // So sánh giá trị trả về từ phương thức getPagePrice
        // calculator.getPagePrice().then(pagePrice => {
        //     expect(pagePrice).to.equal(expectedPagePrice);
        // });
        // Gọi hàm getPrice
        (async () => {
            try {
                console.log('Price'. Price)
                const price = await Price.getPrice("48 hours", "Undergrad. (yrs 3-4)"); // Gọi hàm bất đồng bộ
                log('Price:', price); // In ra giá nếu thành công
            } catch (error) {
                log('Error fetching price:', error); // In lỗi nếu có
            }
        })();
    });
    it('should calculate page price correctly', () => {
        cy.visit(ROUTERS.HOME); // Visit the home page

    });
	it.only('should calculate page price correctly', () => {
		cy.log(Cypress.env("BASIC_PASSWORD"))
		console.log(Cypress.env("BASIC_PASSWORD"))
		cy.log(`${ValidEmail[0]}`)
		// cy.log("hi")
	})
})
