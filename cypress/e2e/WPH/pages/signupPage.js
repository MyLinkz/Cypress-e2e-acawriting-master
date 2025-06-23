class signup {
	TXT_EMAIL = '[placeholder="Email"]';
	TXT_PASSWORD = '[placeholder="Password"]';
	TXT_FULLNAME = '[placeholder="Full Name"]';
	BTN_SUB = '.sc-9c808300-0';
	MES_ERROR = '[class="text-error"]';
	CHECKBOX = '[class="label-checkbox"]';
	NUMBER_BALANCE = '.sc-414a7f22-2.iAleEd.p-balance > span';
	PASSWORD_STRENG = '.pass-progress__item'

	clickSubmitBTN() {
		cy.contains('button', 'Create Account')
		.click()
		// .click()
			.click({force: true});
	}
}

export default new signup();
