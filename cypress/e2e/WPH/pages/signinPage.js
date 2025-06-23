import { ROUTERS } from "../../../support/constants/url";
import { AcademicLevel, SubjectTypes, PaperTypes, ExistEmail, PaperFormat } from "../../../support/constants/defaultvalue";
import orderFormPage from "./orderFormPage";
import { LOCATE_SIGNUP } from "../../../support/constants/locate";
import { ValidEmail } from "../../../support/constants/validate";
import { faker } from "@faker-js/faker";
// import cypressConfig from "cypress-wait-until/cypress.config";
import Auth from "../../../getData/WPH/getAuth"

class signin {
	TITLE = 'h1';
	TXT_PASSWORD = '[placeholder="Password"]';
	TXT_EMAIL = '[placeholder="Email"]';
	MES_ERROR = '[class="text-error"]';
	NUMBER_BALANCE = '.sc-4ae4f87d-2 > span';
	BTN_SUB = '.sc-b87e219c-0';
	CHECKBOX = '.label-checkbox'

	getTitle(TITLE) {
		cy.get(this.TITLE)
	}

	verifyLocate() {
		cy.location("pathname")
			.should("eq", ROUTERS.SIGN_IN)
	}

	typeEmail(email) {
		return cy.get(this.TXT_EMAIL).type(email)
	}

	typePassword(pass) {
		return cy.get(this.TXT_PASSWORD).type(pass)
	}

	signInSuccess() {
		cy.visit(ROUTERS.SIGN_IN);
		cy.get(this.TXT_EMAIL)
			// .type('kamoratest2@gmail.com');
			.type(ExistEmail.email);
		cy.get(this.TXT_PASSWORD)
			.type(ExistEmail.password);
		cy.contains('button', 'Continue With Email')
		// cy.contains('button', 'Sign in')
			.click({ force: true });
		cy.verifylocate(ROUTERS.HOME);
		cy.wait(2000)
	}
	signInAtOrderForm() {
		cy.get(this.TXT_EMAIL)
			.type(ExistEmail.email);
		cy.get(this.TXT_PASSWORD)
			.type(ExistEmail.password);
		cy.contains('button', 'Sign In')
			.click();
		cy.wait(2000)
	}

	signUpAtOrderForm() {
		cy.get(this.TXT_EMAIL)
			.type(faker.internet.email(), { force: true })
		cy.get(this.TXT_PASSWORD)
			.type(ExistEmail.password);
		cy.contains('button', 'Create Account')
			.click();
		cy.wait(2000)
	}

	signInWithAnyAccount() {
		cy.get(this.TXT_EMAIL)
			.type(faker.internet.email(), { force: true })
		cy.get(this.TXT_PASSWORD)
			.type(Cypress.env("BASIC_PASSWORD"))
		cy.contains('button', 'Sign In')
			.click({ force: true });
	}
	signInByToken(email,password){
		Auth.getAuth(email, password);
	}
}

export default new signin();
