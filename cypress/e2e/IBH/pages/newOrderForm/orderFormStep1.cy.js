import {
	AcademicLevel,
	CommomTextbox,
	SubjectTypes,
	PaperTypes,
	NoResult,
	Order,
	PaperFormat,
	StepOrderTitle,
} from "../../../../support/constants/defaultvalue"
import {IBH_ROUTERS} from "../../../../support/constants/url";
import orderFormPage, {defaultValue, PlaceholderValue} from "../../pages/orderFormPage";
import signInPage from "../../pages/signinPage";

import {loadExcelData} from "../../../../support/excelHelper";

Cypress.config('baseUrl', 'https://kamora:iamafriend@ibhelper.dev/');

const fileName = "./data/DataOrderForm.xlsx";
const sheetName = "DataOF_IBH";
const dataID = 1;

describe("Order Step 1", () => {
	function getDataOrder() {
		return Cypress.env('dataOrderForm'); // Trả ra giá trị ORDER_TYPE
	}

	beforeEach(function () {
		if (this.currentTest.title === '[Skip beforeEach]') {
			cy.log('Skipping beforeEach for Test 1');
			this.skip(); // Bỏ qua beforeEach cho test case này
		}
		signInPage.signInSuccess();
		cy.visit(IBH_ROUTERS.ORDER);
		orderFormPage.fillStep0(getDataOrder());
		orderFormPage.clickGoBTN();
		cy.wait(1500)
	})

	before(() => {
		loadExcelData(fileName, sheetName).then((data) => {
			cy.wrap(data).as('testData');
			cy.get('@testData').then((testData) => {
				const dataObject = testData[dataID];  // dòng 2
				Cypress.env('dataOrderForm', dataObject);
			});
		});
	});

	context('Navigation', () => {
		it('Should navigate to the [Order Form] page by URL', () => {
			orderFormPage.verifyStepName(orderFormPage.NewStep1)
		})
		it('Should navigate to the [Order Form] page when going from another page', () => {
			cy.visit(IBH_ROUTERS.HOME);
			cy.visit(IBH_ROUTERS.ORDER);
			orderFormPage.verifyStepName(orderFormPage.NewStep1)
		})
	})
	it('Should navigate to the [Homepage] page when clicking on it', () => {
		cy.get(orderFormPage.BTN_LOGO)
			.click({force: true})
		cy.location("pathname")
			.should("eq", IBH_ROUTERS.HOME)
	})
	it('Should show the [Cancel Confirm] slide up when click on it', () => {
		cy.get(orderFormPage.BTN_CANCEL)
			.click({force: true})
		cy.get(orderFormPage.SLD_CONF)
			.should('be.visible')
	})
	context('[Cancel Confirm] slide up', () => {
		it("Shouldn't reset data when user on the [Continue With Your Order] button", () => {
			orderFormPage.fillStep1(getDataOrder());
			cy.get(orderFormPage.BTN_CANCEL)
				.click({force: true})
			cy.get(orderFormPage.BTN_CONT)
				.click({force: true})
			orderFormPage.verifyStep1Filled(getDataOrder());
		})
		it('Should reset data when user click on [Cancel Order] button', () => {
			//close silde and reset value
			orderFormPage.fillStep1(getDataOrder());
			orderFormPage.clickNextBTN();
			cy.get(orderFormPage.BTN_CANCEL)
				.click({force: true})
			cy.get(orderFormPage.BTN_CANCEL_CONF)
				.click({force: true})
			cy.wait(2000);
			orderFormPage.verifyDefaultOrderType();
		})
		context('[X] button', () => {
			it("Click on it", () => {
				orderFormPage.fillStep1(getDataOrder());
				cy.get(orderFormPage.BTN_CANCEL)
					.click({force: true})
				cy.wait(1000)
				orderFormPage.clickXBTNForm();
				orderFormPage.verifyStep1Filled(getDataOrder());
			})
			it("Click on gray area", () => {
				orderFormPage.fillStep1(getDataOrder());
				cy.get(orderFormPage.BTN_CANCEL)
					.click({force: true})
				cy.get(orderFormPage.BACK_DROP)
					.click({force: true})
				orderFormPage.verifyStep1Filled(getDataOrder());
			})
		})
	})
	it('Check title of step', () => {
		cy.contains(orderFormPage.NewStep1)
			.should('be.visible')
		cy.get('h1').should('have.text', orderFormPage.NewStep1);
	})
	context('Academic Level field', () => {
		context("Click button and just it's active", () => {
			AcademicLevel.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
					orderFormPage.clickAcaLevel(CheckValue);
					orderFormPage.verifyAcaLevelActiveWithStick(CheckValue);
				})
			})
		})
		context("Value show corret at order Preview", () => {
			AcademicLevel.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
					orderFormPage.clickAcaLevel(CheckValue);
					cy.get(orderFormPage.ORDER_PREVIEW)
						.contains(CheckValue)
						.should('be.visible')
				})
			})
		})
		context("Check change option successfully", () => {
			AcademicLevel.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
					orderFormPage.clickAcaLevel(CheckValue);
					cy.get(orderFormPage.ORDER_PREVIEW)
						.contains(CheckValue)
				})
			})
		})
		it("Default Value", () => {
			orderFormPage.verifyAcaLevelActiveWithStick(defaultValue.academicLevel);
		})
	})
	context.only('[Your paper] select box', () => {
		//Type of document
		it("Check the name of the drop-down list", () => {
			cy.get('label').eq(0)
				.contains('Your paper').should('exist');
		})
		xit("Should be required field", () => {
			cy.get(orderFormPage.SEL_PAPER).as('paperSEL')
				.clear({force: true});
			cy.get(orderFormPage.SEL_SUBJECT)
				.type(SubjectTypes[1].title, {force: true});
			orderFormPage.clickNextBTN();
			cy.contains(orderFormPage.ERR_MES)
				.should('be.visible');
			cy.get('@paperSEL')
				.parents('.input-group')
				.should('have.class', 'input-group__invalid');
		})
		it("Order by alphabet", () => {
			orderFormPage.verifyAlphabet(orderFormPage.SEL_PAPER);
		})
		it("Value show correct at order Preview", () => {
			orderFormPage.findOption(orderFormPage.SEL_PAPER, getDataOrder().TYPE_OF_DOCUMENT)
				.click({force: true});
			cy.get(orderFormPage.ORDER_PREVIEW)
				.should('contain', getDataOrder().TYPE_OF_DOCUMENT);
		})
		it("Check default value", () => {
			cy.get(orderFormPage.SEL_PAPER)
				.should('have.text', defaultValue.paper)
		})
		it("Check placeholder", () => {
			cy.get(orderFormPage.SEL_PAPER)
				.invoke('attr', 'placeholder')
				.should('have.text', defaultValue.paper);
		})
		it("Check search live activity", () => {
			orderFormPage.searchLive(orderFormPage.SEL_PAPER, "pap")
		})
		//need to update
		xit("Check database equal with data on server", () => {
			orderFormPage.findOption(orderFormPage.SEL_PAPER, "paper")
				.then(($options) => {
					orderFormPage.verifyData($options, "paper")
				});
		})
		it("Input Uppercase letters", () => {
			const keyword = "PAPE";
			orderFormPage.findOption(orderFormPage.SEL_PAPER, keyword)
				.then(($options) => {
					orderFormPage.verifyUppercase($options, "paper", keyword);
				});
		});
		it("Input Lowers letters", () => {
			const keyword = "pape";
			orderFormPage.findOption(orderFormPage.SEL_PAPER, keyword)
				.then(($options) => {
					orderFormPage.verifyLowercase($options, "paper", keyword);
				});
		})
		it("Data has not search keywords", () => {
			cy.get(orderFormPage.SEL_PAPER)
				.type(NoResult, {force: true})
			cy.contains(Order.NoResult)
				.should('be.visible')
		})
		it("Allow full character", () => {
			cy.get(orderFormPage.SEL_PAPER)
				.type(CommomTextbox.FullCharacter, {force: true})
			cy.get(orderFormPage.SEL_PAPER)
				.should('have.value', CommomTextbox.FullCharacter)
		})
		it("Should show many results", () => {
			const searchText = CommomTextbox.MultiResult
			orderFormPage.findOption(orderFormPage.SEL_PAPER, searchText)// Tìm tất cả các thẻ option trong thẻ select
				.then((results) => {
					const searchResultsText = results.text().toLowerCase()
					const wordsArray = searchText.toLowerCase().trim().split(' ')
					console.log(wordsArray)
					const atLeastOneMatch = wordsArray.some((word) => {
						console.log(word)
						console.log(searchResultsText)
						console.log(searchResultsText.includes(word))
						return searchResultsText.includes(word);
					})
					// Sử dụng trình xác nhận của Cypress để kiểm tra kết quả
					console.log(atLeastOneMatch)
					expect(atLeastOneMatch).to.be.true;
				})
		})
		it("Allow click behavior", () => {
			const paperType = getDataOrder().TYPE_OF_DOCUMENT
			orderFormPage.inputPaperType(paperType);
			orderFormPage.verifyPaperType(paperType);
		})
	})
	context.only('[Your subject] select box', () => {
		//Discipline
		it("Check the name of the drop-down list", () => {
			cy.get('label').eq(1)
				.contains('Your subject').should('exist');
		})
		xit("Should be required field", () => {
			//Add data for other required fields: Type of document, Instructions
			cy.get(orderFormPage.SEL_PAPER)
				.type(PaperTypes[1].title)
			cy.get(orderFormPage.SEL_SUBJECT)
				.clear({force: true})
			cy.contains(`${PaperFormat[1]}`)
				.click({force: true})
			orderFormPage.clickNextBTN();
			cy.contains(orderFormPage.ERR_MES)
				.should('be.visible')
			cy.get(orderFormPage.SEL_SUBJECT)
				.parents('.input-group')
				.should('have.class', 'input-group__invalid')
		})
		it("Order by alphabet", () => {
			orderFormPage.verifyAlphabet(orderFormPage.SEL_PAPER);
		})
		it("Value show correct at order Preview", () => {
			orderFormPage.findOption(orderFormPage.SEL_SUBJECT, getDataOrder().DISCIPLINE)
				.click({force: true})
			cy.get(orderFormPage.ORDER_PREVIEW)
				.should('contain', getDataOrder().DISCIPLINE)
		})
		xit("Check default value", () => {
			cy.get(orderFormPage.SEL_SUBJECT)
				.invoke('attr', 'placeholder')
				.should('have.text', defaultValue.subject)
		})
		it("Check placeholder", () => {
			cy.get(orderFormPage.SEL_SUBJECT)
				.invoke('attr', 'placeholder')
				.should('equal', PlaceholderValue.SUBJECT);
		})
		it("Check search live activity", () => {
			orderFormPage.searchLive(orderFormPage.SEL_SUBJECT, "ac");
		})
		//need to update
		xit("Check database equal with data on server", () => {
			orderFormPage.findOption(orderFormPage.SEL_SUBJECT, "Ag")
				.then(($options) => {
					orderFormPage.verifyData($options, "subject")
				});
		})
		it("Input Uppercase letters", () => {
			const keyword = "AC";
			orderFormPage.findOption(orderFormPage.SEL_SUBJECT, keyword)
				.then(($options) => {
					orderFormPage.verifyUppercase($options, "subject", keyword);
				});
		})
		it("Input Lowers letters", () => {
			const keyword = "acc";
			orderFormPage.findOption(orderFormPage.SEL_SUBJECT, keyword)
				.then(($options) => {
					orderFormPage.verifyLowercase($options, "subject", keyword);
				});
		})
		it("Data has not search keywords", () => {
			cy.get(orderFormPage.SEL_SUBJECT)
				.type(NoResult, {force: true})
			cy.contains(Order.NoResult)
				.should('be.visible')
		})
		it("Allow full character", () => {
			cy.get(orderFormPage.SEL_SUBJECT)
				.type(CommomTextbox.FullCharacter, {force: true})
			cy.get(orderFormPage.SEL_SUBJECT)
				.should('have.value', CommomTextbox.FullCharacter)
		})
		it("Should show many results", () => {
			const searchText = CommomTextbox.MultiResult
			// cy.get(orderFormPage.SEL_SUBJECT)
			// 	.type(searchText);
			orderFormPage.findOption(orderFormPage.SEL_SUBJECT,searchText) // Tìm tất cả các thẻ option trong thẻ select
				.then((results) => {
					const searchResultsText = results.text().toLowerCase()
					const wordsArray = searchText.toLowerCase().trim().split(' ')
					console.log(wordsArray)
					const atLeastOneMatch = wordsArray.some((word) => {
						console.log(word)
						console.log(searchResultsText)
						console.log(searchResultsText.includes(word))
						return searchResultsText.includes(word);
					})
					// Sử dụng trình xác nhận của Cypress để kiểm tra kết quả
					console.log(atLeastOneMatch)
					expect(atLeastOneMatch).to.be.true;
				})
		})
		it("Allow click behavior", () => {
			const subjectType = getDataOrder().DISCIPLINE;
			orderFormPage.inputSubjectType(subjectType);
			orderFormPage.verifySubjectType(subjectType);

		})
	})
	context('[Next] button', () => {
		it('Should navigate to step 2', () => {
			//Add data for other required fields: Type of document, Instructions
			orderFormPage.clickNextBTN();
			orderFormPage.verifyStepName(orderFormPage.NewStep2)
			cy.contains(orderFormPage.NewStep2)
				.should('be.visible')
		})
		it('Should show error when required field is empty', () => {
			cy.get(orderFormPage.SEL_PAPER)
				.clear({force: true})
			cy.get(orderFormPage.SEL_SUBJECT)
				.clear({force: true})
			orderFormPage.clickNextBTN();
			cy.contains(orderFormPage.ERR_MES)
				.should('be.visible')
			orderFormPage.verifyStepName(orderFormPage.NewStep1)
		})
		it('Check save information at step 1', () => {
			orderFormPage.fillStep1(getDataOrder());
			orderFormPage.clickNextBTN();
			cy.wait(2000);
			cy.get(orderFormPage.BTN_BACK)
				.click({force: true});
			orderFormPage.verifyStep1Filled(getDataOrder());
		})
	})
	it('[Back] button active, not save data and back to previous step', () => {
		orderFormPage.fillStep1(getDataOrder());
		orderFormPage.clickBackBTN();
		orderFormPage.clickGoBTN();
		orderFormPage.verifyStep1NotFill();
	})
	context.skip('Check footer', () => {
		it('[Privacy Policy] hyperlink active', () => {
			cy.contains('Privacy Policy')
				.click({force: true})
			cy.location('pathname')
				.should('eq', IBH_ROUTERS.POLICY_PRIVACY)
		})
		it('[Refund Policy] hyperlink active', () => {
			cy.contains('Money-back Policy')
				.click({force: true})
			cy.location('pathname')
				.should('eq', IBH_ROUTERS.POLICY_REFUND)
		})
		it('[Cookie Policy] hyperlink active', () => {
			cy.contains('Cookie Policy')
				.click({force: true})
			cy.location('pathname')
				.should('eq', IBH_ROUTERS.POLICY_COOKIE)
		})
		it('[Terms Of Use] hyperlink active', () => {
			cy.contains('Terms Of Use')
				.click({force: true})
			cy.location('pathname')
				.should('eq', IBH_ROUTERS.TERMS_AND_CONDITIONS)
		})
		it('[IBHelper.com] hyperlink active', () => {
			cy.contains('IBHelper.com')
				.click({force: true})
			cy.wait(3000)
				.location('pathname')
				.should('eq', '/')
		})
	})
	context('Order Preview', () => {
		it('Default status of collapse', () => {
			cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
				.should('have.class', 'active')
		})
		xit('Icon [^] active and change to [v] when click on it', () => {
			cy.get(orderFormPage.ARROW_UP_LAP)
				.click({force: true})
			cy.get(orderFormPage.ARROW_DOWN_LAP)
				.should('be.visible')
				.click({force: true})
				.get(orderFormPage.ARROW_UP_LAP)
				.should('be.visible')
		})
		it('Check display default fields & value', () => {
			cy.get(orderFormPage.ORDER_PREVIEW)
				.contains(Order.Academic)
				.should('be.visible')
		})
	})
	context('Additional', () => {
		it('Filled data should be returned to default values when page is reloaded.', () => {
			orderFormPage.fillStep1(getDataOrder());
			cy.wait(1000)
			cy.reload()
			cy.wait(3000);
			orderFormPage.verifyStep1NotFill();
		});
		it('Filled data should be reseted when navigation to Home page and returning', () => {
			orderFormPage.fillStep1(getDataOrder());
			cy.get(orderFormPage.BTN_LOGO)
				.click({force: true});
			cy.get(2000);
			cy.get(orderFormPage.BTN_ORDER_NOW)
				.contains('Order Now')
				.click({force: true});
			cy.wait(1000);
			orderFormPage.verifyStep1NotFill();
			cy.wait(1000);
		});
		it('Filled data should be saved when moving to the next step and returning by [Back] button', () => {
			orderFormPage.fillStep1(getDataOrder());
			orderFormPage.clickNextBTN();
			cy.get(orderFormPage.BTN_BACK)
				.click({force: true});
			orderFormPage.verifyStep1Filled(getDataOrder());
		})
		xit('Filled data should be saved when moving to the next step and returning by [Edit] button', () => {
			orderFormPage.fillStep1(getDataOrder());
			orderFormPage.clickNextBTN();
			cy.get(orderFormPage.BTN_BACK)
				.click({force: true});
			orderFormPage.verifyStep1NotFill();
		})
	})
})

