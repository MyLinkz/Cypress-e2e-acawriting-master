import {
	ErrorMessages,
	CopyText,
	ExistEmail,
	WrongEmail
} from "../../../support/constants/defaultvalue"
import { faker } from "@faker-js/faker";
import { ROUTERS } from "../../../support/constants/url";
import {
	TCForInvalidEmail, ValidEmail, PasswordLV0, TCForInvaildPassword, TCForVaildPassword
} from "../../../support/constants/validate"
import orderFormPage, { academicLevel, orderType, StepOrderTitle } from "../pages/orderFormPage";
import signInPage from "../pages/signinPage";
import signUpPage from "../pages/signupPage"
import { capitalizeFirstLetter } from "../../../support/utlis";

import { loadExcelData } from '../../../support/excelHelper';

const fileName = "./data/DataOrderForm.xlsx";
const sheetName = "Sheet1";
const dataID = 1;

describe("Order Step 0", { retries: 0 }, () => {
	function getOrderType() {
		const dataOrderForm = Cypress.env('dataOrderForm');
		return dataOrderForm.ORDER_TYPE; // Trả ra giá trị ORDER_TYPE
	}

	beforeEach(function () {
		if (this.currentTest.title === '[Skip beforeEach]') {
			cy.log('Skipping beforeEach for Test 1');
			this.skip(); // Bỏ qua beforeEach cho test case này
		}
		cy.visit(ROUTERS.ORDER);
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
			orderFormPage.verifyNavigate(ROUTERS.ORDER, orderFormPage.NewStep0)
		})
		it('Should navigate to the [Order Form] page when going from another page', () => {
			cy.visit(ROUTERS.HOME);
			cy.wait(1000);
			orderFormPage.clickOrderBTN();
			cy.wait(1000);
			orderFormPage.verifyNavigate(ROUTERS.ORDER, orderFormPage.NewStep0)
		})
	})
	it('Should navigate to the [Homepage] page when user clicks on logo', () => {
		cy.get(orderFormPage.BTN_LOGO)
			.click({ force: true });
		cy.location("pathname")
			.should("eq", ROUTERS.HOME)
	})
	context('[Cancel] button', () => {
		beforeEach(function () {
			orderFormPage.clickOrderType(getOrderType());
			cy.get(orderFormPage.BTN_CANCEL)
				.click({ force: true })
			cy.wait(1000)
		})
		it('Should show the [Cancel Confirm] slide up when click on it', () => {
			cy.get(orderFormPage.BTN_CANCEL)
				.click({ force: true })
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
					.click({ force: true })
				orderFormPage.verifyOrderTypeActive(getOrderType());
			})
		})
		it("Shouldn't reset data when user on the [Continue With Your Order] button", () => {
			orderFormPage.clickOrderType(getOrderType())
			cy.get(orderFormPage.BTN_CANCEL)
				.click({ force: true })
			cy.get(orderFormPage.BTN_CONT)
				.click({ force: true })
			orderFormPage.verifyOrderTypeActive(getOrderType());
		})
		it('Should reset data when user click on [Cancel Order] button', () => {
			//close silde and reset value
			cy.get(orderFormPage.BTN_CANCEL)
				.click({ force: true });
			orderFormPage.clickXBTNForm();
			orderFormPage.verifyOrderTypeActive(getOrderType());
		})
	})
	it('Check title of step', () => {
		cy.get(orderFormPage.STEP_NAME)
			.should('have.text', orderFormPage.NewStep0);
	});
	context('Check footer', () => {
		it('[Privacy Policy] hyperlink active', () => {
			cy.contains('Privacy Policy')
				.click({ force: true })
			cy.location('pathname')
				.should('eq', ROUTERS.POLICY_PRIVACY)
		})
		it('[Refund Policy] hyperlink active', () => {
			cy.contains('Money-back Policy')
				.click({ force: true })
			cy.location('pathname')
				.should('eq', ROUTERS.POLICY_REFUND)
		})
		it('[Cookie Policy] hyperlink active', () => {
			cy.contains('Cookie Policy')
				.click({ force: true })
			cy.location('pathname')
				.should('eq', ROUTERS.POLICY_COOKIE)
		})
		it('[Terms Of Use] hyperlink active', () => {
			cy.contains('Terms Of Use')
				.click({ force: true })
			cy.location('pathname')
				.should('eq', ROUTERS.TERMS_AND_CONDITIONS)
		})
		it('[WritersPerHour.com] hyperlink active', () => {
			cy.contains('WritersPerHour.com')
				.click({ force: true })
			cy.wait(3000)
				.location('pathname')
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
					signInPage.signInByToken(ExistEmail.email, ExistEmail.password);
					cy.visit(ROUTERS.ORDER);
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
			signInPage.signInSuccess();
			cy.visit(ROUTERS.ORDER);
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
	context('Tab New Customer', () => {
		beforeEach(function () {
			orderFormPage.clickGoBTN();
		})
		context("[Email] textbox", () => {
			it('Copy & Paste', () => {
				cy.document().then((doc) => cy.spy(doc, 'execCommand').as('execCommand'))
				cy.get(signInPage.TXT_EMAIL)
					.type(CopyText)
				cy.get(signInPage.TXT_EMAIL)
					.invoke('val')
					.then(($temp) => {
						const txt = $temp
						cy.get(signInPage.TXT_EMAIL)
							.focus()
						cy.document().invoke('execCommand', 'copy')
						cy.get(signInPage.TXT_EMAIL)
							.clear()
						cy.get(signInPage.TXT_EMAIL)
							.type(`${txt}`)
						cy.get(signInPage.TXT_EMAIL)
							.invoke('val')
							.should("contain", CopyText)
					})
			})
			context("Invaild Email:", function () {
				it("Leaving the field empty", () => {
					cy.get(signUpPage.TXT_PASSWORD)
						.type("123123")
					signUpPage.clickSubmitBTN();
					cy.get(signUpPage.MES_ERROR)
						.should("contain", ErrorMessages.EmailRequired)
				})
				TCForInvalidEmail.forEach((value) => {
					it(`${value.description}`, () => {
						cy.get(signUpPage.TXT_EMAIL)
							.type(`${value.email}`)
						cy.get(signUpPage.TXT_PASSWORD)
							.type("123123")
						signUpPage.clickSubmitBTN();
						cy.wait(2000)
						cy.get(signUpPage.MES_ERROR)
							.eq(0)
							.should("contain", ErrorMessages.InvalidEmail)
					})
				})
			})
			context("Valid email", function () {
				ValidEmail.forEach((value) => {
					it(`Input email:` + ` ${value}`, () => {
						cy.get(signUpPage.TXT_EMAIL)
							.type(`${value}`)
						cy.get(signUpPage.TXT_PASSWORD)
							.type("123123")
						cy.get(signUpPage.CHECKBOX)
							.click({ force: true })
						signUpPage.clickSubmitBTN();
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
				cy.get(signUpPage.TXT_PASSWORD)
					.type(CopyText)
				cy.get(signUpPage.TXT_PASSWORD)
					.invoke('val')
					.then(($temp) => {
						// const txt = $temp
						const txt = $temp
						cy.get(signUpPage.TXT_PASSWORD)
							.focus()
						cy.document()
							.invoke('execCommand', 'copy')
						cy.get(signUpPage.TXT_PASSWORD)
							.clear()
						cy.get(signUpPage.TXT_PASSWORD)
							.type(`${txt}`)
						cy.get(signUpPage.TXT_PASSWORD)
							.invoke('val')
							.should("contain", CopyText)
					})
			})
			it("Password convert to '*'", () => {
				cy.get(signUpPage.TXT_PASSWORD)
					.type(CopyText)
				cy.get(signUpPage.TXT_PASSWORD)
					.should('have.attr', 'type', 'password')
			})
			context("Invailid Password", () => {
				TCForInvaildPassword.forEach((value) => {
					it(`${value.description}`, () => {
						cy.get(signUpPage.TXT_EMAIL)
							.type(faker.internet.email(), { force: true })
						cy.get(signUpPage.TXT_PASSWORD)
							.type(value.password, { force: true })
						signUpPage.clickSubmitBTN();
						cy.wait(2000)
						cy.get(signUpPage.MES_ERROR)
							.should("contain", `${ErrorMessages.PasswordLeast6}`)
					})
				})
			})
			context("Vailid Password", () => {
				it("Leave the password field empty", () => {
					cy.get(signUpPage.TXT_EMAIL)
						.type(faker.internet.email())
						// .type('client-846-fake@kamora.vn');
					cy.get(signUpPage.CHECKBOX)
						.click({ force: true })
					signUpPage.clickSubmitBTN();
					cy.wait(20000);
					cy.get(signUpPage.MES_ERROR)
						.should("contain", ErrorMessages.PassRequired);
				})
				TCForVaildPassword.forEach((value) => {
					it(`${value.description}`, () => {
						cy.get(signUpPage.TXT_EMAIL).type(faker.internet.email())
						cy.get(signUpPage.TXT_PASSWORD).type(value.password)
						signUpPage.clickSubmitBTN();
						cy.get(signUpPage.CHECKBOX)
							.click({ force: true })
						cy.wait(2000)
						cy.get(orderFormPage.STEP_NAME)
							.should('have.text', orderFormPage.NewStep1);
					})
				})
			})
		})
		it('Should be redirect to Step 1 by create a new account', () => {
			signInPage.signUpAtOrderForm();
			cy.get('.title').should('have.text', StepOrderTitle.NewStep1);
		})
		it('[Terms and Conditions] hyperLink active', () => {
			cy.contains('Terms and Conditions')
				.click({ force: true })
			cy.location('pathname')
				.should('eq', ROUTERS.TERMS_AND_CONDITIONS)
		})
		it('[Privacy Policy] hyperLink active', () => {
			cy.contains('Privacy Policy')
				.click({ force: true })
			cy.location('pathname')
				.should('eq', ROUTERS.POLICY_PRIVACY)
		})
		it('Sign up successfully if email contains white space before and after', () => {
			cy.get(signInPage.TXT_EMAIL)
				.type(`    ${faker.internet.email()}    `, { force: true })
			cy.get(signInPage.TXT_PASSWORD)
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
				cy.get(orderFormPage.BACK_DROP).eq(0)
					.click({ force: true })
				orderFormPage.verifyOrderTypeActive('editing');
			})
		})
	})
	const orderTypeA = 'rewriting';
	context('Tab Returned Customer', () => {

		beforeEach(function () {
			cy.wait(2000);
			orderFormPage.clickOrderType(orderTypeA);
			orderFormPage.clickGoBTN();
			cy.contains('Returned Customer')
				.click({ force: true })
		})
		it('Sign In succesfully', () => {
			cy.wait(2000);
			signInPage.signInAtOrderForm();
			cy.contains(StepOrderTitle.NewStep1)
				.should('be.visible');
		})
		context('Email Field', () => {
			it('Copy & Paste', () => {
				cy.document().then((doc) => cy.spy(doc, 'execCommand').as('execCommand'))
				cy.get(signInPage.TXT_EMAIL)
					.type(CopyText)
				cy.get(signInPage.TXT_EMAIL).invoke('val').then(($temp) => {
					const txt = $temp
					cy.get(signInPage.TXT_EMAIL)
						.focus()
					cy.document()
						.invoke('execCommand', 'copy')
					cy.get(signInPage.TXT_EMAIL)
						.clear()
					cy.get(signInPage.TXT_EMAIL)
						.type(`${txt}`)
					cy.get(signInPage.TXT_EMAIL)
						.invoke('val')
						.should("contain", CopyText)
				})
			})
			it("Leaving the field empty", () => {
				cy.get(signInPage.TXT_PASSWORD)
					.type("123123")
				cy.contains('button', 'Sign In')
					.click({ force: true });
				cy.wait(1000)
				cy.get(signInPage.MES_ERROR)
					.should("contain", ErrorMessages.EmailRequired)
			})
			it("Wrong email", () => {
				cy.get(signInPage.TXT_EMAIL)
					.type(WrongEmail)
				cy.get(signInPage.TXT_PASSWORD)
					.type("123123")
				cy.contains('button', 'Sign In')
					.click({ force: true });
				cy.wait(1000)
				cy.get(signInPage.MES_ERROR)
					.should("contain", ErrorMessages.WrongEmailorPass)
			})
			it("Invalid email", () => {
				cy.get(signInPage.TXT_EMAIL)
					.type(TCForInvalidEmail[0].email)
				cy.get(signInPage.TXT_PASSWORD)
					.type("123123")
				cy.contains('button', 'Sign In')
					.click({ force: true });
				cy.wait(1000)
				cy.get(signInPage.MES_ERROR)
					.should("contain", ErrorMessages.InvalidEmail)
			})
			it("Input exist email", () => {
				cy.get(signInPage.TXT_EMAIL)
					.type(ExistEmail.email)
				cy.get(signInPage.TXT_PASSWORD)
					.type(ExistEmail.password)
				cy.contains('button', 'Sign In')
					.click({ force: true });
				cy.wait(2000)
				cy.contains(StepOrderTitle.NewStep1)
					.should('be.visible')
			})
		})
		context("Password field", () => {
			it('Copy & Paste', () => {
				cy.document().then((doc) => cy.spy(doc, 'execCommand').as('execCommand'))
				cy.get(signInPage.TXT_PASSWORD)
					.type(CopyText)
				cy.get(signInPage.TXT_PASSWORD).invoke('val').then(($temp) => {
					const txt = $temp
					cy.get(signInPage.TXT_PASSWORD)
						.focus()
					cy.document().invoke('execCommand', 'copy')
					cy.get(signInPage.TXT_PASSWORD)
						.clear()
					cy.get(signInPage.TXT_PASSWORD)
						.type(`${txt}`)
					cy.get(signInPage.TXT_PASSWORD)
						.invoke('val')
						.should("contain", CopyText)
				})
			})
			it("Leaving the field empty", () => {
				cy.get(signInPage.TXT_EMAIL)
					.type(ExistEmail.email)
				cy.contains('button', 'Sign In')
					.click({ force: true });
				cy.wait(1000)
				cy.get(signInPage.MES_ERROR)
					.should("contain", ErrorMessages.PassRequired)
				// .contains("The password field is required.")
				// .should('')
			})
			it("Wrong Password", () => {
				cy.get(signInPage.TXT_EMAIL)
					.type(ExistEmail.email)
				cy.get(signInPage.TXT_PASSWORD)
					.type("Password")
				cy.contains('button', 'Sign In')
					.click({ force: true });
				cy.wait(1000)
				cy.get(signInPage.MES_ERROR)
					.should("contain", ErrorMessages.WrongEmailorPass)
			})
			it("Invalid Password", () => {
				cy.get(signInPage.TXT_EMAIL)
					.type(ExistEmail.email)
				cy.get(signInPage.TXT_PASSWORD)
					.type(PasswordLV0[0].password)
				cy.contains('button', 'Sign In')
					.click({ force: true });
				cy.wait(1000)
				cy.get(signInPage.MES_ERROR)
					.should("contain", ErrorMessages.PasswordLeast6)
			})
			it("Input correct email", () => {
				cy.get(signInPage.TXT_EMAIL)
					.type(ExistEmail.email)
				cy.get(signInPage.TXT_PASSWORD)
					.type(ExistEmail.password)
				cy.contains('button', 'Sign In')
					.click({ force: true });
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
				cy.get(orderFormPage.BACK_DROP).eq(0)
					.click({ force: true });
				cy.wait(1000);
				orderFormPage.verifyOrderTypeActive(orderTypeA);

			})
		})
		it('Sign in successfully if email contains white space before and after', () => {
			cy.get(signInPage.TXT_EMAIL)
				.type(`    ${ExistEmail.email}    `, { force: true })
			cy.get(signInPage.TXT_PASSWORD)
				.type(ExistEmail.password);
			cy.contains('button', 'Sign In')
				.click();
			cy.contains(orderFormPage.NewStep1)
				.should('be.visible')
		})
	})
	context('Reset data', () => {
		context('Not signed in', () => {
			it('The [service type] should be rested to default values when page is reloaded.', () => {
				orderFormPage.clickOrderType(orderTypeA)
				cy.wait(1000);
				cy.reload();
				orderFormPage.verifyDefaultOrderType();
			});
			it('The [service type] should be rested when navigation to Home page and returning', () => {
				orderFormPage.clickOrderType(getOrderType());
				cy.get(orderFormPage.BTN_LOGO)
					.click({ force: true });
				cy.wait(1000);
				orderFormPage.clickOrderBTN();
				cy.wait(1000);
				orderFormPage.verifyDefaultOrderType();
			})
			it('The [service type] should be reseted when navigation to Home page and returning by [back] button of browser', () => {
				orderFormPage.clickOrderType(getOrderType());
				cy.get(orderFormPage.BTN_LOGO)
					.click({ force: true });
				cy.wait(1000);
				cy.go('back');
				cy.wait(1000);
				orderFormPage.verifyDefaultOrderType();
			})
			it('The [service type] should be reseted when opening new tab and inputing URL', () => {
				orderFormPage.clickOrderType(getOrderType());
				cy.visit(ROUTERS.ORDER);
				cy.wait(1000);
				orderFormPage.verifyDefaultOrderType();
			})
		})
		context('Signed in', () => {
			beforeEach(function () {
				signInPage.signInSuccess();
				cy.visit(ROUTERS.ORDER);
			});
			it('The [service type] should be rested to default values when page is reloaded.', () => {
				orderFormPage.clickOrderType(orderTypeA)
				cy.wait(1000);
				cy.reload();
				orderFormPage.verifyDefaultOrderType();
			});
			it('The [service type] should be reseted when navigation to Home page and returning by buttons', () => {
				orderFormPage.clickOrderType(orderTypeA)
				cy.get(orderFormPage.BTN_LOGO)
					.click({ force: true });
				cy.wait(1000);
				orderFormPage.clickOrderBTN();
				cy.wait(1000);
				orderFormPage.verifyDefaultOrderType();
			})
			it('The [service type] should be rested when navigation to Home page and returning', () => {
				orderFormPage.clickOrderType(orderTypeA)
				cy.get(orderFormPage.BTN_LOGO)
					.click({ force: true });
				cy.wait(1000);
				orderFormPage.clickOrderBTN();
				cy.wait(1000);
				orderFormPage.verifyDefaultOrderType();
			})
			it('The [service type] should be reseted when opening new tab and inputing URL', () => {
				orderFormPage.clickOrderType(orderTypeA)
				cy.visit(ROUTERS.ORDER);
				cy.wait(1000);
				orderFormPage.verifyDefaultOrderType();
			});
			function activeStep1() {
				orderFormPage.clickOrderType(orderTypeA)
				cy.wait(1000);
				orderFormPage.clickGoBTN();
				orderFormPage.clickBackBTN();
			}
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
					.click({ force: true });
				orderFormPage.clickOrderBTN()
					.click({ force: true });
				orderFormPage.verifyOrderTypeActive(orderTypeA);
			})
			it('The [service type] should be saved when navigation to Home page and returning by [back] button of browser',()=>{
				activeStep1();
				cy.get(orderFormPage.BTN_LOGO)
					.click({ force: true });
				cy.go('back');
				orderFormPage.verifyOrderTypeActive(orderTypeA);
			})
		})
	})
})
