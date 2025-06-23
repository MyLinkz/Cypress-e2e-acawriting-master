
import { ExistEmail, PaperTypes,Order } from "../../support/constants/defaultvalue"
import { LOCATE_OLDFORM } from "../../support/constants/locate"
// import { beforeEach } from "mocha";
// import { headers } from "linkinator"
describe("test Order function", () => {
	beforeEach(function () {
		cy.visit("/order")
		cy.viewport(1440, 786)
	})
	it("mẫu(Order thành công)", () => {
		cy.visit("/order")
		cy.get(LOCATE_OLDFORM.SEL_DISCIPLINE)
			.select(2)
		// .click({ force: true })
		// cy.get(':nth-child(2) > .form-content > .chosen')
		// 	.select('Analysis Paper')
		// cy.get(':nth-child(3) > .form-content > .chosen')
		// 	.select('61')
		// cy.get(':nth-child(4) > .form-content > .jcc-element > [data-toggle="7"]').click({ force: true })
		cy.get(LOCATE_OLDFORM.TXT_INSTRUCTIONS)
			.type("Quynh")
		// cy.get(':nth-child(6) > .form-content > .form-control')
		cy.get(LOCATE_OLDFORM.BTN_NEXT).click({ force: true })
		cy.get('.form-elements.u-mb-32 > .form-content > .c-input-number > .qtyplus').click({ force: true })
		// cy.DataType('checkbox').click({ force: true })
		cy.get('[data-toggle="5"]').click({ force: true })
		cy.get(':nth-child(2) > .form-content > .jcc-element > [data-toggle="1"]').click({ force: true }).contains("SINGLE")
		for (let n = 1; n < 5; n++) {
			cy.get(':nth-child(10) > .form-content > .c-input-number > .qtyplus').click({ multiple: true })
		}
		cy.get(':nth-child(11) > .form-content > .c-input-number > .qtyplus').click({ force: true })
		cy.get('[data-prp-description="High-rank professional writer, proficient in the requested field of study"]')
			.click({ force: true })
		cy.get('[data-prp-description="Standard price"]').click({ force: true })
		// cy.getClass("btnnext").click({ force: true })
		cy.get(':nth-child(2) > .text-uppercase').click({ force: true })
		cy.get(LOCATE_OLDFORM.BTN_NEXT).click({ force: true })
		cy.get(':nth-child(2) > .text-uppercase')
			.click({ force: true })
		cy.get(':nth-child(3) > .form-content > .form-control')
			.type(ExistEmail.email)
		cy.get(':nth-child(4) > .form-content > .form-control')
			.type(ExistEmail.password)
		cy.get('.form-buttons > .form-content > .form-control')
			.click({ force: true })
		cy.get('.payment > :nth-child(1)').click({ force: true })
		cy.get('.btn-green').click({ force: true })
		cy.wait(10000)
		cy.origin("https://www.sandbox.paypal.com/", () => {
			cy.get('.css-ltr-1m7plzc-button-Button').click({ force: true })
			cy.get('#login')
				.type('sb-8rgty15774225@personal.example.com')
			cy.get('#btnNext')
				.click({ force: true })
			cy.get('#password')
				.type('DtBBsL-4')
			cy.get('#btnLogin')
				.click({ force: true })
			cy.get('[data-testid="submit-button-initial"]').click({ force: true })
		})
		cy.wait(20000)
		cy.url().then(($url) => {
			console.log($url)
			const txt = $url.split("/details/")[1];
			console.log(txt)
			cy.get('.order-id').should('contain', txt);
		});
	})
	it("doing", () => {
		cy.visit("/order")
		cy.contains("High School")
			.click({ force: true })
		cy.get(DocumentField)
			.select(1)
		// cy.get(DisciplineField)
		// .select(88)
	})
	context("Academic Level field", () => {
		context("Click button and just it's active", () => {
			AcademicLevel.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
					cy.contains(`${CheckValue}`)
						.click({ force: true })
						.should("have.class", "active")
						.invoke("text")
						.then((value) => {
							const chosen = value.trim()
							AcademicLevel.forEach((value) => {
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
		})
		it("Default Value", () => {
			cy.contains(`${Order.Academic}`)
				.click({ force: true })
				.should("have.class", "active")
				.invoke("text")
				.then((value) => {
					const chosen = value.trim()
					AcademicLevel.forEach((value) => {
						if (value == chosen) {
							return
						} else {
							cy.contains(value)
								.should("not.have.class", "active")
						}
					})
				})
		})
		context("Value show corret at order Preview", () => {
			AcademicLevel.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
					cy.contains(`${CheckValue}`)
						.click({ force: true })
					cy.get(SEL_DOCUMENT)
						.select(PaperTypes[0].title)
					cy.get(SEL_DISCIPLINE)
						.select(SubjectTypes[1].title)
					cy.contains(`${PaperFormat[1]}`)
						.click({ force: true })
					cy.get(TXT_TOPIC)
						.type(CopyText)
					cy.get(TXT_INSTRUCTIONS)
						.type(CopyText)
					cy.get(BTN_NEXT)
						.click({ force: true })
					// cy.wait(4000)
					cy.get(BTN_NEXT)
						.click({ force: true })
					cy.get(PRE_ACA)
						.invoke("text")
						.should("eq", `${CheckValue}`)
				})
			})
		})
	})
	context("Type of document field", () => {
		it("Empty -> Next", () => {
			//Add data for other required fields: Type of document, Instructions
			cy.get(SEL_DOCUMENT)
				.select('')
			cy.get(SEL_DISCIPLINE)
				.select(SubjectTypes[1].title)
			cy.contains(`${PaperFormat[1]}`)
				.click({ force: true })
			cy.get(TXT_TOPIC)
				.type(CopyText)
			cy.get(TXT_INSTRUCTIONS)
				.type(CopyText)
			cy.get(BTN_NEXT)
				.click({ force: true })
			cy.get('.alert')
				.should('contain', `${ErrorMessages.OrderFieldRequired}`)
		})
		it("Order by aphabet", () => {
			cy.get(SEL_DOCUMENT)
				.find('option') // Tìm tất cả các thẻ option trong thẻ select
				.then((options) => {
					const array = []; // Khởi tạo mảng để lưu các giá trị text
					// Lặp qua từng thẻ option và thêm giá trị text vào mảng
					options.each((index, option) => {
						const text = Cypress.$(option).text(); // Lấy giá trị text của option
						array.push(text)
					});
					const sortedValues = [...array].sort((a, b) => a.localeCompare(b));
					const targetValue = PlaceholderValue.DocumentTypes
					const modifiedArray = [targetValue, ...sortedValues.filter(value => value !== targetValue)];
					expect(array).to.deep.equal(modifiedArray)
					// In mảng array vào console
				});
		})
		it("Order by aphabet", () => {
			cy.get(SEL_DOCUMENT)
				.find('option') // Tìm tất cả các thẻ option trong thẻ select
				.then((options) => {
					const array = []
					options.each((index, option) => {
						const text = Cypress.$(option).text(); // Lấy giá trị text của option
						if (text == "Select your type of document") {
							return
						} else {
							array.push(text);
						}
					})
					const sortedValues = [...array].sort((a, b) => a.localeCompare(b))
					expect(array).to.deep.equal(sortedValues)
				})
		})
		it("Default value always on top", () => {
			cy.get(SEL_DOCUMENT)
				.find('option') // Tìm tất cả các thẻ option trong thẻ select
				.then((options) => {
					const array = []
					options.each((index, option) => {
						const text = Cypress.$(option).text(); // Lấy giá trị text của option
						array.push(text)
					});
					const sortedValues = [...array].sort((a, b) => a.localeCompare(b));
					const targetValue = `${Order.DocumentTypes}`
					const modifiedArray = [targetValue, ...sortedValues.filter(value => value !== targetValue)];
					expect(array).to.deep.equal(modifiedArray);
				})
		})
	})
	context("Upload file", () => {
        it.only("test", () => {
            cy.get('.upload-button')
                .selectFile('cypress/fixtures/discount.json', { force: true })
        })

    })
    context("Upload file", () => {
        it("test", () => {
            cy.get(BTN_UPLOAD)
                .selectFile('cypress/fixtures/discount.json', { force: true })
            // test xong upload file
        })

    })
})
