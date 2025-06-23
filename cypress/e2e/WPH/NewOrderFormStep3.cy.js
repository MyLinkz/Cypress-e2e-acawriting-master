//https://docs.google.com/spreadsheets/d/19Knmyxh26B4wYwJcTvxwRQkVIHzEilkQdaaHmwQ-76Q/edit#gid=1427486929
// import 'cypress-wait-until';
import 'cypress-file-upload';
import {
	AcademicLevel, PaperFormat, Order, CopyText,
	ExistEmail, PaperTypes, SubjectTypes,
	StepOrderTitle, CommomTextbox, Deadline,

} from "../../support/constants/defaultvalue"
import {ROUTERS} from "../../support/constants/url"
import {ShowValue} from '../../support/utlis';
import signinPage from "./pages/signinPage";
import orderFormPage from "./pages/orderFormPage";

describe("Step 3", () => {
	const maxRetries = 5;
	let retryCount = 0;
	beforeEach(function () {
		retryCount = 0;
		orderFormPage
		cy.log(`Retrying beforeEach... Attempt ${retryCount + 1}`);
		while (retryCount < maxRetries) {
			try {
				cy.viewport(1440, 1200)
				signinPage.signInSuccess();
				cy.visit(ROUTERS.ORDER);
				cy.contains(AcademicLevel[1], {timeout: 20000})
					.click({force: true})
				cy.get(orderFormPage.SEL_DOCUMENT)
					.type(PaperTypes[1].title, {force: true})
				cy.get(orderFormPage.SEL_DISCIPLINE)
					.type(SubjectTypes[1].title, {force: true})
				cy.contains(`${PaperFormat[1]}`)
					.click({force: true})
				cy.get(orderFormPage.BTN_NEXT)
					.click({force: true})
				// Go to step 2
				cy.get(orderFormPage.TXT_TITLE)
					.type(CopyText)
				cy.get(orderFormPage.TXT_INSTRUCTIONS)
					.type(CommomTextbox.Letter)
					.click({force: true})
				cy.get(orderFormPage.BTN_NEXT)
					.click({force: true})
				break;
			} catch (error) {
				retryCount++;
				cy.log(`Retrying beforeEach... Attempt ${retryCount + 1}`);
				console.log(`Retrying beforeEach... Attempt ${retryCount + 1}`);
			}
		}
		if (retryCount === maxRetries) {
			throw new Error(`Failed to prepare before each test after ${maxRetries} attempts.`);
		}
	})
	it('Check title of step', () => {
		cy.contains(StepOrderTitle.NewStep3)
			.should('be.visible')
	})
	context('[Sources to be cited] field ', () => {
		context('[-] button', () => {
			it('Button enable', () => {
				cy.get(orderFormPage.BTN_INC).eq(0)
					.dblclick({force: true})
					.click({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(0)
					.should('have.text', 3)
				cy.get(orderFormPage.BTN_DEC).eq(0)
					.click({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(0)
					.should('contain.text', 2)
			})
			it('Can double click', () => {
				cy.get(orderFormPage.BTN_INC).eq(0)
					.dblclick({force: true})
					.click({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(0)
					.should('have.text', 3)
				cy.get(orderFormPage.BTN_DEC).eq(0)
					.dblclick({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(0)
					.should('have.text', 1)
			})
			it('Can rightclick + left click', () => {
				cy.get(orderFormPage.BTN_INC).eq(0)
					.dblclick({force: true})
					.click({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(0)
					.should('have.text', 3)
				cy.get(orderFormPage.BTN_DEC).eq(0)
					.click({force: true})
					.rightclick({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(0)
					.should('have.text', 1)
			})
			it('Can hold', () => {
				cy.get(orderFormPage.BTN_INC).eq(0)
					.trigger('mousedown', {force: true})
					.wait(2000)
					.trigger('mouseup', {force: true})
				cy.get(orderFormPage.BTN_DEC).eq(0)
					.trigger('mousedown', {force: true})
					.wait(3000)
					.trigger('mouseup', {force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(0)
					.should('have.text', 0)
			})
		})
		context('[+] button', () => {
			it('Button enable', () => {
				cy.get(orderFormPage.BTN_INC).eq(0)
					.click({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(0)
					.should('have.text', 1)
			})
			it('Can double click', () => {
				cy.get(orderFormPage.BTN_INC).eq(0)
					.dblclick({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(0)
					.should('have.text', 2)
			})
			it('Can rightclick + left click', () => {
				cy.get(orderFormPage.BTN_INC).eq(0)
					.click({force: true})
					.rightclick({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(0)
					.should('have.text', 2)
			})
			it('Can hold', () => {
				cy.get(orderFormPage.BTN_INC).eq(0)
					.trigger('mousedown', {force: true})
					.wait(2000)
					.trigger('mouseup', {force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(0)
					.invoke('text')
					.then(($element) => {
						const value = parseInt($element); // Chuyển nội dung thành số nguyên
						expect(value).to.be.greaterThan(10); // Kiểm tra xem giá trị có lớn hơn 7 hay không
					});
			})
		})
		context('[Writer\'s choice] checkbox', () => {
			it('Active', () => {
				cy.get(orderFormPage.BTN_CHECKBOX)
					.check({force: true})
				cy.get(orderFormPage.BTN_INC).eq(0)
					.should('be.disabled')
				cy.get(orderFormPage.BTN_DEC).eq(0)
					.should('be.disabled')
				cy.get(orderFormPage.BTN_CHECKBOX)
					.uncheck({force: true})
				cy.get(orderFormPage.BTN_INC).eq(0)
					.should('not.be.disabled')
				cy.get(orderFormPage.BTN_DEC).eq(0)
					.should('not.be.disabled')
			})
			it('Default', () => {
				cy.get(orderFormPage.BTN_CHECKBOX)
					.should('not.be.checked')
			})
			it('Reset value', () => {
				cy.get(orderFormPage.BTN_CHECKBOX)
					.check({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(0)
					.should('contain', '~')
				cy.get(orderFormPage.BTN_CHECKBOX)
					.uncheck({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(0)
					.should('contain', 0)
			})
		})
		it('Value show corret at order Preview', () => {
			cy.get(orderFormPage.ORDER_PREVIEW)
				.should('not.contain', 'Sources to be cited')
			cy.get(orderFormPage.BTN_INC).eq(0)
				.click({force: true})
			cy.get(orderFormPage.ORDER_PREVIEW)
				.contains('Sources to be cited')
				.parent()
				.siblings()
				.should('have.text', 1)
			cy.get(orderFormPage.BTN_INC).eq(0)
				.dblclick({force: true})
			cy.get(orderFormPage.BTN_DEC).eq(0)
				.click({force: true})
			cy.get(orderFormPage.ORDER_PREVIEW)
				.contains('Sources to be cited')
				.parent()
				.siblings()
				.should('have.text', 2)
			cy.get(orderFormPage.BTN_CHECKBOX)
				.click({force: true})
			cy.get(orderFormPage.ORDER_PREVIEW)
				.contains('~Writer\'s choice~')

		})
	})
	context('[Deadline] field', () => {
		context("Click button and just it's active", () => {
			Deadline.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
					cy.contains(`${CheckValue}`)
						.click({force: true})
						.should("have.class", "active")
						.invoke("text")
						.then((value) => {
							const chosen = value.trim()
							Deadline.forEach((value) => {
								if (value === chosen) {

								} else {
									cy.contains(value)
										.should("not.have.class", "active")
								}
							})
						})
				})
			})
		})
		context("Value show corret at order Preview", () => {
			Deadline.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
					cy.contains(`${CheckValue}`)
						.click({force: true})
					console.log(CheckValue)
					if (CheckValue === '24 hours') {
						const NewCheckValue = '1 day'
						cy.get(orderFormPage.ORDER_PREVIEW)
							.contains(NewCheckValue)
							.should('be.visible')
					} else if (CheckValue === '48 hours') {
						const NewCheckValue = '2 days'
						cy.get(orderFormPage.ORDER_PREVIEW)
							.contains(NewCheckValue)
							.should('be.visible')
					} else (
						cy.get(orderFormPage.ORDER_PREVIEW)
							.contains(CheckValue)
							.should('be.visible')
					)
				})
			})
		})
		context("Order Preview update successfully when change value", () => {
			Deadline.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
					cy.contains(CheckValue)
						.click({force: true})
					if (CheckValue === '24 hours') {
						const NewCheckValue = '1 day'
						cy.get(orderFormPage.ORDER_PREVIEW)
							.contains(NewCheckValue)
							.should('be.visible')
					} else if (CheckValue === '48 hours') {
						const NewCheckValue = '2 days'
						cy.get(orderFormPage.ORDER_PREVIEW)
							.contains(NewCheckValue)
							.should('be.visible')
					} else (
						cy.get(orderFormPage.ORDER_PREVIEW)
							.contains(CheckValue)
							.should('be.visible')
					)
				})
			})
		})
		it("Default Value", () => {
			cy.contains(`${Order.Deadline}`)
				.click({force: true})
				.should("have.class", "active")
				.invoke("text")
				.then((value) => {
					const chosen = value.trim()
					Deadline.forEach((value) => {
						if (value == chosen) {
							return
						} else {
							cy.contains(value)
								.should("not.have.class", "active")
						}
					})
				})
		})
	})
	context('[Pages] field', () => {
		it('Default pages', () => {
			cy.get(orderFormPage.NUMB_PAGES).eq(1)
				.should('have.text', 2)
		})
		context('[-] button', () => {
			it('Button enable', () => {
				cy.get(orderFormPage.BTN_DEC).eq(1)
					.click({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(1)
					.should('have.text', 1)
			})
			it('Can double click', () => {
				cy.get(orderFormPage.BTN_INC).eq(1)
					.dblclick({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(1)
					.should('have.text', 4)
				cy.get(orderFormPage.BTN_DEC).eq(1)
					.dblclick({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(1)
					.should('have.text', 2)
			})
			it('Can rightclick + left click', () => {
				cy.get(orderFormPage.BTN_INC).eq(1)
					.dblclick({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(1)
					.should('have.text', 4)
				cy.get(orderFormPage.BTN_DEC).eq(1)
					.click({force: true})
					.rightclick({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(1)
					.should('have.text', 2)
			})
			it('Can hold', () => {
				cy.get(orderFormPage.BTN_INC).eq(1)
					.trigger('mousedown', {force: true})
					.wait(2000)
					.trigger('mouseup', {force: true})
				cy.get(orderFormPage.BTN_DEC).eq(1)
					.trigger('mousedown', {force: true})
					.wait(3000)
					.trigger('mouseup', {force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(1)
					.should('have.text', 0)
			})
		})
		context('[+] button', () => {
			it('Button enable', () => {
				cy.get(orderFormPage.BTN_INC).eq(1)
					.click({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(1)
					.should('have.text', 3)
			})
			it('Can double click', () => {
				cy.get(orderFormPage.BTN_INC).eq(1)
					.dblclick({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(1)
					.should('have.text', 4)
			})
			it('Can rightclick + left click', () => {
				cy.get(orderFormPage.BTN_INC).eq(1)
					.click({force: true})
					.rightclick({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(1)
					.should('have.text', 4)
			})
			it('Can hold', () => {
				cy.get(orderFormPage.BTN_INC).eq(1)
					.trigger('mousedown', {force: true})
					.wait(2000)
					.trigger('mouseup', {force: true})
				cy.wait(1000)
				cy.get(orderFormPage.NUMB_PAGES).eq(1)
					.invoke('text')
					.then(($element) => {
						const value = parseInt($element); // Chuyển nội dung thành số nguyên
						expect(value).to.be.greaterThan(10); // Kiểm tra xem giá trị có lớn hơn 7 hay không
					});
				// 1s = 5
				// 2s = 15
				// 3s = 24
			})
		})
		it('Value show corret at order Preview', () => {
			cy.get(orderFormPage.ORDER_PREVIEW)
				.should('contain', '2 pages,')
			cy.get(orderFormPage.BTN_INC).eq(1)
				.click({force: true})
			cy.get(orderFormPage.ORDER_PREVIEW)
				.should('contain', '3 pages,')
			cy.get(orderFormPage.BTN_DEC).eq(1)
				.dblclick({force: true})
			cy.get(orderFormPage.ORDER_PREVIEW)
				.should('contain', '1 page,')
			cy.get(orderFormPage.BTN_DEC).eq(1)
				.click({force: true})
			cy.get(orderFormPage.ORDER_PREVIEW)
				.should('not.contain', 'page')
		})
	})
	context('[PowerPoint slides] field', () => {
		it('Default pages', () => {
			cy.get(orderFormPage.NUMB_PAGES).eq(2)
				.should('have.text', 0)
		})
		context('[-] button', () => {
			it('Button enable', () => {
				cy.get(orderFormPage.BTN_INC).eq(2)
					.dblclick({force: true})
				cy.get(orderFormPage.BTN_DEC).eq(2)
					.click({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(2)
					.should('have.text', 2)
			})
			it('Can double click', () => {
				cy.get(orderFormPage.BTN_INC).eq(2)
					.dblclick({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(2)
					.should('have.text', 3)
				cy.get(orderFormPage.BTN_DEC).eq(2)
					.dblclick({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(2)
					.should('have.text', 0)
			})
			it('Can rightclick + left click', () => {
				cy.get(orderFormPage.BTN_INC).eq(2)
					.dblclick({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(2)
					.should('have.text', 3)
				cy.get(orderFormPage.BTN_DEC).eq(2)
					.click({force: true})
					.rightclick({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(2)
					.should('have.text', 0)
			})
			it('Can hold', () => {
				cy.get(orderFormPage.BTN_INC).eq(2)
					.trigger('mousedown', {force: true})
					.wait(2000)
					.trigger('mouseup', {force: true})
				cy.get(orderFormPage.BTN_DEC).eq(2)
					.trigger('mousedown', {force: true})
					.wait(3000)
					.trigger('mouseup', {force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(2)
					.should('have.text', 0)
			})
		})
		context('[+] button', () => {
			it('Button enable', () => {
				cy.get(orderFormPage.BTN_INC).eq(2)
					.click({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(2)
					.should('have.text', 2)
			})
			it('Can double click', () => {
				cy.get(orderFormPage.BTN_INC).eq(2)
					.dblclick({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(2)
					.should('have.text', 3)
			})
			it('Can rightclick + left click', () => {
				cy.get(orderFormPage.BTN_INC).eq(2)
					.click({force: true})
					.rightclick({force: true})
				cy.get(orderFormPage.NUMB_PAGES).eq(2)
					.should('have.text', 3)
			})
			it('Can hold', () => {
				cy.get(orderFormPage.BTN_INC).eq(2)
					.trigger('mousedown', {force: true})
					.wait(2000)
					.trigger('mouseup', {force: true})
				cy.wait(1000)
				cy.get(orderFormPage.NUMB_PAGES).eq(2)
					.invoke('text')
					.then(($element) => {
						const value = parseInt($element); // Chuyển nội dung thành số nguyên
						expect(value).to.be.greaterThan(10); // Kiểm tra xem giá trị có lớn hơn 7 hay không
					});
			})
		})
	})
	context('Business rules at Wordload', () => {
		it('Check when page number = 0', () => {
			cy.get(orderFormPage.NUMB_PAGES).eq(2)
				.should('have.text', 0)
			cy.get(orderFormPage.BTN_DEC).eq(1)
				.dblclick({force: true})
			cy.get(orderFormPage.NUMB_PAGES).eq(2)
				.should('have.text', 2)
		})
		it('Check when slide number = 0', () => {
			cy.get(orderFormPage.BTN_DEC).eq(1)
				.dblclick({force: true})
			cy.get(orderFormPage.BTN_DEC).eq(2)
				.click({force: true})
			cy.get(orderFormPage.NUMB_PAGES).eq(1)
				.should('have.text', 1)
		})
	})
	it('[Back] button active, not save data and back to previous step', {timeout: 10000}, () => {
		cy.get(orderFormPage.BTN_BACK)
			.click({force: true})
		cy.contains(StepOrderTitle.NewStep2)
			.should('be.visible')
		cy.get(orderFormPage.ORDER_PREVIEW)
			.should('contain', CopyText)
			.should('contain', CommomTextbox.Letter)
			.should('contain', AcademicLevel[1])
			.should('contain', PaperTypes[1].title)
			.should('contain', SubjectTypes[1].title)
			.should('contain', `${PaperFormat[1]}`)
		cy.get(orderFormPage.TXT_TITLE)
			.should('have.value', CopyText)
		cy.get(orderFormPage.TXT_INSTRUCTIONS)
			.should('contain', CommomTextbox.Letter)
		cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
			.should('not.exist')
	})
	it('[Next] button active, and go to next step successfully', () => {
		cy.get(orderFormPage.BTN_NEXT)
			.click({force: true})
		cy.contains(StepOrderTitle.NewStep4)
			.should('be.visible')
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
				const Step1 = [
					AcademicLevel[1],
					PaperTypes[1].title,
					SubjectTypes[1].title,
					PaperFormat[1]
				]
				Step1.forEach((value) => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.contains(value)
						.click({force: true})
					cy.get(orderFormPage.STEP_NAME)
						.should('contain', StepOrderTitle.NewStep1)
					cy.get(orderFormPage.BTN_NEXT)
						.click({force: true})
					cy.get(orderFormPage.BTN_NEXT)
						.click({force: true})
					cy.get(orderFormPage.STEP_NAME)
						.should('contain', StepOrderTitle.NewStep3)
				})
				const Step2 = [
					CopyText,
					CommomTextbox.Letter
				]
				Step2.forEach((value) => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.contains(value)
						.click({force: true})
					cy.get(orderFormPage.STEP_NAME)
						.should('contain', StepOrderTitle.NewStep2)
					cy.get(orderFormPage.BTN_NEXT)
						.click({force: true})
					cy.get(orderFormPage.STEP_NAME)
						.should('contain', StepOrderTitle.NewStep3)
				})
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
			it('Default is not collapse', () => {
				cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
					.find(orderFormPage.ORDER_PREVIEW_COL)
					.should('not.exist')
			})
			it('Close & Open collapse', () => {
				cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
					.find(orderFormPage.BTN_COL)
					.click({force: true})
				cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
					.find(orderFormPage.ORDER_PREVIEW_COL)
					.should('exist')
				cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
					.find(orderFormPage.BTN_COL)
					.click({force: true})
				cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
					.find(orderFormPage.ORDER_PREVIEW_COL)
					.should('not.exist')
			})
			it('Cannot Edit at the fields', () => {
				cy.get(orderFormPage.BTN_CHECKBOX)
					.click({force: true})
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
					.find(orderFormPage.ARROW_UP_LAP)
					.click({force: true})
				cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
					.find(orderFormPage.ARROW_DOWN_LAP)
					.click({force: true})
				cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
					.find(orderFormPage.ARROW_UP_LAP)
					.should('be.visible')
			})
		})
	})
	it('Check accordion is working', () => {
		cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
			.find(orderFormPage.BTN_COL)
			.click({force: true})
		cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
			.find(orderFormPage.ORDER_PREVIEW_COL)
			.should('exist')
		cy.get(orderFormPage.ORDER_PREVIEW_SPEC)
			.find(orderFormPage.BTN_COL)
			.click({force: true})
		cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
			.find(orderFormPage.ORDER_PREVIEW_COL)
			.should('exist')
	})
	context('Approx. cost', () => {
		AcademicLevel.forEach((item) => {
			it(`Cost change incase update Academic Level: ${item}`, () => {
				cy.get(orderFormPage.BTN_NEXT)
					.click({force: true})
				cy.get(orderFormPage.ORDER_PREVIEW)
					.find('span')
					.contains('Academic Level:')
					.click({force: true})
				cy.get(orderFormPage.ORDER_INPUT)
					.contains(item)
					.click({force: true})
				cy.get(orderFormPage.BTN_NEXT)
					.click({force: true})
				cy.get(orderFormPage.BTN_NEXT)
					.click({force: true})
				ShowValue({
					callback: (value) => {
						cy.get(orderFormPage.ORDER_PREVIEW)
							.should('contain', `$${value.TotalPriceFix}`)
					}
				})
			})
		})
		it('Cost unchange incase change "Type of Document"', () => {
			cy.get(orderFormPage.BTN_NEXT)
				.click({force: true})
			cy.get(orderFormPage.ORDER_PREVIEW)
				.find('span')
				.contains('Type of Document')
				.click({force: true})
			cy.get(orderFormPage.SEL_DOCUMENT)
				.type(PaperTypes[8].title, {force: true})
			cy.get(orderFormPage.BTN_NEXT)
				.click({force: true})
			cy.get(orderFormPage.BTN_NEXT)
				.click({force: true})
			ShowValue({
				callback: (value) => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.should('contain', `$${value.TotalPriceFix}`)
				}
			})
		})
		it('Cost unchange incase change "Discipline"', () => {
			cy.get(orderFormPage.BTN_NEXT)
				.click({force: true})
			cy.get(orderFormPage.ORDER_PREVIEW)
				.find('span')
				.contains('Discipline')
				.click({force: true})
			cy.get(orderFormPage.SEL_DISCIPLINE)
				.type(SubjectTypes[8].title, {force: true})
			cy.get(orderFormPage.BTN_NEXT)
				.click({force: true})
			cy.get(orderFormPage.BTN_NEXT)
				.click({force: true})
			ShowValue({
				callback: (value) => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.should('contain', `$${value.TotalPriceFix}`)
				}
			})
		})
		PaperFormat.forEach((item) => {
			it(`Cost unchange incase change "Paper Format": ${item}`, () => {
				cy.get(orderFormPage.BTN_NEXT)
					.click({force: true})
				cy.get(orderFormPage.ORDER_PREVIEW)
					.find('span')
					.contains('Paper Format')
					.click({force: true})
				cy.get(orderFormPage.ORDER_INPUT)
					.contains(`${item}`)
					.click({force: true})
				cy.get(orderFormPage.BTN_NEXT)
					.click({force: true})
				cy.get(orderFormPage.BTN_NEXT)
					.click({force: true})
				ShowValue({
					callback: (value) => {
						cy.get(orderFormPage.ORDER_PREVIEW)
							.should('contain', `$${value.TotalPriceFix}`)
					}
				})
			})
		})
		it('Cost unchange incase change "Tile"', () => {
			cy.get(orderFormPage.BTN_NEXT)
				.click({force: true})
			cy.get(orderFormPage.ORDER_PREVIEW)
				.find('span')
				.contains('Title')
				.click({force: true})
			cy.get(orderFormPage.TXT_TITLE)
				.type('test', {force: true})
			cy.get(orderFormPage.BTN_NEXT)
				.click({force: true})
			ShowValue({
				callback: (value) => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.should('contain', `$${value.TotalPriceFix}`)
				}
			})
			cy.get(orderFormPage.ORDER_PREVIEW)
				.find('span')
				.contains('Title')
				.click({force: true})
			cy.get(orderFormPage.TXT_TITLE)
				.clear({force: true})
			cy.get(orderFormPage.BTN_NEXT)
				.click({force: true})
			ShowValue({
				callback: (value) => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.should('contain', `$${value.TotalPriceFix}`)
				}
			})
		})
		it('Cost unchange incase change "Instructions"', () => {
			cy.get(orderFormPage.BTN_NEXT)
				.click({force: true})
			cy.get(orderFormPage.ORDER_PREVIEW)
				.find('span')
				.contains('Instructions')
				.click({force: true})
			cy.get(orderFormPage.TXT_INSTRUCTIONS)
				.type('testAC', {force: true})
			cy.get(orderFormPage.BTN_NEXT)
				.click({force: true})
			ShowValue({
				callback: (value) => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.should('contain', `$${value.TotalPriceFix}`)
				}
			})
		})
		it('Cost unchange incase change "Sources to be cited"', () => {
			cy.get(orderFormPage.BTN_INC_SOURCE)
				.dblclick({force: true})
			ShowValue({
				callback: (value) => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.should('contain', `$${value.TotalPriceFix}`)
				}
			})
		})
		Deadline.forEach((item) => {
			it('Cost unchange incase change "Deadline"', () => {
				cy.get(orderFormPage.SEL_DEADLINE)
					.contains(`${item}`)
					.click({force: true})
				ShowValue({
					callback: (value) => {
						cy.get(orderFormPage.ORDER_PREVIEW)
							.should('contain', `$${value.TotalPriceFix}`)
					}
				})
			})
		})
		it('Cost unchange incase change "Pages"', () => {
			cy.get(orderFormPage.BTN_INC).eq(1)
				.dblclick({force: true})
			ShowValue({
				callback: (value) => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.should('contain', `$${value.TotalPriceFix}`)
				}
			})
			cy.get(orderFormPage.BTN_DEC).eq(1)
				.click({force: true})
			ShowValue({
				callback: (value) => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.should('contain', `$${value.TotalPriceFix}`)
				}
			})
		})
		it('Cost unchange incase change "Spacing"', () => {
			cy.get(orderFormPage.SEL_SPACING)
				.contains('Double')
				.click({force: true})
			ShowValue({
				callback: (value) => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.should('contain', `$${value.TotalPriceFix}`)
				}
			})
			cy.get(orderFormPage.SEL_SPACING)
				.contains('Single')
				.click({force: true})
			ShowValue({
				callback: (value) => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.should('contain', `$${value.TotalPriceFix}`)
				}
			})
		})
		it('Cost unchange incase change "Slide"', () => {
			cy.get(orderFormPage.BTN_INC).eq(2)
				.dblclick({force: true})
			ShowValue({
				callback: (value) => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.should('contain', `$${value.TotalPriceFix}`)
				}
			})
			cy.get(orderFormPage.BTN_DEC).eq(2)
				.click({force: true})
			ShowValue({
				callback: (value) => {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.should('contain', `$${value.TotalPriceFix}`)
				}
			})
		})
	})
	context('Check the saving of order information at screen step 2', () => {
		it('Back to previous step and after that go to current step. The fields will be reset', () => {
			cy.get(orderFormPage.BTN_INC).eq(1)
				.click()
			cy.get(orderFormPage.BTN_INC).eq(2)
				.click()
			cy.get(orderFormPage.BTN_DEC).eq(0)
				.click()
			cy.get(orderFormPage.SEL_DEADLINE)
				.contains(Deadline[1])
				.click()
			cy.get(orderFormPage.SEL_SPACING)
				.find('button:not(.active)')
				.click({force: true})
			cy.get(orderFormPage.BTN_BACK)
				.click({force: true})
			cy.get(orderFormPage.BTN_NEXT)
				.click({force: true})
			cy.get(orderFormPage.NUMB_SOURCE)
				.should('have.text', Order.NumberSources)
			cy.get(orderFormPage.SEL_DEADLINE)
				.contains(Order.Deadline)
				.should('have.class', 'active')
			cy.get(orderFormPage.NUMB_PAGES)
				.should('have.text', Order.NumberPages)
			cy.get(orderFormPage.NUMB_PAGES).eq(2)
				.should('have.text', Order.NumberSlide)
			cy.get(orderFormPage.SEL_SPACING)
				.contains(Order.Spacing)
				.should('have.class', 'active')
		})
		it('Go to next step and after that back to previous step. The fields will be saved', () => {
			cy.get(orderFormPage.BTN_INC).eq(1)
				.click()
			cy.get(orderFormPage.BTN_INC).eq(2)
				.click()
			cy.get(orderFormPage.BTN_INC_SOURCE)
				.click()
			cy.get(orderFormPage.SEL_SPACING)
				.find('button.active')
				.invoke('text')
				.then((item) => {
					if (item === 'Double') {
						cy.contains('Single')
							.click()
					} else if (item === 'Single') {
						cy.contains('Double')
							.click()
					}
				})
			cy.get(orderFormPage.BTN_NEXT)
				.click({force: true})
			cy.get(orderFormPage.BTN_BACK)
				.click({force: true})
			cy.get(orderFormPage.NUMB_PAGES)
				.should('have.text', Order.NumberPages + 1)
			cy.get(orderFormPage.NUMB_PAGES).eq(2)
				.should('have.text', Order.NumberSlide + 2)
			cy.get(orderFormPage.NUMB_SOURCE)
				.should('have.text', Order.NumberSources + 1)
			cy.get(orderFormPage.SEL_SPACING)
				.find('button.active')
				.invoke('text')
				.should('not.eq', Order.Spacing)
		})
	})
	context('[Edit] button', () => {
		it('Step 1 update value successfully', () => {
			cy.get(orderFormPage.ORDER_PREVIEW)
				.contains(AcademicLevel[1])
				.click({force: true})
			cy.contains(AcademicLevel[2])
				.click({force: true})
			cy.get(orderFormPage.SEL_DOCUMENT)
				.type(PaperTypes[2].title)
			cy.get(orderFormPage.SEL_DISCIPLINE)
				.type(SubjectTypes[2].title, {force: true})
			cy.contains(PaperFormat[2])
				.click({force: true})
			cy.get(orderFormPage.ORDER_PREVIEW)
				.contains(CopyText)
				.click({force: true})
			cy.get(orderFormPage.ORDER_PREVIEW)
				.should('contain', AcademicLevel[2])
				.should('contain', PaperTypes[2].title)
				.should('contain', SubjectTypes[2].title)
				.should('contain', PaperFormat[2])
		})
		it('Step 2 update value successfully', () => {
			cy.get(orderFormPage.ORDER_PREVIEW)
				.contains(CopyText)
				.click({force: true})
			cy.get(orderFormPage.TXT_TITLE)
				.type('a')
			cy.get(orderFormPage.TXT_INSTRUCTIONS)
				.type('b')
			cy.contains(AcademicLevel[1])
				.click({force: true})
			cy.get(orderFormPage.ORDER_PREVIEW)
				.should('contain', `${CopyText}a`)
				.should('contain', `${CommomTextbox.Letter}b`)
		})
		it('Not save value at step 3', () => {
			cy.get(orderFormPage.BTN_INC).eq(1)
				.click()
			cy.get(orderFormPage.BTN_INC).eq(2)
				.click()
			cy.get(orderFormPage.BTN_DEC).eq(0)
				.click()
			cy.get(orderFormPage.SEL_DEADLINE)
				.contains(Deadline[1])
				.click()
			cy.get(orderFormPage.SEL_SPACING)
				.find('button:not(.active)')
				.click({force: true})
			cy.get(orderFormPage.ORDER_PREVIEW)
				.contains(AcademicLevel[1])
				.click({force: true})
			cy.contains(AcademicLevel[2])
				.click({force: true})
			cy.get(orderFormPage.BTN_NEXT)
				.click({force: true})
			cy.get(orderFormPage.BTN_NEXT)
				.click({force: true})
			cy.get(orderFormPage.NUMB_SOURCE)
				.should('have.text', Order.NumberSources)
			cy.get(orderFormPage.SEL_DEADLINE)
				.contains(Order.Deadline)
				.should('have.class', 'active')
			cy.get(orderFormPage.NUMB_PAGES)
				.should('have.text', Order.NumberPages)
			cy.get(orderFormPage.NUMB_PAGES).eq(2)
				.should('have.text', Order.NumberSlide)
			cy.get(orderFormPage.SEL_SPACING)
				.contains(Order.Spacing)
				.should('have.class', 'active')
		})
	})
})
