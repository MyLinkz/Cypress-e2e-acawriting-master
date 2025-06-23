import {CopyText, ErrorMessages, ExistEmail, WrongEmail} from "../../../../support/constants/defaultvalue"
import {faker} from "@faker-js/faker";
import {IBH_ROUTERS} from "../../../../support/constants/url";
import {
	PasswordLV0,
	TCForInvaildPassword,
	TCForInvalidEmail,
	TCForVaildPassword,
	ValidEmail
} from "../../../../support/constants/validate"
import orderFormPage, {orderType, StepOrderTitle} from "../../pages/orderFormPage";
import {dataOrder3} from "../../../../fixtures/data/orderForm";
import signinPage from "../../pages/signinPage";
import signupPage from "../../pages/signupPage"
import {capitalizeFirstLetter} from "../../../../support/utlis";

import {loadExcelData} from '../../../../support/excelHelper';

const fileName = "./data/DataOrderForm.xlsx";
const sheetName = "DataOF_IBH";
const dataID = 1;

Cypress.config('baseUrl', 'https://kamora:iamafriend@ibhelper.dev/');
describe("Order Step 0", {retries: 0}, () => {
	const dataOrder = dataOrder3;

	function getOrderType() {
		const dataOrderForm = Cypress.env('dataOrderForm');
		return dataOrderForm.ORDER_TYPE; // Trả ra giá trị ORDER_TYPE
	}

	function getDataOrder() {
		return Cypress.env('dataOrderForm'); // Trả ra giá trị ORDER_TYPE
	}

	beforeEach(function () {
		if (this.currentTest.title === '[Skip beforeEach]') {
			cy.log('Skipping beforeEach for Test 1');
			this.skip(); // Bỏ qua beforeEach cho test case này
		}
		cy.visit(IBH_ROUTERS.ORDER);
	})

	before(() => {
		loadExcelData(fileName, sheetName).then((data) => {
			cy.wrap(data).as('testData');
			cy.get('@testData').then((testData) => {
				const dataObject = testData[dataID - 1];  // dòng 2
				Cypress.env('dataOrderForm', dataObject);
			});
		});
	});

	context('Navigation', () => {
		it('Should navigate to the [Order Form] page by URL', () => {
			orderFormPage.verifyStepName(orderFormPage.NewStep0)
		})
		it('Should navigate to the [Order Form] page when going from another page', () => {
			cy.visit(IBH_ROUTERS.HOME);
			cy.wait(1000);
			orderFormPage.clickOrderNowBTN();
			cy.wait(1000);
			orderFormPage.verifyStepName(orderFormPage.NewStep0)
		})
	})
	it('Should navigate to the [Homepage] page when user clicks on logo', () => {
		cy.get(orderFormPage.BTN_LOGO)
			.click({force: true});
		cy.location("pathname")
			.should("eq", IBH_ROUTERS.HOME)
	})
	context('[Cancel] button', () => {
		beforeEach(function () {
			console.log("getOrderType(): ", getDataOrder());
			orderFormPage.clickOrderType(getOrderType());
			cy.get(orderFormPage.BTN_CANCEL)
				.click({force: true})
			cy.wait(1000)
		})
		it('Should show the [Cancel Confirm] slide up when click on it', () => {
			cy.get(orderFormPage.BTN_CANCEL)
				.click({force: true})
			cy.get(orderFormPage.SLD_CONF)
				.should('be.visible')
		})
		context('Close silde up', () => {
			it('Should close the [Cancel confirm] slide up when clicking on [x] icon', () => {
				orderFormPage.clickXBTNForm();
				orderFormPage.verifyOrderTypeActive(getOrderType());
			})
			it('Should close the [Cancel confirm] slide up when clicking out of the popup', () => {
				orderFormPage.clickXBTNForm();
				cy.get(orderFormPage.BACK_DROP).eq(0)
					.click({force: true})
				orderFormPage.verifyOrderTypeActive(getOrderType());
			})
		})
		it("Shouldn't reset data when user on the [Continue With Your Order] button", () => {
			orderFormPage.clickOrderType(getOrderType())
			cy.get(orderFormPage.BTN_CANCEL)
				.click({force: true})
			cy.get(orderFormPage.BTN_CONT)
				.click({force: true})
			orderFormPage.verifyOrderTypeActive(getOrderType());
		})
		it('Should reset data when user click on [Cancel Order] button', () => {
			//close silde and reset value
			cy.get(orderFormPage.BTN_CANCEL)
				.click({force: true});
			orderFormPage.clickXBTNForm();
			orderFormPage.verifyOrderTypeActive(getOrderType());
		})
	})
	it('Check title of step', () => {
		cy.get(orderFormPage.STEP_NAME)
			.should('have.text', orderFormPage.NewStep0);
	});
	context('Check footer', () => {
		it('[Money Back Policy] hyperlink active', () => {
			cy.contains('Money Back Policy')
				.click({force: true})
			cy.location('pathname')
				.should('eq', IBH_ROUTERS.POLICY_REFUND)
		})
		it('[Revision Policy] hyperlink active', () => {
			cy.contains('Revision Policy')
				.click({force: true})
			cy.location('pathname')
				.should('eq', IBH_ROUTERS.POLICY_REVISION)
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
			cy.location('pathname')
				.should('eq', '/')
		})
	})
	context('[Service type] radio button', () => {
		context("Click button and just it's active", () => {
			orderType.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
					orderFormPage.clickOrderType(CheckValue.toLowerCase());
					orderFormPage.verifyOrderTypeActive(CheckValue.toLowerCase());
				})
			})
		})
		context("Check the option is changed successfully", () => {
			orderType.forEach((CheckValue) => {
				it(`[Skip beforeEach] ${CheckValue}`, () => {
					signinPage.signInSuccess();
					cy.visit(IBH_ROUTERS.ORDER);
					cy.wait(2000)
					orderFormPage.clickOrderType(CheckValue.toLowerCase());
					cy.wait(1000)
					orderFormPage.clickGoBTN();
					cy.wait(1000)
					orderFormPage.verifyOrderType(CheckValue);
				})
			})
		})
		it("Default Value", () => {
			orderFormPage.verifyOrderTypeActive('writing');
		})
	})
	context('[Go] button', () => {
		it('[Skip beforeEach] Navigate to step 1', () => {
			signinPage.signInSuccess();
			cy.visit(IBH_ROUTERS.ORDER);
			orderFormPage.clickOrderType(getOrderType());
			orderFormPage.clickGoBTN();
			orderFormPage.verifyOrderType(capitalizeFirstLetter(getOrderType()));
		})
		it('Should display the Sign in/up slide', () => {
			orderFormPage.clickGoBTN();
			cy.get(orderFormPage.SLD_CONT)
				.should('be.visible')
		})

	})
	context.only('Tab New Customer', () => {
		beforeEach(function () {
			orderFormPage.clickGoBTN();
		})
		context("[Email] textbox", () => {
			it('Copy & Paste', () => {
				cy.document().then((doc) => cy.spy(doc, 'execCommand').as('execCommand'))
				cy.get(signinPage.TXT_EMAIL)
					.type(CopyText)
				cy.get(signinPage.TXT_EMAIL)
					.invoke('val')
					.then(($temp) => {
						const txt = $temp
						cy.get(signinPage.TXT_EMAIL)
							.focus()
						cy.document().invoke('execCommand', 'copy')
						cy.get(signinPage.TXT_EMAIL)
							.clear()
						cy.get(signinPage.TXT_EMAIL)
							.type(`${txt}`)
						cy.get(signinPage.TXT_EMAIL)
							.invoke('val')
							.should("contain", CopyText)
					})
			})
			context("Invalid Email:", function () {
				it("Leaving the field empty", () => {
					cy.get(signupPage.TXT_PASSWORD)
						.type("123123")
					signupPage.clickSubmitBTN();
					cy.get(signupPage.MES_ERROR)
						.should("contain", ErrorMessages.EmailRequired)
				})
				TCForInvalidEmail.forEach((value) => {
					it(`${value.description}`, () => {
						cy.get(signupPage.TXT_EMAIL)
							.type(`${value.email}`)
						cy.get(signupPage.TXT_PASSWORD)
							.type("123123")
						signupPage.clickSubmitBTN();
						cy.wait(2000)
						cy.get(signupPage.MES_ERROR)
							.eq(0)
							.should("contain", ErrorMessages.InvalidEmail)
					})
				})
			})
			context("Valid email", function () {
				ValidEmail.forEach((value) => {
					it(`Input email:` + ` ${value}`, () => {
						cy.get(signupPage.TXT_EMAIL)
							.type(`${value}`)
						cy.get(signupPage.TXT_PASSWORD)
							.type("123123")
						cy.get(signupPage.CHECKBOX)
							.click({force: true})
						signupPage.clickSubmitBTN();
						cy.wait(5000)
						cy.get(orderFormPage.STEP_NAME)
							.should('have.text', orderFormPage.NewStep1);
					})
				})
			})
		})
		context("Password Field", () => {
			it('Copy & Paste', () => {
				cy.document().then((doc) => cy.spy(doc, 'execCommand').as('execCommand'))
				cy.get(signupPage.TXT_PASSWORD)
					.type(CopyText)
				cy.get(signupPage.TXT_PASSWORD)
					.invoke('val')
					.then(($temp) => {
						// const txt = $temp
						const txt = $temp
						cy.get(signupPage.TXT_PASSWORD)
							.focus()
						cy.document()
							.invoke('execCommand', 'copy')
						cy.get(signupPage.TXT_PASSWORD)
							.clear()
						cy.get(signupPage.TXT_PASSWORD)
							.type(`${txt}`)
						cy.get(signupPage.TXT_PASSWORD)
							.invoke('val')
							.should("contain", CopyText)
					})
			})
			it("Password convert to '*'", () => {
				cy.get(signupPage.TXT_PASSWORD)
					.type(CopyText)
				cy.get(signupPage.TXT_PASSWORD)
					.should('have.attr', 'type', 'password')
			})
			context("Invailid Password", () => {
				TCForInvaildPassword.forEach((value) => {
					it(`${value.description}`, () => {
						cy.get(signupPage.TXT_EMAIL)
							.type(faker.internet.email(), {force: true})
						cy.get(signupPage.TXT_PASSWORD)
							.type(value.password, {force: true})
						signupPage.clickSubmitBTN();
						cy.wait(2000)
						cy.get(signupPage.MES_ERROR)
							.should("contain", `${ErrorMessages.PasswordLeast6}`)
					})
				})
			})
			context("Vailid Password", () => {
				it("Leave the password field empty", () => {
					cy.get(signupPage.TXT_EMAIL)
						.type(faker.internet.email())
					// .type('client-846-fake@kamora.vn');
					cy.get(signupPage.CHECKBOX)
						.click({force: true})
					signupPage.clickSubmitBTN();
					cy.wait(20000);
					cy.get(signupPage.MES_ERROR)
						.should("contain", ErrorMessages.PassRequired);
				})
				TCForVaildPassword.forEach((value) => {
					it(`${value.description}`, () => {
						cy.get(signupPage.TXT_EMAIL).type(faker.internet.email())
						cy.get(signupPage.TXT_PASSWORD).type(value.password)
						signupPage.clickSubmitBTN();
						cy.get(signupPage.CHECKBOX)
							.click({force: true})
						cy.wait(2000)
						cy.get(orderFormPage.STEP_NAME)
							.should('have.text', orderFormPage.NewStep1);
					})
				})
			})
		})
		it('Should be redirect to Step 1 by create a new account', () => {
			signinPage.signUpAtOrderForm();
			orderFormPage.verifyStepName(orderFormPage.NewStep1);
		})
		it('[Terms and Conditions] hyperLink active', () => {
			cy.contains('Terms and Conditions')
				.click({force: true})
			cy.location('pathname')
				.should('eq', IBH_ROUTERS.TERMS_AND_CONDITIONS)
		})
		it('[Privacy Policy] hyperLink active', () => {
			cy.contains('Privacy Policy')
				.click({force: true})
			cy.location('pathname')
				.should('eq', IBH_ROUTERS.POLICY_PRIVACY)
		})
		it('Sign up successfully if email contains white space before and after', () => {
			cy.get(signinPage.TXT_EMAIL)
				.type(`    ${faker.internet.email()}    `, {force: true})
			cy.get(signinPage.TXT_PASSWORD)
				.type(ExistEmail.password);
			cy.contains('button', 'Create Account')
				.click();
			cy.contains(orderFormPage.NewStep1)
				.should('be.visible')
		})
		context('[X] button', () => {
			beforeEach(function () {
				orderFormPage.clickOrderType('editing');
				orderFormPage.clickGoBTN();
			})
			it("Close [Request sign in/up] slide up when clicks on it", () => {
				orderFormPage.clickXBTNAuth();
				orderFormPage.verifyOrderTypeActive('editing');
			})
			it("Close [Request sign in/up] slide up when clicks on gray area", () => {
				orderFormPage.clickXBTNAuth();
				cy.get(orderFormPage.BACK_DROP).eq(1)
					.click({force: true})
				orderFormPage.verifyOrderTypeActive('editing');
			})
		})
	})
	const orderTypeA = 'rewriting';
	context.only('Tab Returned Customer', () => {
		beforeEach(function () {
			cy.wait(2000);
			orderFormPage.clickOrderType(orderTypeA);
			orderFormPage.clickGoBTN();
			cy.contains('Returned Customer')
				.click({force: true})
		})
		it('Sign in successfully', () => {
			cy.wait(2000);
			signinPage.signInAtOrderForm();
			cy.contains(StepOrderTitle.NewStep1)
				.should('be.visible');
		})
		context('Email Field', () => {
			it('Copy & Paste', () => {
				cy.document().then((doc) => cy.spy(doc, 'execCommand').as('execCommand'))
				cy.get(signinPage.TXT_EMAIL)
					.type(CopyText)
				cy.get(signinPage.TXT_EMAIL).invoke('val').then(($temp) => {
					const txt = $temp
					cy.get(signinPage.TXT_EMAIL)
						.focus()
					cy.document()
						.invoke('execCommand', 'copy')
					cy.get(signinPage.TXT_EMAIL)
						.clear()
					cy.get(signinPage.TXT_EMAIL)
						.type(`${txt}`)
					cy.get(signinPage.TXT_EMAIL)
						.invoke('val')
						.should("contain", CopyText)
				})
			})
			it("Leaving the field empty", () => {
				cy.get(signinPage.TXT_PASSWORD)
					.type("123123")
				cy.contains('button', 'Sign In')
					.click({force: true});
				cy.wait(1000)
				cy.get(signinPage.MES_ERROR)
					.should("contain", ErrorMessages.EmailRequired)
			})
			it("Wrong email", () => {
				cy.get(signinPage.TXT_EMAIL)
					.type(WrongEmail)
				cy.get(signinPage.TXT_PASSWORD)
					.type("123123")
				cy.contains('button', 'Sign In')
					.click({force: true});
				cy.wait(1000)
				cy.get(signinPage.MES_ERROR)
					.should("contain", ErrorMessages.WrongEmailorPass)
			})
			it("Invalid email", () => {
				cy.get(signinPage.TXT_EMAIL)
					.type(TCForInvalidEmail[0].email)
				cy.get(signinPage.TXT_PASSWORD)
					.type("123123")
				cy.contains('button', 'Sign In')
					.click({force: true});
				cy.wait(1000)
				cy.get(signinPage.MES_ERROR)
					.should("contain", ErrorMessages.WrongEmailorPass)
			})
			it("Input exist email", () => {
				cy.get(signinPage.TXT_EMAIL)
					.type(ExistEmail.email)
				cy.get(signinPage.TXT_PASSWORD)
					.type(ExistEmail.password)
				cy.contains('button', 'Sign In')
					.click({force: true});
				cy.wait(2000)
				cy.contains(StepOrderTitle.NewStep1)
					.should('be.visible')
			})
		})
		context("Password field", () => {
			it('Copy & Paste', () => {
				cy.document().then((doc) => cy.spy(doc, 'execCommand').as('execCommand'))
				cy.get(signinPage.TXT_PASSWORD)
					.type(CopyText)
				cy.get(signinPage.TXT_PASSWORD).invoke('val').then(($temp) => {
					const txt = $temp
					cy.get(signinPage.TXT_PASSWORD)
						.focus()
					cy.document().invoke('execCommand', 'copy')
					cy.get(signinPage.TXT_PASSWORD)
						.clear()
					cy.get(signinPage.TXT_PASSWORD)
						.type(`${txt}`)
					cy.get(signinPage.TXT_PASSWORD)
						.invoke('val')
						.should("contain", CopyText)
				})
			})
			it("Leaving the field empty", () => {
				cy.get(signinPage.TXT_EMAIL)
					.type(ExistEmail.email)
				cy.contains('button', 'Sign In')
					.click({force: true});
				cy.wait(1000)
				cy.get(signinPage.MES_ERROR)
					.should("contain", ErrorMessages.PassRequired)
			})
			it("Wrong Password", () => {
				cy.get(signinPage.TXT_EMAIL)
					.type(ExistEmail.email)
				cy.get(signinPage.TXT_PASSWORD)
					.type("Password")
				cy.contains('button', 'Sign In')
					.click({force: true});
				cy.wait(1000)
				cy.get(signinPage.MES_ERROR)
					.should("contain", ErrorMessages.WrongEmailorPass)
			})
			it("Invalid Password", () => {
				cy.get(signinPage.TXT_EMAIL)
					.type(ExistEmail.email)
				cy.get(signinPage.TXT_PASSWORD)
					.type(PasswordLV0[0].password)
				cy.contains('button', 'Sign In')
					.click({force: true});
				cy.wait(1000)
				cy.get(signinPage.MES_ERROR)
					.should("contain", ErrorMessages.PasswordLeast6)
			})
			it("Input correct email", () => {
				cy.get(signinPage.TXT_EMAIL)
					.type(ExistEmail.email)
				cy.get(signinPage.TXT_PASSWORD)
					.type(ExistEmail.password)
				cy.contains('button', 'Sign In')
					.click({force: true});
				cy.wait(2000)
				cy.contains(StepOrderTitle.NewStep2)
					.should('be.visible')
			})
		})
		context('[X] button', () => {
			it("Close [Request sign in/up] slide up when clicks on it", () => {
				cy.wait(1000);
				orderFormPage.clickXBTNAuth();
				orderFormPage.verifyOrderTypeActive(orderTypeA);
			})
			it("Close [Request sign in/up] slide up when clicks on gray area", () => {
				cy.get(orderFormPage.BACK_DROP).eq(1)
					.click({force: true})
				cy.wait(1000);
				orderFormPage.verifyOrderTypeActive(orderTypeA);
			})
		})
		it('Sign in successfully if email contains white space before and after', () => {
			cy.get(signinPage.TXT_EMAIL)
				.type(`    ${ExistEmail.email}    `, {force: true})
			cy.get(signinPage.TXT_PASSWORD)
				.type(ExistEmail.password);
			cy.contains('button', 'Sign In')
				.click();
			cy.contains(orderFormPage.NewStep1)
				.should('be.visible')
		})
	})
	context('Reset data', () => {
		context('Not signed in', () => {

			it('The [service type] should be reset to default values when page is reloaded.', () => {
				orderFormPage.clickOrderType(orderTypeA)
				cy.wait(1000);
				cy.reload();
				orderFormPage.verifyDefaultOrderType();
			});
			it('The [service type] should be reset when navigation to Home page and returning', () => {
				orderFormPage.clickOrderType(getOrderType());
				cy.get(orderFormPage.BTN_LOGO)
					.click({force: true});
				cy.wait(1000);
				orderFormPage.clickOrderNowBTN();
				cy.wait(1000);
				orderFormPage.verifyDefaultOrderType();
			})
			it('The [service type] should be reset when navigation to Home page and returning by [back] button of browser', () => {
				orderFormPage.clickOrderType(getOrderType());
				cy.get(orderFormPage.BTN_LOGO)
					.click({force: true});
				cy.wait(1000);
				cy.go('back');
				cy.wait(1000);
				cy.visit(IBH_ROUTERS.ORDER);
				cy.wait(2000);
				orderFormPage.verifyDefaultOrderType();
			})
			it('The [service type] should be reset when opening new tab and inputing URL', () => {
				orderFormPage.clickOrderType(getOrderType());
				cy.visit(IBH_ROUTERS.ORDER);
				cy.wait(1000);
				orderFormPage.verifyDefaultOrderType();
			})
		})
		context('Signed in', () => {
			beforeEach(function () {
				signinPage.signInSuccess();
				cy.visit(IBH_ROUTERS.ORDER);
			});

			function activeStep1() {
				orderFormPage.clickOrderType(orderTypeA)
				cy.wait(1000);
				orderFormPage.clickGoBTN();
				orderFormPage.clickBackBTN();
			}

			it('The [service type] should be reset to default values when page is reloaded.', () => {
				orderFormPage.clickOrderType(orderTypeA)
				cy.wait(1000);
				cy.reload();
				orderFormPage.verifyDefaultOrderType();
			});
			it('The [service type] should be reset when navigation to Home page and returning by buttons', () => {
				orderFormPage.clickOrderType(orderTypeA)
				cy.get(orderFormPage.BTN_LOGO)
					.click({force: true});
				cy.wait(1000);
				orderFormPage.clickOrderNowBTN();
				cy.wait(1000);
				orderFormPage.verifyDefaultOrderType();
			})
			it('The [service type] should be reset when navigation to Home page and returning', () => {
				orderFormPage.clickOrderType(orderTypeA)
				cy.get(orderFormPage.BTN_LOGO)
					.click({force: true});
				cy.wait(1000);
				orderFormPage.clickOrderNowBTN();
				cy.wait(1000);
				orderFormPage.verifyDefaultOrderType();
			})
			it('The [service type] should be saved when moving to the next step and returning by [Back] button', () => {
				activeStep1();
				orderFormPage.verifyOrderTypeActive(orderTypeA);
			});
			it('The [service type] should be saved when page is reloaded', () => {
				//Step 1 must be active
				activeStep1();
				cy.reload();
				orderFormPage.verifyOrderTypeActive(orderTypeA);
			})
			it('The [service type] should be saved when navigation to Home page and returning by buttons', () => {
				activeStep1();
				cy.get(orderFormPage.BTN_LOGO)
					.click({force: true});
				cy.wait(3000);
				orderFormPage.clickOrderNowBTN();
				orderFormPage.verifyOrderTypeActive(orderTypeA);
			})
			it('The [service type] should be saved when navigation to Home page and returning by [back] button of browser', () => {
				activeStep1();
				cy.get(orderFormPage.BTN_LOGO)
					.click({force: true});
				cy.go('back');
				orderFormPage.verifyOrderTypeActive(orderTypeA);
			})
			it('The [service type] should be reset when opening new tab and inputing URL', () => {
				orderFormPage.clickOrderType(orderTypeA)
				cy.visit(IBH_ROUTERS.ORDER);
				cy.wait(1000);
				orderFormPage.verifyDefaultOrderType();
			});
		})
	})
})
