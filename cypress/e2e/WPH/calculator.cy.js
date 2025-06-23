import {ROUTERS} from "../support/constants";
import LEVELS from '../../data/academic-levels.json';
import PRICES from '../../data/prices.json';
import DISCOUNT from '../../data/discount.json';
import URGENCIES from '../../data/urgencies.json';

describe('Calculator component', () => {
	beforeEach(() => {
		cy.visit(ROUTERS.PRICES_AND_DISCOUNTS);
	})

	it('pages value should be 1 as default', () => {
		cy.get('#num-of-page').should('have.text', 1);
	});

	it('increment pages by 1 when click plus button', () => {
		cy.get('#num-of-page').should('have.text', 1);
		cy.get('#increase-page').click({force: true});
		cy.get('#num-of-page').should('have.text', 2);
	});

	it('decrement pages by 1 when click minus button', () => {
		cy.get('#num-of-page').should('have.text', 1);
		cy.get('#increase-page').click({force: true});
		cy.get('#num-of-page').should('have.text', 2);
		cy.get('#decrease-page').click({force: true});
		cy.get('#num-of-page').should('have.text', 1);
	});

	it('should stop decrement pages when value is 1', () => {
		cy.get('#num-of-page').should('have.text', 1);
		for (let i = 0; i < 10; i++) {
			cy.get('#increase-page').click({force: true});
		}
		for (let i = 0; i < 15; i++) {
			cy.get('#decrease-page').click({force: true});
		}
		cy.get('#num-of-page').should('have.text', 1);
	});

	it('should increment pages by 1 every certain amount of milliseconds when holding plus button', () => {
		cy.get('#num-of-page').should('have.text', 1);
		cy.get('#increase-page')
			.trigger("mousedown", {force: true})
			.wait(1000)
			.trigger("mouseup", {force: true});
		cy.get('#num-of-page')
			.invoke('text')
			.then(parseInt)
			.should('eq', 6);
	});

	it('should decrement pages by 1 every certain amount of milliseconds when holding minus button', () => {
		cy.get('#num-of-page').should('have.text', 1);
		cy.get('#increase-page')
			.trigger("mousedown", {force: true})
			.wait(1000)
			.trigger("mouseup", {force: true});
		cy.get('#decrease-page')
			.trigger("mousedown", {force: true})
			.wait(1000)
			.trigger("mouseup", {force: true});
		cy.get('#num-of-page')
			.invoke('text')
			.then(parseInt)
			.should('eq', 6);
	});

	it('should navigate to order form when click button "Continue to Order" and order form should display correct selected input', () => {
		cy.setRandomInputValuesOnApprox();
		cy.get('.c-select__selected')
			.first()
			.invoke('text')
			.then(typeTitle => {
				cy.get('.c-select__selected')
					.eq(1)
					.invoke('text')
					.then(levelTitle => {
						cy.get('#num-of-page')
							.invoke('text')
							.then(pages => {
								cy.get('.deadline-selection__item.selected span')
									.invoke('text')
									.then(urgencyTitle => {
										cy.get('#service_order_submit').click({force: true});
										cy.url().should('eq', `https://writersperhour.dev/order`);
										cy.get('.el-spin').contains(levelTitle).should('have.class', 'active');
										cy.get("select[name='document_type']").find('option:selected').should('have.text', typeTitle);
									});
							});
					});
			});
	})

	it('should display correct total price before discount', () => {
		cy.setRandomInputValuesOnApprox();
		cy.get('.discount-container').should('not.have.class', 'discount-active');
		cy.get('.c-select__selected')
			.first()
			.invoke('text')
			.then(typeTitle => {
				cy.get('.c-select__selected')
					.eq(1)
					.invoke('text')
					.then(levelTitle => {
						cy.get('#num-of-page')
							.invoke('text')
							.then(pages => {
								cy.get('.deadline-selection__item.selected span')
									.invoke('text')
									.then(urgencyTitle => {
										const priceByLevelAndType = PRICES.find(price => (
											price.academic_level_id === LEVELS.find(level => level.title === levelTitle).id
											&& price.urgency === URGENCIES.find(urgency => urgency.title === urgencyTitle).urgency));
										const finalPrice = (parseFloat(priceByLevelAndType.price) * pages).toFixed(2);
										cy.get('#total').should('have.text', `$${finalPrice}`);
									});
							});
					});
			});
	})

	/* test case can fail because discount block can go missing between tests */
	it('should display correct total price after discount', () => {
		cy.setRandomInputValuesOnApprox();
		cy.get('#discount-btn').click({force: true});
		cy.get('.discount-container').should('have.class', 'discount-active');
		cy.get('.c-select__selected')
			.first()
			.invoke('text')
			.then(typeTitle => {
				cy.get('.c-select__selected')
					.eq(1)
					.invoke('text')
					.then(levelTitle => {
						cy.get('#num-of-page')
							.invoke('text')
							.then(pages => {
								cy.get('.deadline-selection__item.selected span')
									.invoke('text')
									.then(urgencyTitle => {
										const priceByLevelAndType = PRICES.find(price => (
											price.academic_level_id === LEVELS.find(level => level.title === levelTitle).id
											&& price.urgency === URGENCIES.find(urgency => urgency.title === urgencyTitle).urgency));
										const originPrice = (parseFloat(priceByLevelAndType.price) * pages).toFixed(2);
										const finalPrice = (originPrice * (1 - DISCOUNT.value / 100)).toFixed(2);
										cy.get('#total').should('have.text', `$${finalPrice}`);
										cy.get('#old-price-value').should('have.text', `$${originPrice}`);
									});
							});
					});
			});
	})
})
