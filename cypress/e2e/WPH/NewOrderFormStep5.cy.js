// https://docs.google.com/spreadsheets/d/19Knmyxh26B4wYwJcTvxwRQkVIHzEilkQdaaHmwQ-76Q/edit#gid=1173477861
import signinPage from "./pages/signinPage";

Cypress.on('uncaught:exception', (err, runnable) => {
	// returning false here prevents Cypress from
	// failing the test
	return false
})
Cypress.config('defaultCommandTimeout', 10000); // 10 giây

// import 'cypress-wait-until';
import {
	AcademicLevel, PaperFormat, CopyText,
	PaperTypes, SubjectTypes,
	StepOrderTitle, CommomTextbox, Deadline,
	Extra, DiscountCode, ErrorMessages, ExistEmail, PaymentAccount
} from "../../support/constants/defaultvalue"
import {ShowValue, GotoStep5WithAccountHaveMoney, PaymentByPaypal} from '../../support/utlis';
import {ROUTERS} from '../../support/constants/url';
import orderFormPage from "./pages/orderFormPage";

describe("Step 5", () => {
		const maxRetries = 5;
		let retryCount = 0;
		beforeEach(function () {
			// if (Cypress.mocha.getRunner().suite.ctx.currentTest.title.includes('[Skip beforeEach]')) {
			// 	return;
			// } else {
			// 	let retryCount = 0;
			// 	const maxRetries = 5;
			cy.wrap(null).then(() => {
				// Bắt đầu logic chính của bạn
				signinPage.signInSuccess();
				cy.contains('Order Now').click({force: true});
				orderFormPage.fillStep1();
				cy.get(orderFormPage.BTN_NEXT).click({force: true});
				cy.wait(2000)

				cy.get(orderFormPage.TXT_TITLE).type(CopyText);
				cy.get(orderFormPage.TXT_INSTRUCTIONS).type(CommomTextbox.Letter).click({force: true});
				cy.get(orderFormPage.BTN_NEXT).click({force: true});

				cy.get(orderFormPage.SEL_DEADLINE).contains(Deadline[1]).click();
				cy.get(orderFormPage.SEL_SPACING).find('button:not(.active)').click({force: true});
				cy.get(orderFormPage.BTN_NEXT).click({force: true});

				cy.get(orderFormPage.ORDER_INPUT).contains(Extra[2].id).click({force: true});
				cy.get(orderFormPage.BTN_NEXT).click({force: true});

			});
		})
		it('Check title of step', () => {
			cy.contains(StepOrderTitle.NewStep5)
				.should('be.visible')
		})
		context('Payment menthod', () => {
			it('Default menthod', () => {
				cy.contains('PayPal')
					.parent()
					.should('have.class', 'card-active')
					.siblings()
					.should('not.have.class', 'card-active')
			})
			it('Credit card is active', () => {
				cy.contains('Credit Card')
					.click({force: true})
					.parent()
					.should('have.class', 'card-active')
					.siblings()
					.should('not.have.class', 'card-active')
			})
			it('PayPal is active', () => {
				cy.contains('PayPal')
					.click({force: true})
					.parent()
					.should('have.class', 'card-active')
					.siblings()
					.should('not.have.class', 'card-active')
			})
		})
		context('Summary (Preview)', () => {
			context('[Total] field', () => {
				it('Have [Extra]', () => {
					ShowValue({
						callback: (value) => {
							cy.get(orderFormPage.ORDER_PREVIEW)
								.contains('Total')
								.siblings()
								.should('contain', `$${value.PriceFix}`)
						}
					})
				})
				it('Not have [Extra]', () => {
					ShowValue({
						callback: (value) => {
							cy.get(orderFormPage.BTN_BACK)
								.click({force: true})
							cy.get(orderFormPage.ORDER_INPUT)
								.contains(Extra[0].id)
								.click({force: true})
							cy.get(orderFormPage.BTN_NEXT)
								.click({force: true})
							cy.get(orderFormPage.ORDER_PREVIEW)
								.contains('Total')
								.siblings()
								.should('contain', `$${value.PriceFix}`)
						}
					})
				})
			})
			context('[Writer Category] field', () => {
				Extra.forEach(($item) => {
					if ($item.value === 0) {
						it(`Not display incase Writer = ${$item.id}`, () => {
							cy.get(orderFormPage.BTN_BACK)
								.click({force: true})
							cy.get(orderFormPage.ORDER_INPUT)
								.contains(Extra[0].id)
								.click({force: true})
							cy.get(orderFormPage.BTN_NEXT)
								.click({force: true})
							ShowValue({
								callback: (value) => {
									if (value.ExtraFix == 0) {
										cy.get(orderFormPage.ORDER_PREVIEW_PRICE)
											.should('not.contain', value.ExtraFix)
									} else {
										expect(false).to.be.true;
									}
								}
							})
						})
					} else {
						it(`Not display incase Writer = ${$item.id}`, () => {
							cy.get(orderFormPage.BTN_BACK)
								.click({force: true})
							cy.get(orderFormPage.ORDER_INPUT)
								.contains($item.id)
								.click({force: true})
							cy.get(orderFormPage.BTN_NEXT)
								.click({force: true})
							ShowValue({
								callback: (value) => {
									cy.get(orderFormPage.ORDER_PREVIEW_PRICE)
										.contains('Extras')
										.siblings()
										.should('have.text', `$${value.ExtraFix}`)
								}
							})
						})
					}
				})
			})
			context('[Discount code] textbox', () => {
				it('Input valid code', () => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.within(() => {
							cy.get(orderFormPage.TXT_DISCOUNT)
								.type(`${DiscountCode[0].value}`)
						})
					cy.get(orderFormPage.BTN_APPLY)
						.click({force: true})
					cy.wait(4000)
					ShowValue({
						callback: (value) => {
							cy.get(orderFormPage.ORDER_PREVIEW_PRICE)
								.contains('Discount')
								.parent()
								.siblings()
								.should('have.text', `$${value.DiscountFix}`)
						}
					})
				})
				it('Invalid code', () => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.within(() => {
							cy.get(orderFormPage.TXT_DISCOUNT)
								.type(`${DiscountCode[1].value}`)
							cy.get(orderFormPage.BTN_APPLY)
								.click({force: true})
							cy.wait(4000)
							cy.contains(ErrorMessages.InvalidCode)
								.should('be.visible')
						})
				})
				it('Code is expired or not appreciable', () => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.within(() => {
							cy.get(orderFormPage.TXT_DISCOUNT)
								.type(`${DiscountCode[2].value}`)
							cy.get(orderFormPage.BTN_APPLY)
								.click({force: true})
							cy.wait(4000)
							cy.contains(ErrorMessages.ExpiredCode)
								.should('be.visible')
						})
				})
				it('[Apply] button is disable incase empty textbox', () => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.within(() => {
							cy.get(orderFormPage.TXT_DISCOUNT)
								.clear()
							cy.get(orderFormPage.BTN_APPLY)
								.should('be.disabled')
						})
				})
				it('Edit code successfully', () => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.within(() => {
							cy.get(orderFormPage.TXT_DISCOUNT)
								.type(`${DiscountCode[0].value}`)
							cy.contains('Apply')
								.click({force: true})
							cy.wait(4000)
						})
					ShowValue({
						callback: (value) => {
							cy.get(orderFormPage.ORDER_PREVIEW_PRICE)
								.contains('Discount')
								.parent()
								.siblings()
								.should('have.text', `$${value.DiscountFix}`)
						}
					})
					cy.get(orderFormPage.ORDER_PREVIEW)
						.within(() => {
							cy.get(orderFormPage.TXT_DISCOUNT)
								.should('not.exist')
						})

					cy.get(orderFormPage.ORDER_PREVIEW)
						.within(() => {
							cy.get(orderFormPage.BTN_EDIT)
								.click({force: true})
							cy.get(orderFormPage.TXT_DISCOUNT)
								.should('exist')
							cy.get(orderFormPage.TXT_DISCOUNT)
								.type(`${DiscountCode[3].value}`)

						})
					cy.contains('Apply')
						.click({force: true})
					cy.wait(4000)
					ShowValue({
						callback: (value) => {
							cy.get(orderFormPage.ORDER_PREVIEW_PRICE)
								.contains('Discount')
								.parent()
								.siblings()
								.should('have.text', `$${value.DiscountFix}`)
						}
					})
					cy.get(orderFormPage.ORDER_PREVIEW)
						.within(() => {
							cy.contains(DiscountCode[0].value)
								.should('not.exist')
						})
				})
				it('Edit to invalid code', () => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.within(() => {
							cy.get(orderFormPage.TXT_DISCOUNT)
								.type(`${DiscountCode[0].value}`)
							cy.contains('Apply')
								.click({force: true})
							cy.wait(4000)
						})
					cy.get(orderFormPage.ORDER_PREVIEW)
						.within(() => {
							cy.get(orderFormPage.BTN_EDIT)
								.click({force: true})
							cy.get(orderFormPage.TXT_DISCOUNT)
								.should('exist')
							cy.get(orderFormPage.TXT_DISCOUNT)
								.type(`${DiscountCode[1].value}`)
							cy.contains('Apply')
								.click({force: true})
						})
					cy.get(orderFormPage.ORDER_PREVIEW)
						.should('contain', DiscountCode[0].value)
						.should('contain', ErrorMessages.InvalidCode)
				})
				it('Edit to Expired code', () => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.within(() => {
							cy.get(orderFormPage.TXT_DISCOUNT)
								.type(`${DiscountCode[0].value}`)
							cy.contains('Apply')
								.click({force: true})
							cy.wait(4000)
						})
					cy.get(orderFormPage.ORDER_PREVIEW)
						.within(() => {
							cy.get(orderFormPage.BTN_EDIT)
								.click({force: true})
							cy.get(orderFormPage.TXT_DISCOUNT)
								.should('exist')
							cy.get(orderFormPage.TXT_DISCOUNT)
								.type(`${DiscountCode[2].value}`)
							cy.contains('Apply')
								.click({force: true})
							cy.wait(4000)
						})
					cy.get(orderFormPage.ORDER_PREVIEW)
						.should('contain', DiscountCode[0].value)
						.should('contain', ErrorMessages.ExpiredCode)
				})
				it('[Delete] button is working', () => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.within(() => {
							cy.get(orderFormPage.TXT_DISCOUNT)
								.type(`${DiscountCode[0].value}`)
							cy.contains('Apply')
								.click({force: true})
							cy.wait(4000)
							cy.get(orderFormPage.BTN_DELETE)
								.click({force: true})
							cy.contains(`${DiscountCode[0].value}`)
								.should('not.exist')
						})
				})
			})
		})
		context('Use wallet', () => {
			it("Don't display wallet", () => {
				cy.get(orderFormPage.ORDER_PREVIEW)
					.should('not.contain.text', 'Use Wallet')
			})
			it("[Skip beforeEach] Show use wallet", () => {
				GotoStep5WithAccountHaveMoney()
				cy.get(orderFormPage.ORDER_PREVIEW)
					.should('contain.text', "Use Wallet")
			})
			it('[Skip beforeEach] [Use Wallet] checkbox active', () => {
				GotoStep5WithAccountHaveMoney()
				cy.get('.checkbox-check')
					.parent()
					.should('have.class', 'false')
			})
		})
		context('[You Pay] section', () => {
			it('[Skip beforeEach] [You Pay] value will change incase use wallet', () => {
				GotoStep5WithAccountHaveMoney()
				cy.get(orderFormPage.ORDER_PREVIEW)
					.should('contain.text', "Use Wallet")
					.click({force: true})
			})
		})
		context('[You save] section', () => {
			it('Not apply any discount code', () => {
				cy.get(orderFormPage.SEC_SAVE_VALUE)
					.should('contain', '~')
			})
			it('Applying any discount code', () => {
				cy.get(orderFormPage.TXT_DISCOUNT)
					.type(DiscountCode[0].value)
				cy.get(orderFormPage.BTN_APPLY)
					.click({force: true})
				cy.wait(4000)
				ShowValue({
					callback: (value) => {
						cy.get(orderFormPage.SEC_SAVE_VALUE)
							.should('contain', value.DiscountFix)
					}
				})
			})
		})
		it('[Back] button active, not save data and back to previous step', {timeout: 10000}, () => {
			cy.get(orderFormPage.BTN_BACK)
				.click({force: true})
			cy.contains(StepOrderTitle.NewStep4)
				.should('be.visible')
			cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
				.should('be.visible')
			cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
				.should('be.visible')
			cy.get(orderFormPage.ORDER_PREVIEW_EXTRA)
				.should('be.visible')
		})
		context('[Secure Checkout] button', () => {
			it('Default value: "PayPal" and go to Paypal confirm', () => {
				cy.contains('PayPal')
					.parent()
					.should('have.class', 'card-active')
				cy.contains('Secure Checkout')
					.click({force: true})
				cy.wait(5000)
				cy.location().should((location) => {
					expect(location.href).to.contain('https://www.sandbox.paypal.com/');
				});
			})
			it('Checkout by Credit Card and go to Credit Card confirm', () => {
				cy.contains('Credit Card')
					.click({force: true})
				cy.contains('Secure Checkout')
					.click({force: true})
				cy.wait(5000)
				cy.location().should((location) => {
					expect(location.href).to.contain('https://checkout.stripe.com');
				});
			})
		})
		context('Order Preview', () => {
			context('Details', () => {
				it('Default is collapsed', () => {
					cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
						.find(orderFormPage.ORDER_PREVIEW_COL)
						.should('exist')
				})
				it('Open & Close collapse', () => {
					cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
						.find(orderFormPage.ORDER_PREVIEW_COL)
						.should('exist')
					cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
						.find(orderFormPage.BTN_COL)
						.click({force: true})
					cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
						.find(orderFormPage.ORDER_PREVIEW_COL)
						.should('not.exist')
					cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
						.find(orderFormPage.BTN_COL)
						.click({force: true})
					cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
						.find(orderFormPage.ORDER_PREVIEW_COL)
						.should('exist')
				})
				it('Can Edit at the fields', () => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.contains(AcademicLevel[1])
						.click({force: true})
					cy.get(orderFormPage.STEP_NAME)
						.should('contain', StepOrderTitle.NewStep1)
					cy.get(orderFormPage.BTN_NEXT)
						.click({force: true})
					cy.get(orderFormPage.BTN_NEXT)
						.click({force: true})
					cy.get(orderFormPage.STEP_NAME)
						.should('contain', StepOrderTitle.NewStep3)

					cy.get(orderFormPage.ORDER_PREVIEW)
						.contains(PaperTypes[1].title)
						.click({force: true})
					cy.get(orderFormPage.STEP_NAME)
						.should('contain', StepOrderTitle.NewStep1)
					cy.get(orderFormPage.BTN_NEXT)
						.click({force: true})
					cy.get(orderFormPage.BTN_NEXT)
						.click({force: true})
					cy.get(orderFormPage.STEP_NAME)
						.should('contain', StepOrderTitle.NewStep3)

					cy.get(orderFormPage.ORDER_PREVIEW)
						.contains(SubjectTypes[1].title)
						.click({force: true})
					cy.get(orderFormPage.STEP_NAME)
						.should('contain', StepOrderTitle.NewStep1)
					cy.get(orderFormPage.BTN_NEXT)
						.click({force: true})
					cy.get(orderFormPage.BTN_NEXT)
						.click({force: true})
					cy.get(orderFormPage.STEP_NAME)
						.should('contain', StepOrderTitle.NewStep3)

					cy.get(orderFormPage.ORDER_PREVIEW)
						.contains(`${PaperFormat[1]}`)
						.click({force: true})
					cy.get(orderFormPage.STEP_NAME)
						.should('contain', StepOrderTitle.NewStep1)
				})
				it('Icon [^] active and change to [v] when click on it', () => {
					cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
						.find(orderFormPage.ARROW_DOWN_LAP)
						.should('be.visible')
					cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
						.find(orderFormPage.BTN_COL)
						.click({force: true})
					cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
						.find(orderFormPage.ARROW_UP_LAP)
						.should('be.visible')
					cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
						.find(orderFormPage.BTN_COL)
						.click({force: true})
					cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
						.find(orderFormPage.ARROW_DOWN_LAP)
						.should('be.visible')
				})
			})
			context('Specifications', () => {
				it('Default is collapsed', () => {
					cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
						.find(orderFormPage.ORDER_PREVIEW_COL)
						.should('exist')
				})
				it('Close & Open collapse', () => {
					cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
						.find(orderFormPage.BTN_COL)
						.click({force: true})
					cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
						.find(orderFormPage.ORDER_PREVIEW_COL)
						.should('not.exist')
					cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
						.find(orderFormPage.BTN_COL)
						.click({force: true})
					cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
						.find(orderFormPage.ORDER_PREVIEW_COL)
						.should('exist')
				})
				it('Cannot Edit at the fields', () => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.contains('Deadline:')
						.click({force: true})
					cy.get(orderFormPage.STEP_NAME)
						.contains(StepOrderTitle.NewStep3)

					cy.get(orderFormPage.ORDER_PREVIEW)
						.contains('Sources to be cited:')
						.click({force: true})
					cy.get(orderFormPage.STEP_NAME)
						.contains(StepOrderTitle.NewStep3)

					cy.get(orderFormPage.ORDER_PREVIEW)
						.contains('Pages:')
						.click({force: true})
					cy.get(orderFormPage.STEP_NAME)
						.contains(StepOrderTitle.NewStep3)

				})
				it('Icon [^] active and change to [v] when click on it', () => {
					cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
						.find(orderFormPage.ARROW_DOWN_LAP)
						.click({force: true})
					cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
						.find(orderFormPage.ARROW_UP_LAP)
						.click({force: true})
					cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
						.find(orderFormPage.ARROW_DOWN_LAP)
						.should('be.visible')
				})
			})
			context('Extras', () => {
				it('Default is collapse', () => {
					cy.get(orderFormPage.ORDER_PREVIEW_EXTRA)
						.find(orderFormPage.ORDER_PREVIEW_COL)
						.should('exist')
				})
				it('Close & Open collapse', () => {
					cy.get(orderFormPage.ORDER_PREVIEW_EXTRA)
						.find(orderFormPage.BTN_COL)
						.click({force: true})
					cy.get(orderFormPage.ORDER_PREVIEW_EXTRA)
						.find(orderFormPage.ORDER_PREVIEW_COL)
						.should('not.exist')
					cy.get(orderFormPage.ORDER_PREVIEW_EXTRA)
						.find(orderFormPage.BTN_COL)
						.click({force: true})
					cy.get(orderFormPage.ORDER_PREVIEW_EXTRA)
						.find(orderFormPage.ORDER_PREVIEW_COL)
						.should('exist')
				})
				it('Cannot Edit at the fields', () => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.contains("Writer's category")
						.click({force: true})
					cy.get(orderFormPage.STEP_NAME)
						.contains(StepOrderTitle.NewStep4)
				})
				it('Icon [^] active and change to [v] when click on it', () => {
					cy.get(orderFormPage.ORDER_PREVIEW_EXTRA)
						.find(orderFormPage.ARROW_DOWN_LAP)
						.click({force: true})
					cy.get(orderFormPage.ORDER_PREVIEW_EXTRA)
						.find(orderFormPage.ARROW_UP_LAP)
						.click({force: true})
					cy.get(orderFormPage.ORDER_PREVIEW_EXTRA)
						.find(orderFormPage.ARROW_DOWN_LAP)
						.should('be.visible')
				})
			})
		})
		context('Checkout by payment menthod sucessfully', () => {
			it('By Paypal', () => {
				cy.contains('PayPal')
					.click({force: true})
				cy.contains('Secure Checkout')
					.click({force: true})
				cy.wait(5000)
				PaymentByPaypal()
				cy.wait(15000)
				// Set localStorage sau khi trang đã load xong
				cy.url().then((currentUrl) => {
					// Bước 2: Sử dụng regex để trích xuất số từ URL
					const orderId = currentUrl.match(/\/order\/(\d+)\//)[1];

					// Bước 3: In ra orderId hoặc sử dụng nó cho các thao tác khác
					cy.log('Order ID:', orderId);
				});
			})
		})
		context('The system will go to "Order unpaid" incase user Checkout, go back and checkout again ', () => {
			it('Paypal -> Paypal', () => {
				cy.contains('PayPal')
					.click({force: true})
				cy.contains('Secure Checkout')
					.click({force: true})
				cy.wait(6000)
				cy.go('back')
				cy.contains('PayPal')
					.click({force: true})
				cy.contains('Secure Checkout')
					.click({force: true})
				cy.location('pathname').should('eq', ROUTERS.ORDERS_UNPAID)
			})
			it('Paypal -> Credit Card', () => {
				cy.contains('PayPal')
					.click({force: true})
				cy.contains('Secure Checkout')
					.click({force: true})
				cy.wait(6000)
				cy.go('back')
				cy.contains('Credit Card')
					.click({force: true})
				cy.contains('Secure Checkout')
					.click({force: true})
				cy.location('pathname').should('eq', ROUTERS.ORDERS_UNPAID)
			})
			it('Credit Card -> Credit Card', () => {
				cy.contains('Credit Card')
					.click({force: true})
				cy.contains('Secure Checkout')
					.click({force: true})
				cy.wait(6000)
				cy.go('back')
				cy.contains('Credit Card')
					.click({force: true})
				cy.contains('Secure Checkout')
					.click({force: true})
				cy.location('pathname').should('eq', ROUTERS.ORDERS_UNPAID)
			})
			it('Credit Card -> PayPal', () => {
				cy.contains('Credit Card')
					.click({force: true})
				cy.contains('Secure Checkout')
					.click({force: true})
				cy.wait(6000)
				cy.go('back')
				cy.contains('PayPal')
					.click({force: true})
				cy.contains('Secure Checkout')
					.click({force: true})
				cy.location('pathname').should('eq', ROUTERS.ORDERS_UNPAID)
			})
		})
	}
)
