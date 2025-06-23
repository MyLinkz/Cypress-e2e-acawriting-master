import {
	AcademicLevel,
	CommomTextbox,
	SubjectTypes,
	PaperTypes,
	NoResult,
	Order,
	PaperFormat,
	TopicLength,
	CopyText,
	ErrorMessages,
} from "../../../../support/constants/defaultvalue"
import { IBH_ROUTERS } from "../../../../support/constants/url";
import orderFormPage, { defaultValue, PlaceholderValue, StepOrderTitle } from "../../pages/orderFormPage";
import signInPage from "../../pages/signinPage";

import { loadExcelData } from "../../../../support/excelHelper";

Cypress.config('baseUrl', 'https://kamora:iamafriend@ibhelper.dev/');

const fileName = "./data/DataOrderForm.xlsx";
const sheetName = "DataOF_IBH";
const dataID = 1;

Cypress.config('baseUrl', 'https://kamora:iamafriend@ibhelper.dev/');

describe("Order Step 2", () => {
	// const dataOrder = dataOrder1;
	const ROUTERS = IBH_ROUTERS;

	function getDataOrder() {
		return Cypress.env('dataOrderForm'); // Trả ra giá trị ORDER_TYPE
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
		if (this.currentTest.title === '[Skip beforeEach]') {
			cy.log('Skipping beforeEach for Test 1');
			this.skip(); // Bỏ qua beforeEach cho test case này
		}
		signInPage.signInSuccess();
		cy.visit(IBH_ROUTERS.ORDER);
		orderFormPage.fillStep0(getDataOrder());
		orderFormPage.clickGoBTN();
		cy.wait(1500);
		orderFormPage.fillStep1(getDataOrder());
		orderFormPage.clickNextBTN();
		cy.wait(1500);
	})
	context('Navigation', () => {
		it('Should navigate to the [Order Form] page by URL', () => {
			orderFormPage.verifyStepName(orderFormPage.NewStep2)
		})
		it('Should navigate to the [Order Form] page when going from another page', () => {
			cy.visit(ROUTERS.HOME)
			cy.wait(1000);
			cy.get(orderFormPage.BTN_ORDER_NOW)
				.contains('Order Now')
				.click({ force: true });
			orderFormPage.verifyStepName(orderFormPage.NewStep2)
		})
	})
	it('Should navigate to the [Homepage] page when clicking on it', () => {
		cy.get(orderFormPage.BTN_LOGO)
			.click({ force: true })
		cy.location("pathname")
			.should("eq", ROUTERS.HOME)
	})
	it('Should show the [Cancel Confirm] slide up when click on it', () => {
		cy.get(orderFormPage.BTN_CANCEL)
			.click({ force: true })
		cy.get(orderFormPage.SLD_CONF)
			.should('be.visible')
	})
	context('[Cancel Confirm] slide up', () => {
		it("Shouldn't reset data when user on the [Continue With Your Order] button", () => {
			orderFormPage.fillStep2(getDataOrder());
			cy.get(orderFormPage.BTN_CANCEL)
				.click({ force: true })
			cy.get(orderFormPage.BTN_CONT)
				.click({ force: true })
			orderFormPage.verifyStep2Filled(getDataOrder());
		})
		it('Should reset data when user click on [Cancel Order] button', () => {
			//close silde and reset value
			orderFormPage.fillStep2(getDataOrder());
			orderFormPage.clickNextBTN();
			cy.get(orderFormPage.BTN_CANCEL)
				.click({ force: true })
			cy.get(orderFormPage.BTN_CANCEL_CONF)
				.click({ force: true })
			cy.wait(2000);
			orderFormPage.verifyDefaultOrderType();
		})
		context('[X] button', () => {
			it("Click on it", () => {
				orderFormPage.fillStep2(getDataOrder());
				cy.get(orderFormPage.BTN_CANCEL)
					.click({ force: true })
				cy.wait(1000)
				orderFormPage.clickXBTNForm();
				orderFormPage.verifyStep2Filled(getDataOrder());
			})
			it("Click on gray area", () => {
				orderFormPage.fillStep2(getDataOrder());
				cy.get(orderFormPage.BTN_CANCEL)
					.click({ force: true })
				cy.get(orderFormPage.BACK_DROP)
					.click({ force: true })
				orderFormPage.verifyStep2Filled(getDataOrder());
			})
		})
	})
	it('Check title of step', () => {
		cy.contains(orderFormPage.NewStep2)
			.should('be.visible')
		cy.get('h1').should('have.text', orderFormPage.NewStep2);
	})
	context('[Title] textbox', () => {
		it("Check place holder", () => {
			cy.get(orderFormPage.TXT_TITLE)
				.invoke('attr', 'placeholder')
				.should('equal', PlaceholderValue.TITLE);
		})
		it("Empty textbox -> Next", () => {
			cy.get(orderFormPage.TXT_TITLE)
				.clear()
			cy.get(orderFormPage.TXT_INSTRUCTIONS)
				.type(CopyText)
			orderFormPage.clickNextBTN();
			cy.contains(StepOrderTitle.NewStep3)
		})
		it("Check count character", () => {
			cy.get(orderFormPage.TXT_TITLE)
				.type(TopicLength.Longer)
			cy.get(orderFormPage.COUNT_CHAR)
				.invoke("text")
				.should('eq', `${TopicLength.EqualNumber} / 300`)
		})
		it("Input <300 character", () => {
			cy.get(orderFormPage.TXT_TITLE)
				.type(TopicLength.LessThan)
			cy.get(orderFormPage.TXT_INSTRUCTIONS)
				.type(CopyText)
			orderFormPage.clickNextBTN();
			orderFormPage.verifyStep(StepOrderTitle.NewStep3)
		})
		it("Input =300 character", () => {
			cy.get(orderFormPage.TXT_TITLE)
				.type(TopicLength.Equal)
			cy.get(orderFormPage.COUNT_CHAR)
				.invoke("text")
				.should('eq', `${TopicLength.EqualNumber} / 300`)
			cy.get(orderFormPage.TXT_INSTRUCTIONS)
				.type(CopyText)
			orderFormPage.clickNextBTN();
			orderFormPage.verifyStep(StepOrderTitle.NewStep3)
		})
		it("Input >300 character", () => {
			cy.get(orderFormPage.TXT_TITLE)
				.type(TopicLength.Longer)
			cy.get(orderFormPage.TXT_INSTRUCTIONS)
				.type(CopyText)
			orderFormPage.clickNextBTN();
			orderFormPage.verifyStep(StepOrderTitle.NewStep3)

		})
		it("Value show corret at order Preview", () => {
			cy.get(orderFormPage.TXT_TITLE)
				.type(TopicLength.Equal)
			cy.get(orderFormPage.TXT_INSTRUCTIONS)
				.click({ force: true })
			cy.get(orderFormPage.ORDER_PREVIEW)
				.contains(TopicLength.Equal)
				.should('be.visible')
		})
		it("Enter space character, and auto trim", () => {
			cy.get(orderFormPage.TXT_TITLE)
				.type(TopicLength.Spacing)
			cy.get(orderFormPage.TXT_INSTRUCTIONS)
				.click({ force: true })
			cy.get(orderFormPage.ORDER_PREVIEW)
				// .invoke("text")/*  */
				.should("contain", TopicLength.Spacing.trim())
		})
	})
	context('[Instructions] textbox', () => {
		it("Check placeholder", () => {
			cy.get(orderFormPage.TXT_INSTRUCTIONS)
				.invoke('attr', 'data-placeholder')
				.should('eq', PlaceholderValue.INSTRUCTIONS);
		})
		xit("Empty -> Next", () => {
			//Add data for other required fields: Type of document, Instructions
			orderFormPage.clickNextBTN();
			cy.contains(`${ErrorMessages.OrderFieldRequired}`)
				.should('be.visible')
			cy.get(orderFormPage.ORDER_PREVIEW)
				.should('not.contain', 'Instructions:')
		})
		it("Input data successfully and show at Order Preview", () => {
			cy.get(orderFormPage.TXT_INSTRUCTIONS)
				.type(CommomTextbox.FullCharacter)
			cy.wait(2000)
			cy.get(orderFormPage.ORDER_PREVIEW)
				.should('contain', CommomTextbox.FullCharacter.trim())
		})
	})
	context('[Next] button', () => {
		it('Should navigate to step 3', () => {
			//Add data for other required fields: Type of document, Instructions
			orderFormPage.fillStep2(getDataOrder());
			orderFormPage.clickNextBTN();
			cy.wait(1000)
			orderFormPage.verifyStep(StepOrderTitle.NewStep3)
		})
		it('Should show error when required field is empty', () => {
			orderFormPage.clickNextBTN();
			cy.contains(orderFormPage.ERR_MES)
				.should('be.visible')
			cy.contains(StepOrderTitle.NewStep2)
				.should('be.visible')
		})
		it('Check save information at step 1', () => {
			cy.get(orderFormPage.BTN_BACK)
				.click({ force: true });
			orderFormPage.verifyStep1Filled(getDataOrder());
		})
	})
	it('[Back] button active, not save data and back to previous step', () => {
		orderFormPage.fillStep2(getDataOrder());
		orderFormPage.clickBackBTN();
		orderFormPage.clickNextBTN()
		orderFormPage.verifyStep2NotFill();
	})
	context('Order Preview', () => {
		it('Default status of collapse', () => {
			orderFormPage.verifyCOLOpen(orderFormPage.ORDER_PREVIEW_DETAILS)
		})
		it('Icon [^] active and change to [v] when click on it', () => {
			cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
				.find('.header')
				.click({ force: true })
			orderFormPage.verifyCOLNotOpen(orderFormPage.ORDER_PREVIEW_DETAILS)
		})
		xit('Check display default fields & value', () => {
			cy.get(orderFormPage.ORDER_PREVIEW)
				.contains(Order.Academic)
				.should('be.visible')
			cy.get(orderFormPage.ORDER_PREVIEW)
				.contains(Order.PaperFormat)
				.should('be.visible')
		})
		it('Check not save value at step 2', () => {
			orderFormPage.fillStep2(getDataOrder());
			orderFormPage.clickPaperEditBTN();
			orderFormPage.verifyStepName(StepOrderTitle.NewStep1);
			orderFormPage.clickNextBTN();
			orderFormPage.verifyStep2NotFill();
		})
	})
	context('Additional', () => {
		context('Never pressed the [Next] button before', () => {
			it('Filled data should be returned to default values when page is reloaded.', () => {
				orderFormPage.fillStep2(getDataOrder());
				cy.wait(1000)
				cy.reload()
				orderFormPage.verifyStep2NotFill();
			});
			it('Filled data should be reset when moving to previous step and returning', () => {
				orderFormPage.fillStep2(getDataOrder());
				orderFormPage.clickBackBTN();
				orderFormPage.clickNextBTN();
				orderFormPage.verifyStep2NotFill();
			})
			it('Filled data should be reset when navigation to [Home page] and go to [Order form] by [Order Now] or [Continue To Order] button ', () => {
				orderFormPage.fillStep2(getDataOrder());
				cy.get(orderFormPage.BTN_LOGO)
					.click({ force: true });
				cy.get(orderFormPage.BTN_ORDER_NOW).contains('Order Now')
					.click({ force: true });
				orderFormPage.verifyStepName(StepOrderTitle.NewStep2);
				orderFormPage.verifyStep2NotFill();
			})
			it('Filled data should be reset when navigation to [Home page] and go to [Order form] by [Back] button of browser', () => {
				orderFormPage.fillStep2(getDataOrder());
				cy.get(orderFormPage.BTN_LOGO)
					.click({ force: true });
				cy.wait(5000);
				cy.go('back');
				orderFormPage.verifyStepName(StepOrderTitle.NewStep2);
				orderFormPage.verifyStep2NotFill();
			})
			it('Filled data should be reset when opening new tab and inputting URL', () => {
				orderFormPage.fillStep2(getDataOrder());
				cy.url().then((currentUrl) => {
					const username = Cypress.env("USERNAME");
					const password = Cypress.env("PASSWORD");

					// Chuyển URL hiện tại sang định dạng có Basic Auth
					const authUrl = currentUrl.replace("https://", `https://${username}:${password}@`);

					// Truy cập lại trang với Basic Auth
					cy.visit(authUrl);

					// Kiểm tra dữ liệu có bị reset không
					orderFormPage.verifyStep2NotFill();
				});
			})
		})
		context('Step 3 must be active', () => {
			let skipAfterEach = false;

			before(() => {
				loadExcelData(fileName, sheetName).then((data) => {
					cy.wrap(data).as('testData');
					cy.get('@testData').then((testData) => {
						const dataObject = testData[2];  // dòng 2
						Cypress.env('dataOrderFormID2', dataObject);
					});
				});
			});
			function getDataOrderID2() {
				return Cypress.env('dataOrderFormID2'); // Trả ra giá trị ORDER_TYPE
			}
			beforeEach(() => {
				orderFormPage.fillStep2(getDataOrder());
				orderFormPage.clickNextBTN();
				orderFormPage.clickBackBTN()
			})
			function clearData() {
				cy.get(orderFormPage.TXT_TITLE).clear();
				cy.get(orderFormPage.TXT_INSTRUCTIONS).clear();
			}
			afterEach(() => {
				if (skipAfterEach) {
					cy.log("Skipping afterEach for this test");
					return;
				}
				cy.wait(500)
				orderFormPage.verifyStep2Filled(getDataOrderID2());
			})
			it('Filled data should be saved when moving to the next step and returning by [Back] button', () => {
				orderFormPage.verifyStep2Filled(getDataOrder());
				skipAfterEach = true;
			})

			it('Filled data should be saved when page is reloaded.', () => {
				clearData();
				orderFormPage.fillStep2(getDataOrderID2());
				cy.wait(500);
				cy.reload();
				cy.wait(1500);
			})
			it('Filled data should be saved when navigation to [Home page] and go to [Order form] by [Order Now] or [Continue To Order] button.', () => {
				clearData();
				orderFormPage.fillStep2(getDataOrderID2());
				cy.wait(500);
				cy.visit("/");
				cy.get(orderFormPage.BTN_ORDER_NOW).contains("Order Now")
					.click({ force: true });
				cy.wait(500);
			})
			it('Filled data should be saved when navigation to [Home page] and go to [Order form] by [back] button of browser', () => {
				clearData();
				orderFormPage.fillStep2(getDataOrderID2());
				cy.get(orderFormPage.BTN_LOGO)
					.click({ force: true });
				cy.wait(3000);
				cy.go('back');
			})
			it('Filled data should be saved when opening new tab and inputting URL', () => {
				clearData();
				orderFormPage.fillStep2(getDataOrderID2());
				cy.url().then((currentUrl) => {
					const username = Cypress.env("USERNAME");
					const password = Cypress.env("PASSWORD");

					// Chuyển URL hiện tại sang định dạng có Basic Auth
					const authUrl = currentUrl.replace("https://", `https://${username}:${password}@`);

					// Truy cập lại trang với Basic Auth
					cy.visit(authUrl);

				});
			})
			xit('Filled data should be saved when moving to the next step and returning by [Edit] button', () => {

			})
		})
	})
})

