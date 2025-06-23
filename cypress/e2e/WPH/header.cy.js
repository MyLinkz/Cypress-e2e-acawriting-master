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

	describe('on desktop screen', () => {
		beforeEach(() => {
			cy.viewport('macbook-15');
		})

		describe('should display correctly', () => {
			it('logo should display', () => {
				cy.get('a.p-header__logo').children('img').should('have.attr', 'src', '/media/logo.svg');
			})
			it('navigation items should display', () => {
				cy.get('.p-nav__list').children().should('have.length', navItems.length);

				navItems.forEach(item => {
					if (item.children) {
						cy.get('.p-nav__item .custom-dropdown__title')
							.contains(item.title)
							.should('have.length', 1);
						cy.get('.p-nav__item .custom-dropdown__title')
							.contains(item.title)
							.click();
						item.children.forEach(child => {
							cy.get('.custom-dropdown__menu-list')
								.contains(child.title)
								.should('have.length', 1);
						})
					} else {
						cy.get('.p-nav__item > a')
							.contains(item.title)
							.should('have.length', 1);
					}
				})
			});
			it('button "Sign in" should display', () => {
				cy.get('a.p-user-toolbar__a').should('have.text', 'Sign in');
			});
			it('button "Order Now" should display', () => {
				cy.get('a.p-header-btn__order').should('have.text', 'Order Now');
			});
		});

		describe('should navigate correctly', () => {
			it('click logo should redirect to home page', () => {
				cy.get('header > a.p-header__logo').click();
				cy.location('pathname').should('eq', ROUTERS.HOME);
			})
			it('nav item should have correct link', () => {
				navItems.forEach(item => {
					if (item.children) {
						cy.get('.p-nav__item .custom-dropdown__title')
							.contains(item.title)
							.click();
						item.children.forEach(child => {
							cy.get('.custom-dropdown__menu-list').contains(child.title).should('have.attr', 'href', child.path);
						})
					} else {
						cy.get('.p-nav__item > a').contains(item.title).should('have.attr', 'href', item.path);
					}
				})
			})
			it('click button "Sign in" should redirect to login page', () => {
				cy.get('a.p-user-toolbar__a').contains('Sign in').click();
				cy.location('pathname').should('eq', '/signin');
			})
			it('click button "Order Now" should redirect to order page', () => {
				cy.get('a.p-header-btn__order').contains('Order Now').click();
				cy.location('pathname').should('eq', '/order');
			})
		});

		describe.only('render certain components when authenticated', () => {
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

	/*describe('on mobile screen', () => {
		beforeEach(() => {
			cy.viewport('iphone-x');
		})
	})*/
})
