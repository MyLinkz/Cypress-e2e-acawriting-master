import { ROUTERS } from "../../../support/constants/url";
import { AcademicLevel, SubjectTypes, PaperTypes, ExistEmail, PaperFormat } from "../../../support/constants/defaultvalue";
import { faker } from "@faker-js/faker";
// import cypressConfig from "cypress-wait-until/cypress.config";
import Auth from "./getAuth"

class signin {
	TITLE = 'h1';
	TXT_PASSWORD = '[placeholder="Password"]';
	TXT_EMAIL = '[placeholder="Email"]';
	MES_ERROR = '.input-error';
	NUMBER_BALANCE = '.sc-4ae4f87d-2 > span';
	BTN_SUB = '.button-show';
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

	signInSuccess(email=null) {
		cy.visit(ROUTERS.SIGN_IN);
		if (email) {
			cy.get(this.TXT_EMAIL)
				.type(email, { force: true })
		}else {
			cy.get(this.TXT_EMAIL)
				.type(ExistEmail.email, { force: true })
		}
		cy.contains('button', 'Continue With Email')
			.click({ force: true });
		cy.get(this.TXT_PASSWORD)
			.type(ExistEmail.password)
		cy.get(this.BTN_SUB).eq(1)
			.click({ force: true });
		cy.wait(3000)
	}
	signInAtOrderForm() {
		cy.get(this.TXT_EMAIL)
			.type(ExistEmail.email);
		cy.get(this.TXT_PASSWORD)
			.type(ExistEmail.password);
		cy.contains('button', 'Sign In')
			.click({ force: true });
		cy.wait(2000)
	}

	signUpAtOrderForm() {
		cy.get(this.TXT_EMAIL)
			.type(faker.internet.email(), { force: true })
		cy.get(this.TXT_PASSWORD)
			.type(ExistEmail.password);
		cy.contains('button', 'Create Account')
			.click({ force: true });
		cy.wait(2000)
	}

	signInWithAnyAccount() {
		cy.get(this.TXT_EMAIL)
			.type(faker.internet.email(), { force: true })
		cy.contains('button', 'Continue With Email')
			.click({ force: true });
		cy.get(this.TXT_PASSWORD)
			.type(Cypress.env("BASIC_PASSWORD"))
		cy.contains('button', 'Sign In')
			.click({ force: true });
	}
	signInByToken(email, password) {
		Auth.getAuth(email, password);
	}
}

export default new signin();
