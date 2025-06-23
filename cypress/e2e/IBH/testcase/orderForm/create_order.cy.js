import {
    AcademicLevel, PaperFormat, PlaceholderValue, Order, ErrorMessages, CopyText,
    ExistEmail, PaperTypes, SubjectTypes, CommomTextbox, NoResult, StepOrderTitle,
    WrongEmail
} from "../../../../support/constants/defaultvalue"
import { ROUTERS } from "../../../../support/constants/url"
import {
    TCForInvalidEmail, ValidEmail, PasswordLV0, TCForInvaildPassword, TCForVaildPassword
} from "../../../../support/constants/validate"
import signinPage from "../../pages/signinPage";

import {loadExcelData, readSheet} from '../../../../support/excelHelper';
import orderFormPage from "../../pages/orderFormPage";


const fileName = "./data/DataOrderForm.xlsx";
const sheetName = "Sheet2";
const dataID = 3

Cypress.config('baseUrl', 'https://kamora:iamafriend@ibhelper.dev/');
describe("Order Step 1", () => {
    function getOrderType() {
        const dataOrderForm = Cypress.env('dataOrderForm');
        return dataOrderForm.ORDER_TYPE; // Trả ra giá trị ORDER_TYPE
    }
    function getDataOrder() {
        const dataOrderForm = Cypress.env('dataOrderForm');
        return dataOrderForm; // Trả ra giá trị ORDER_TYPE
    }
    before(() => {
        loadExcelData(fileName, sheetName).then((data) => {
            cy.wrap(data).as('testData');
            cy.get('@testData').then((testData) => {
                const dataObject = testData[dataID];  // dòng 2
                Cypress.env('dataOrderForm', dataObject);
            });
        });
    });
	beforeEach(function () {
        let TXT_PASSWORD = '[placeholder="Password"]';
        let TXT_EMAIL = '[placeholder="Email"]';

        signinPage.signInByToken(TXT_EMAIL,TXT_PASSWORD)
        cy.visit(ROUTERS.SIGN_IN);
		cy.get(TXT_EMAIL)
			.type(ExistEmail.email);
		cy.get(TXT_PASSWORD)
			.type(ExistEmail.password);
		cy.contains('button', 'Sign in')
			.click();
		cy.verifylocate(ROUTERS.HOME);
		cy.wait(2000)

        cy.visit(ROUTERS.ORDER)
    })
    it('Create order', () => {
        cy.get('.btn-cookie > .sc-466605ab-0')
            .click({ force: true })
        for (let i = 0; i < 40; i++) {
            cy.visit(ROUTERS.ORDER)
            cy.log("test");
            orderForm.fillStep1();
            cy.contains('button', 'Next')
                .click();
            //2
            cy.get('.custom-input-form > input').type('a');
            cy.get('.scrollbar').type('a');
            cy.contains('button', 'Next')
                .click();
            //3
            cy.contains('button', 'Next')
                .click();
            //4
            cy.contains('button', 'Next')
                .click();

            cy.get('.sc-2a80df85-0 > .sc-466605ab-0')
                .click({ force: true })
            cy.wait(5000)
            cy.log(i)
        }
    })
})
describe.skip("WPH", ()=>{
    beforeEach(function () {
       cy.visit(ROUTERS.ORDER);
       signinPage.signInByToken(ExistEmail.email,ExistEmail.password);
       cy.reload();
    })
    it("Create order form WPH",()=>{
        const dataOrder ='{"step":9,"orderType":{"title":"writing","description":"Have a professional academic writer complete your paper according to your specific requirements and deadline.","id":"writing"},"stepPassed":8,"balance":0,"isWallet":false,"discipline":{"id":61,"title":"Accounting","isActive":false,"isFavorite":false,"description":"","isDefault":false,"isIB":false},"documentType":{"id":32,"title":"Essay (any type)","isActive":false,"isFavorite":false,"description":"","isDefault":1,"isIB":false},"academicLevel":{"id":5,"title":"Ph.D.","isActive":false,"isFavorite":false,"description":"Tailored for PhD students and advanced researchers, focusing on in-depth research, and professional academic analysis.","isDefault":false,"isIB":false},"instructions":"<p style=\"margin-left: 0px; text-align: left\">d</p>","files":[],"sources":0,"citationStyle":{"id":0,"title":"Not Applicable"},"skipSources":0,"urgency":5,"pages":2,"slideNumbers":0,"spacing":2,"writerCategory":{"id":1,"key":"writer_1","title":"BEST AVAILABLE","percent":0,"description":"Standard price","isActive":false,"visibility":"both"}}';
        for (let i = 0; i < 40; i++) {
          orderForm.setOrderForm(dataOrder);
          cy.visit(ROUTERS.ORDER)
          cy.wait(10000);
        }
    })
})
describe("IBH-test", ()=>{
    beforeEach(function () {
       cy.visit(ROUTERS.ORDER);
       signinPage.signInByToken(ExistEmail.email,ExistEmail.password);
       cy.reload();
    })
    it("Create order form WPH",()=>{
       cy.visit("/")
    })
})
describe.only("IBH-test3", () => {
    function getOrderType() {
        const dataOrderForm = Cypress.env('dataOrderForm');
        return dataOrderForm.ORDER_TYPE; // Trả ra giá trị ORDER_TYPE
    }

    function getDataOrder() {
        // console.log("Test " + Cypress.env('dataOrderFormSheet'))
        return Cypress.env('dataOrderFormSheet'); // Trả ra dữ liệu
    }

    before(() => {
        cy.task("readSheet", {filename: fileName, sheetName: "Sheet2"}).then((data) => {

            const headers = data[0]; // Lấy hàng đầu tiên làm tiêu đề cột
            const testDataList = data.slice(1).map(row => {
                return Object.fromEntries(headers.map((key, index) => [key, row[index]]));
            });

            // Lưu vào biến môi trường Cypress
            Cypress.env('dataOrderFormSheet', testDataList);
            // Cypress.env('dataOrderFormSheet', data); // Lưu dữ liệu vào môi trường Cypress
            // console.log("Data from Excel:", data);
        });
    });
    //
    // beforeEach(function () {
    // 	signinPage.signInSuccess();
    // });

    context('test order form', () => {
        it('Test từng order', function () {
            let dataOrderForm = Cypress.env('dataOrderForm');

            dataOrderForm.forEach(order => {
                cy.visit(ROUTERS.ORDER);
                console.log(`Đang test ORDER_TYPE: ${order.ORDER_TYPE}`);
            });
        });
    });

    it.only('should process all orders', () => {

        Cypress.env('dataOrderFormSheet').forEach((testData) => {
            if (testData.RESULT === 'Passed') {
            } else {
                signinPage.signInSuccess();
                cy.get('.btn-cookie > .sc-6fe1cc8-0 > .button-show')
                    .click({force: true});
                cy.visit(ROUTERS.ORDER);

                cy.log(`Processing order ID: ${testData.ID}`);
                cy.log(`Processing order TYPE_OF_DOCUMENT: ${testData.TYPE_OF_DOCUMENT}`);
                cy.visit(ROUTERS.ORDER);
                console.log(testData);
                orderFormPage.fillStep1(testData);
                orderFormPage.clickNextBTN();
                orderFormPage.fillStep2(testData);
                orderFormPage.clickNextBTN();
                orderFormPage.fillStep3(testData);
                orderFormPage.clickNextBTN();
                orderFormPage.fillStep4(testData);
                orderFormPage.clickNextBTN();
                orderFormPage.fillStep5(testData);
                cy.screenshot(`DataValue${testData.ID}`);
                cy.get('.sc-d1971123-0 > .sc-6fe1cc8-0 > .button-show')
                	.click({force: true});
                    cy.wait(4000);
                cy.clearAllCookies();
                cy.clearAllSessionStorage();
                cy.clearAllLocalStorage()



            }
        });
    });
});
