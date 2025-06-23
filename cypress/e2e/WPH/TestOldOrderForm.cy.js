// import { contains } from "cypress/types/jquery"
import {
	PaperTypes, AcademicLevel, PaperFormat, CopyText,
	SubjectTypes, ErrorMessages, PlaceholderValue, TopicLength,
	LOCATE_OLDFORM,Order
} from "../../support/constants/defaultvalue"
import {
	ROUTERS
} from "../../support/constants/url"


describe("test Order function", () => {
	beforeEach(function () {
		cy.visit(ROUTERS.ORDER)
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
			cy.get(LOCATE_OLDFORM.RAD_ACADEMIC).within(() => {
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
		})
		context("Value show corret at order Preview", () => {
			AcademicLevel.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
					cy.contains(`${CheckValue}`)
						.click({ force: true })
					cy.get(LOCATE_OLDFORM.SEL_DOCUMENT)
						.select(PaperTypes[1].title)
					cy.get(LOCATE_OLDFORM.SEL_DISCIPLINE)
						.select(SubjectTypes[1].title)
					cy.contains(`${PaperFormat[1]}`)
						.click({ force: true })
					cy.get(LOCATE_OLDFORM.TXT_TOPIC)
						.type(CopyText)
					cy.get(LOCATE_OLDFORM.TXT_INSTRUCTIONS)
						.type(CopyText)
					cy.get(LOCATE_OLDFORM.BTN_NEXT)
						.click({ force: true })
					cy.get(LOCATE_OLDFORM.BTN_NEXT)
						.click({ force: true })
					cy.get(LOCATE_OLDFORM.PRE_ACA)
						.invoke("text")
						.should("eq", `${CheckValue}`)

				})
			})
		})
	})
	context("Type of document field", () => {
		it("Empty -> Next", () => {
			//Add data for other required fields: Type of document, Instructions
			cy.get(LOCATE_OLDFORM.SEL_DOCUMENT)
				.select('')
			cy.get(LOCATE_OLDFORM.SEL_DISCIPLINE)
				.select(SubjectTypes[1].title)
			cy.contains(`${PaperFormat[1]}`)
				.click({ force: true })
			cy.get(LOCATE_OLDFORM.TXT_TOPIC)
				.type(CopyText)
			cy.get(LOCATE_OLDFORM.TXT_INSTRUCTIONS)
				.type(CopyText)
			cy.get(LOCATE_OLDFORM.BTN_NEXT)
				.click({ force: true })
			cy.get(LOCATE_OLDFORM.ERR_MES)
				.should('contain', `${ErrorMessages.OrderFieldRequired}`)
		})
		it("Order by aphabet", () => {
			cy.get(LOCATE_OLDFORM.SEL_DOCUMENT)
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
		it("Placeholder always on top & data on website = data saved", () => {
			cy.get(LOCATE_OLDFORM.SEL_DOCUMENT)
				.find('option') // Tìm tất cả các thẻ option trong thẻ select
				.then((options) => {
					const array = []
					options.each((index, option) => {
						const text = Cypress.$(option).text(); // Lấy giá trị text của option
						array.push(text)
					});
					const sortedValues = [...array].sort((a, b) => a.localeCompare(b));
					const targetValue = `${PlaceholderValue.DocumentTypes}`
					const modifiedArray = [targetValue, ...sortedValues.filter(value => value !== targetValue)];
					expect(array).to.deep.equal(modifiedArray);
				})
		})
		context("Value show corret at order Preview", () => {
			PaperTypes.forEach((CheckValue) => {
				if (CheckValue.title == PlaceholderValue.DocumentTypes) {
					//skip this case because had check empty value
					return
				} else {
					it(`${CheckValue.title}`, () => {
						cy.contains(AcademicLevel[0])
							.click({ force: true })
						cy.get(LOCATE_OLDFORM.SEL_DOCUMENT)
							.select(`${CheckValue.id}`, { timeout: 10000 })
						cy.get(LOCATE_OLDFORM.SEL_DISCIPLINE)
							.select(SubjectTypes[1].title)
						cy.contains(`${PaperFormat[1]}`)
							.click({ force: true })
						cy.get(LOCATE_OLDFORM.TXT_TOPIC)
							.type(CopyText)
						cy.get(LOCATE_OLDFORM.TXT_INSTRUCTIONS)
							.type(CopyText)
						cy.get(LOCATE_OLDFORM.BTN_NEXT)
							.click({ force: true })
						// cy.wait(4000)
						cy.get(LOCATE_OLDFORM.BTN_NEXT)
							.click({ force: true })
						cy.get(LOCATE_OLDFORM.PRE_DOC)
							.invoke("text")
							.should("contain", `${CheckValue.title}`)
					})
				}
			})
		})
		it("Default value", () => {
			cy.get(LOCATE_OLDFORM.SEL_DOCUMENT)
				.find('option:selected')
				.invoke('text')
				.should('eq', Order.DocumentTypes)
		})
	})
	context("Discipline field", () => {
		it("Empty -> Next", () => {
			//Add data for other required fields: Type of document, Instructions
			cy.get(LOCATE_OLDFORM.SEL_DOCUMENT)
				.select(PaperTypes[1].title)
			cy.get(LOCATE_OLDFORM.SEL_DISCIPLINE)
				.select('')
			cy.contains(`${PaperFormat[1]}`)
				.click({ force: true })
			cy.get(LOCATE_OLDFORM.TXT_TOPIC)
				.type(CopyText)
			cy.get(LOCATE_OLDFORM.TXT_INSTRUCTIONS)
				.type(CopyText)
			cy.get(LOCATE_OLDFORM.BTN_NEXT)
				.click({ force: true })
			cy.get(LOCATE_OLDFORM.ERR_MES)
				.should('contain', `${ErrorMessages.OrderFieldRequired}`)
		})
		it("Order by aphabet", () => {
			cy.get(LOCATE_OLDFORM.SEL_DISCIPLINE)
				.find('option') // Tìm tất cả các thẻ option trong thẻ select
				.then((options) => {
					const array = []; // Khởi tạo mảng để lưu các giá trị text
					// Lặp qua từng thẻ option và thêm giá trị text vào mảng
					options.each((index, option) => {
						const text = Cypress.$(option).text(); // Lấy giá trị text của option
						array.push(text)
					});
					const sortedValues = [...array].sort((a, b) => a.localeCompare(b));
					const targetValue = PlaceholderValue.Discipline
					const modifiedArray = [targetValue, ...sortedValues.filter(value => value !== targetValue)];
					expect(array).to.deep.equal(modifiedArray);
					// In mảng array vào console
				});
		})
		it("Placeholder always on top & data on website = data saved", () => {
			cy.get(LOCATE_OLDFORM.SEL_DISCIPLINE)
				.find('option') // Tìm tất cả các thẻ option trong thẻ select
				.then((options) => {
					const array = []
					options.each((index, option) => {
						const text = Cypress.$(option).text(); // Lấy giá trị text của option
						array.push(text)
					});
					const sortedValues = [...array].sort((a, b) => a.localeCompare(b));
					const targetValue = `${PlaceholderValue.Discipline}`
					const modifiedArray = [targetValue, ...sortedValues.filter(value => value !== targetValue)];
					expect(array).to.deep.equal(modifiedArray);
				})
		})
		context("Value show corret at order Preview", () => {
			SubjectTypes.forEach((CheckValue) => {
				it(`${CheckValue.title}`, () => {
					if (CheckValue.title == PlaceholderValue.Discipline) {
						//skip this case because had check empty value
						return
					} else {
						cy.wait(3000)
						cy.contains(`${AcademicLevel[2]}`)
							.click({ force: true })
						cy.get(LOCATE_OLDFORM.SEL_DOCUMENT)
							.select(PaperTypes[2].title)
						cy.get(LOCATE_OLDFORM.SEL_DISCIPLINE)
							.select(CheckValue.title)
						cy.contains(`${PaperFormat[1]}`)
							.click({ force: true })
						cy.get(LOCATE_OLDFORM.TXT_TOPIC)
							.type(CopyText)
						cy.get(LOCATE_OLDFORM.TXT_INSTRUCTIONS)
							.type(CopyText)
						cy.wait(3000)
						cy.get(LOCATE_OLDFORM.BTN_NEXT)
							.click({ force: true })
						cy.get(LOCATE_OLDFORM.BTN_NEXT)
							.click({ force: true })
						cy.get(LOCATE_OLDFORM.PRE_DIS)
							.invoke("text")
							.should("contain", `${CheckValue.title}`)
					}
				})
			})
		})
		it("Default value", () => {
			cy.get(LOCATE_OLDFORM.SEL_DISCIPLINE)
				.find('option:selected')
				.invoke('text')
				.should('eq', Order.Discipline)
		})
	})
	context("Paper Format field", () => {
		context("Click button and just it's active", () => {
			PaperFormat.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
					cy.get(LOCATE_OLDFORM.RAD_PAPER).within(() => {

						cy.contains(`${CheckValue}`)
							.click({ force: true })
							.should("have.class", "active")
							.invoke("text")
							.then((value) => {
								const chosen = value.trim()
								PaperFormat.forEach((value) => {
									if (value == chosen) {
										return
									} else {
										console.log(value)
										cy.contains(value)
											.should("not.have.class", "active")
									}
								})
							})
					})
				})
			})
		})
		it("Default Value", () => {
			cy.contains(`${Order.PaperFormat}`)
				.click({ force: true })
				.should("have.class", "active")
				.invoke("text")
				.then((value) => {
					const chosen = value.trim()
					PaperFormat.forEach((value) => {
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
	context("Title field", () => {
        it("Empty textbox -> Next", () => {
            cy.get(LOCATE_OLDFORM.TXT_TOPIC)
                .clear()
            cy.contains(AcademicLevel[0])
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.SEL_DOCUMENT)
                .select(PaperTypes[1].title)
            cy.get(LOCATE_OLDFORM.SEL_DISCIPLINE)
                .select(SubjectTypes[1].title)
            cy.contains(`${PaperFormat[1]}`)
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.TXT_INSTRUCTIONS)
                .type(CopyText)
            cy.get(LOCATE_OLDFORM.BTN_NEXT)
                .click({ force: true })
            cy.location('pathname')
                .should("eq", "/order/calculate")

        })
        it("Check count character", () => {
            cy.get(LOCATE_OLDFORM.TXT_TOPIC)
                .type(TopicLength.Longer)
            cy.get(LOCATE_OLDFORM.COUNT_CHAR)
                .invoke("text")
                .should('eq', `${TopicLength.EqualNumber} / 300`)
        })
        it("Input <300 character", () => {
            cy.get(LOCATE_OLDFORM.TXT_TOPIC)
                .type(TopicLength.LessThan)
            cy.contains(AcademicLevel[0])
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.SEL_DOCUMENT)
                .select(PaperTypes[1].title)
            cy.get(LOCATE_OLDFORM.SEL_DISCIPLINE)
                .select(SubjectTypes[1].title)
            cy.contains(`${PaperFormat[1]}`)
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.TXT_INSTRUCTIONS)
                .type(CopyText)
            cy.get(LOCATE_OLDFORM.BTN_NEXT)
                .click({ force: true })
            cy.location('pathname')
                .should("eq", "/order/calculate")
        })
        it("Input =300 character", () => {
            cy.get(LOCATE_OLDFORM.TXT_TOPIC)
                .type(TopicLength.Equal)
            cy.get(LOCATE_OLDFORM.COUNT_CHAR)
                .invoke("text")
                .should('eq', `${TopicLength.EqualNumber} / 300`)
            cy.contains(AcademicLevel[0])
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.SEL_DOCUMENT)
                .select(PaperTypes[1].title)
            cy.get(LOCATE_OLDFORM.SEL_DISCIPLINE)
                .select(SubjectTypes[1].title)
            cy.contains(`${PaperFormat[1]}`)
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.TXT_INSTRUCTIONS)
                .type(CopyText)
            cy.get(LOCATE_OLDFORM.BTN_NEXT)
                .click({ force: true })
            cy.location('pathname')
                .should("eq", "/order/calculate")
        })
        it("Input >300 character", () => {
            cy.get(LOCATE_OLDFORM.TXT_TOPIC)
                .type(TopicLength.Longer)
            // cy.get(LOCATE_OLDFORM.TXT_TOPIC)
            // 	.should("have.text", TopicLength.Equal)
            cy.contains(AcademicLevel[0])
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.SEL_DOCUMENT)
                .select(PaperTypes[1].title)
            cy.get(LOCATE_OLDFORM.SEL_DISCIPLINE)
                .select(SubjectTypes[1].title)
            cy.contains(`${PaperFormat[1]}`)
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.TXT_INSTRUCTIONS)
                .type(CopyText)
            cy.get(LOCATE_OLDFORM.BTN_NEXT)
                .click({ force: true })
            cy.location('pathname')
                .should("eq", "/order/calculate")
        })
        it("Value show corret at order Preview", () => {
            cy.get(LOCATE_OLDFORM.TXT_TOPIC)
                .type(TopicLength.Longer)

            cy.contains(AcademicLevel[0])
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.SEL_DOCUMENT)
                .select(PaperTypes[1].title)
            cy.get(LOCATE_OLDFORM.SEL_DISCIPLINE)
                .select(SubjectTypes[1].title)
            cy.contains(`${PaperFormat[1]}`)
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.TXT_INSTRUCTIONS)
                .type(CopyText)
            cy.get(LOCATE_OLDFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.PRE_TOPIC)
                .invoke("text")/*  */
                .should("contain", TopicLength.Equal)
        })
        it("Enter space character, and auto trim", () => {
            cy.get(LOCATE_OLDFORM.TXT_TOPIC)
                .type(TopicLength.Spacing)
            cy.contains(AcademicLevel[0])
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.SEL_DOCUMENT)
                .select(PaperTypes[1].title)
            cy.get(LOCATE_OLDFORM.SEL_DISCIPLINE)
                .select(SubjectTypes[1].title)
            cy.contains(`${PaperFormat[1]}`)
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.TXT_INSTRUCTIONS)
                .type(CopyText)
            cy.get(LOCATE_OLDFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.PRE_TOPIC)
                .invoke("text")/*  */
                .should("contain", TopicLength.Spacing.trim())
        })
    })
    context("Textbox Instructions", () => {
        it("Empty", () => {
            cy.get(LOCATE_OLDFORM.TXT_INSTRUCTIONS)
                .clear()
            cy.contains(AcademicLevel[0])
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.SEL_DOCUMENT)
                .select(PaperTypes[1].title)
            cy.get(LOCATE_OLDFORM.SEL_DISCIPLINE)
                .select(SubjectTypes[1].title)
            cy.contains(`${PaperFormat[1]}`)
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.TXT_TOPIC)
                .type(TopicLength.Spacing)
            cy.get(LOCATE_OLDFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_OLDFORM.ERR_MES)
                .should("contain", ErrorMessages.OrderFieldRequired)
        })
        //not working on old order form
        // it("Input text successfully",()=>{
        //     cy.get(LOCATE_OLDFORM.TXT_INSTRUCTIONS)
        //         .type(CopyText)
        //     cy.get(LOCATE_OLDFORM.TXT_INSTRUCTIONS)
        //         .should("contain",CopyText)
        // })
    })

})
