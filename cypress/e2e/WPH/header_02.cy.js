import {ROUTERS} from "../support/constants";

const navItems = [
	{
		title: 'Our Writers',
		children: [
			{title: 'Essay Writers', path: ROUTERS.ESSAY_WRITERS},
			{title: 'IB Writers', path: ROUTERS.IB_WRITERS}
		]
	},
	{title: 'How It Works', path: ROUTERS.HOW_IT_WORKS},
	{title: 'Prices & Discounts', path: ROUTERS.PRICES_AND_DISCOUNTS},
	{title: 'Samples', path: ROUTERS.SAMPLES},
	{
		title: 'About Us',
		children: [
			{title: 'Help Center', path: ROUTERS.HELP},
			{title: 'Blogs', path: ROUTERS.BLOG},
			{title: 'Contacts', path: ROUTERS.CONTACTS},
			{title: 'Reviews & Testimonials', path: ROUTERS.TESTIMONIALS},
			{title: 'About WPH', path: ROUTERS.ABOUT}
		]
	}
]

describe('Header component', () => {
	beforeEach(() => {
		cy.visit(ROUTERS.HOME);
	})

	describe.only('should navigate correctly when click on header item link', () => {
		beforeEach(() => {
			cy.viewport('macbook-15');
		})
		Cypress._.times(20, () => {
			it.only('click button "Sign in" should redirect to login page', () => {
				cy.get('a.p-user-toolbar__a').contains('Sign in').click();
				cy.location('pathname').should('eq', ROUTERS.SIGN_IN);
				cy.get('h1').should('have.text', 'SIGN IN');
				cy.get('a.signin__link').should('have.text', 'Sign Up');
				cy.wait(1000);
			})
		})
		it('click button "Order Now" should redirect to order page', () => {
			cy.get('a.p-header-btn__order').contains('Order Now').click();
			cy.location('pathname').should('eq', '/order');
		})
	});

	describe('render certain components when authenticated', () => {
		beforeEach(() => {
			cy.login();
			cy.visit(ROUTERS.HOME);
		})

		it('should display internal wallet', () => {
			cy.get('.p-header-btn__group .p-balance').contains('Balance$').should('have.length', 1);
		})
		it('should display notification', () => {
			cy.get('.p-header-btn__group .p-notification img').should('have.attr', 'alt', 'icon bell');
		})
		it('should display avatar', () => {
			cy.get('.p-header-btn__group .p-user-toolbar__btn > img').should('have.attr', 'alt', 'avatar');
		})
	})
})
