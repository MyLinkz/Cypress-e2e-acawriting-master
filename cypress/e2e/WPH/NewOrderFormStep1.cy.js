import {
	AcademicLevel, PaperFormat, PlaceholderValue, Order, ErrorMessages, CopyText,
	ExistEmail, PaperTypes, SubjectTypes, CommomTextbox, NoResult, StepOrderTitle,
	WrongEmail
} from "../../support/constants/defaultvalue"
import { faker } from "@faker-js/faker";
import {
	 LOCATE_NEWFORM, LOCATE_SIGNUP
} from "../../support/constants/locate"
import { ROUTERS } from "../../support/constants/url"
import {
	TCForInvalidEmail, ValidEmail, PasswordLV0, TCForInvaildPassword, TCForVaildPassword
} from "../../support/constants/validate"
import signinPage from "./pages/signinPage";
import orderForm from "./pages/orderFormPage";

// Cypress.config('baseUrl', 'http://192.168.1.55:3021/');
describe("Order Step 1", () => {
	beforeEach(function () {
		cy.visit(ROUTERS.NEW_ORDER)
	})
	context('Navigation', () => {
		it('Go to "Order form" from another pages', () => {
			cy.visit(ROUTERS.ORDER)
			cy.contains("Check the new form out!")
				.click({ force: true })
			cy.location("pathname")
				.should("eq", ROUTERS.NEW_ORDER)
		})
		it('Should navigate to the [Order Form] page when going from another page', () => {
			cy.location("pathname")
				.should("eq", ROUTERS.NEW_ORDER)
		})
		/*  it('Go to "Order form" incase signed in', () => {
			 signinPage.signin();
			 cy.visit(ROUTERS.NEW_ORDER)
			 cy.location("pathname")
				 .should("eq", ROUTERS.NEW_ORDER)
		 }) */
	})
	it('Should navigate to the [Homepage] page when clicking on the logo', () => {
		cy.visit(ROUTERS.NEW_ORDER)
		cy.get(LOCATE_NEWFORM.LOGO)
			.click({ force: true })
		cy.location("pathname")
			.should("eq", "/")
	})
	it('[Cancel] button, show slide up to confirm', () => {
		cy.get(LOCATE_NEWFORM.BTN_CANCEL)
			.click({ force: true })
		cy.get(LOCATE_NEWFORM.SLD_CONF)
			.should('be.visible')
	})
	it('[Continue With Your Order] button active', () => {
		cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
			.type(PaperTypes[4].title)
		cy.get(LOCATE_NEWFORM.BTN_CANCEL)
			.click({ force: true })
		cy.get(LOCATE_NEWFORM.BTN_CONT)
			.click({ force: true })
		cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
			.should('have.value', PaperTypes[4].title)
	})
	it('[Cancel Order] button', () => {
		//close silde and reset value
		cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
			.type(PaperTypes[4].title)
		cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
			.type(SubjectTypes[4].title, { force: true })
		cy.get(LOCATE_NEWFORM.BTN_NEXT)
			.click({ force: true })
		cy.get(LOCATE_NEWFORM.BTN_CANCEL)
			.click({ force: true })
		cy.get(LOCATE_NEWFORM.BTN_CANCEL_CONF)
			.click({ force: true })
		cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
			.should('have.value', "")
	})
	context('[X] button', () => {
		it("Click on it", () => {
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.type(PaperTypes[4].title)
			cy.get(LOCATE_NEWFORM.BTN_CANCEL)
				.click({ force: true })
			cy.wait(1000)
			cy.get(LOCATE_NEWFORM.BTN_X)
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.should('have.value', PaperTypes[4].title)
		})
		it("Click on gray area", () => {
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.type(PaperTypes[4].title)
			cy.get(LOCATE_NEWFORM.BTN_CANCEL)
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.BACK_DROP)
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.should('have.value', PaperTypes[4].title)

		})
	})
	it('Check title of step', () => {
		cy.contains(StepOrderTitle.NewStep1)
			.should('be.visible')
	})
	context('Academic Level field', () => {
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
		context("Value show corret at order Preview", () => {
			AcademicLevel.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
					cy.contains(`${CheckValue}`)
						.click({ force: true })
					cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
						.contains(CheckValue)
						.should('be.visible')
				})
			})
		})
		context("Check change option successfully", () => {
			AcademicLevel.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
					cy.contains(CheckValue)
						.click({ force: true })
					cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
						.contains(CheckValue)
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
	})
	context('Type of document field', () => {
		it("Empty -> Next", () => {
			//Add data for other required fields: Type of document, Instructions
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.clear({ force: true })
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.type(SubjectTypes[1].title, { force: true })
			cy.contains(`${PaperFormat[1]}`)
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.BTN_NEXT)
				.click({ force: true })
			cy.contains(LOCATE_NEWFORM.ERR_MES)
				.should('be.visible')
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.parents('.input-group')
				.should('have.class', 'input-group__invalid')
		})
		it("Order by aphabet", () => {
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.type(' ')
				// .click({ force: true })
				.parents('.input-group')
				.next()
				.find('.item-js') // Tìm tất cả các thẻ option trong thẻ select
				.then((options) => {
					const array = []; // Khởi tạo mảng để lưu các giá trị text
					// Lặp qua từng thẻ option và thêm giá trị text vào mảng
					options.each((index, option) => {
						const text = Cypress.$(option).text(); // Lấy giá trị text của option
						array.push(text)
					})
					const sortedValues = [...array].sort((a, b) => a.localeCompare(b))
					expect(array).to.deep.equal(sortedValues)
					// In mảng array vào console
				});
		})
		context("All value show corret at order Preview", () => {
			PaperTypes.forEach((CheckValue) => {
				if (CheckValue.title == PlaceholderValue.DocumentTypes) {
					//skip this case because had check empty value
					return
				} else {
					it(`${CheckValue.title}`, () => {
						cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
							.type(' ')
							.parents('.input-group')
							.click({ force: true })
							.next()
							.find('.item-js')
							.contains('span', CheckValue.title)
							.click({ force: true })
						cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
							.should('contain', CheckValue.title)
					})
				}
			})
		})
		it("Default value", () => {
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.should('have.text', Order.NEW_DOC)
		})
		it("Check place holder", () => {
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.invoke('attr', 'placeholder')
				.should('equal', PlaceholderValue.NEW_DOC);
		})
		it("Check search live activity", () => {
			const keyword = "pap";
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.type(keyword, { force: true })
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js')
				.should('be.visible')
		})
		it("Check database equal with data on server", () => {
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.type(' ')
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js') // Tìm tất cả các thẻ option trong thẻ select
				.then((options) => {
					const array = []; // Khởi tạo mảng để lưu các giá trị text
					// Lặp qua từng thẻ option và thêm giá trị text vào mảng
					options.each((index, option) => {
						const text = Cypress.$(option).text().trim(); // Lấy giá trị text của option
						array.push(text);
					})
					const titlesArray = PaperTypes.map((item) => item.title);
					const filteredTitlesArray = titlesArray.filter((title) => title !== `${PlaceholderValue.DocumentTypes}`);
					expect(array).to.deep.equal(filteredTitlesArray)
				})
		})
		it("Input Uppercase letters", () => {
			const keyword = "PAPE";
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.type(keyword, { force: true })
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js') // Tìm tất cả các thẻ option trong thẻ select
				.then((options) => {
					const array = []; // Khởi tạo mảng để lưu các giá trị text
					// Lặp qua từng thẻ option và thêm giá trị text vào mảng
					options.each((index, option) => {
						const text = Cypress.$(option).text(); // Lấy giá trị text của option
						array.push(text);
					})
					const searchResults = array;
					const titlesArray = PaperTypes.map((item) => item.title);
					const resultData = [];
					const lowercaseKeyword = keyword.toLowerCase(); // Chuyển đổi từ khóa thành chữ thường
					for (let i = 0; i < titlesArray.length; i++) {
						// Chuyển đổi tiêu đề thành chữ thường
						const lowercaseTitle = titlesArray[i].toLowerCase();

						// Kiểm tra xem tiêu đề chuyển đổi có chứa từ khóa chuyển đổi hay không
						if (typeof titlesArray[i] === 'string' && lowercaseTitle.includes(lowercaseKeyword)) {
							resultData.push(titlesArray[i]); // Thêm tiêu đề vào mảng resultData
						}
					}
					searchResults.forEach((result) => {
						const lowercaseResult = result.toLowerCase();
						const lowercaseKeyword = keyword.toLowerCase();
						expect(lowercaseResult).to.include(lowercaseKeyword);
					});
					expect(array).to.deep.equal(resultData)
				})
		})
		it("Input Lowers letters", () => {
			const keyword = "pape";
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.type(keyword, { force: true })
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js') // Tìm tất cả các thẻ option trong thẻ select
				.then((options) => {
					const array = []; // Khởi tạo mảng để lưu các giá trị text
					// Lặp qua từng thẻ option và thêm giá trị text vào mảng
					options.each((index, option) => {
						const text = Cypress.$(option).text(); // Lấy giá trị text của option
						array.push(text);
					})
					const searchResults = array;
					const titlesArray = PaperTypes.map((item) => item.title);
					const resultData = [];
					const lowercaseKeyword = keyword.toLowerCase(); // Chuyển đổi từ khóa thành chữ thường
					for (let i = 0; i < titlesArray.length; i++) {
						// Chuyển đổi tiêu đề thành chữ thường
						const lowercaseTitle = titlesArray[i].toLowerCase();

						// Kiểm tra xem tiêu đề chuyển đổi có chứa từ khóa chuyển đổi hay không
						if (typeof titlesArray[i] === 'string' && lowercaseTitle.includes(lowercaseKeyword)) {
							resultData.push(titlesArray[i]); // Thêm tiêu đề vào mảng resultData
						}
					}
					searchResults.forEach((result) => {
						const lowercaseResult = result.toLowerCase();
						const lowercaseKeyword = keyword.toLowerCase();
						expect(lowercaseResult).to.include(lowercaseKeyword);
					});
					expect(array).to.deep.equal(resultData)
				})
		})
		it("Data has not search keywords", () => {
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.type(NoResult, { force: true })
			cy.contains(Order.NoResult)
				.should('be.visible')
		})
		it("Allow full character", () => {
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.type(CommomTextbox.FullCharacter, { force: true })
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.should('have.value', CommomTextbox.FullCharacter)
		})
		it("Show multi case", () => {
			const searchText = CommomTextbox.MultiResult
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.type(searchText, { force: true })
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js') // Tìm tất cả các thẻ option trong thẻ select
				.then((results) => {
					const searchResultsText = results.text().toLowerCase()
					const wordsArray = searchText.toLowerCase().trim().split(' ')
					console.log(wordsArray)
					const atLeastOneMatch = wordsArray.some((word) => {
						console.log(word)
						console.log(searchResultsText)
						console.log(searchResultsText.includes(word))
						return searchResultsText.includes(word);
					})
					// Sử dụng trình xác nhận của Cypress để kiểm tra kết quả
					console.log(atLeastOneMatch)
					expect(atLeastOneMatch).to.be.true;
				})
		})
		it("Allow click behavior", () => {
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.click({ force: true })
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js')
				.contains('span', PaperTypes[1].title)
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
				.should('contain', PaperTypes[1].title)
		})
	})
	context('Discipline field', () => {
		it("Empty -> Next", () => {
			//Add data for other required fields: Type of document, Instructions
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.type(PaperTypes[1].title)
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.clear({ force: true })
			cy.contains(`${PaperFormat[1]}`)
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.BTN_NEXT)
				.click({ force: true })
			cy.contains(LOCATE_NEWFORM.ERR_MES)
				.should('be.visible')
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.parents('.input-group')
				.should('have.class', 'input-group__invalid')
		})
		it("Order by aphabet", () => {
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.type(' ')
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js') // Tìm tất cả các thẻ option trong thẻ select
				.then((options) => {
					const array = []; // Khởi tạo mảng để lưu các giá trị text
					// Lặp qua từng thẻ option và thêm giá trị text vào mảng
					options.each((index, option) => {
						const text = Cypress.$(option).text(); // Lấy giá trị text của option
						array.push(text)
					})
					const sortedValues = [...array].sort((a, b) => a.localeCompare(b))
					expect(array).to.deep.equal(sortedValues)
					// In mảng array vào console
				});
		})
		context("All value show corret at order Preview", () => {
			SubjectTypes.forEach((CheckValue) => {
				if (CheckValue.title == PlaceholderValue.Discipline) {
					//skip this case because had check empty value
					return
				} else {
					it(`${CheckValue.title}`, () => {
						cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
							.type(' ')
							.parents('.input-group')
							.click({ force: true })
							.next()
							.find('.item-js')
							.contains('span', CheckValue.title)
							.click({ force: true })
						cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
							.should('contain', CheckValue.title)
					})
				}
			})
		})
		it("Default value", () => {
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.should('have.text', Order.NEW_DIS)
		})
		it("Check place holder", () => {
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.invoke('attr', 'placeholder')
				.should('equal', PlaceholderValue.NEW_DIS);
		})
		it("Check search live activity", () => {
			const keyword = "ac";
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.type(keyword, { force: true })
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js')
				.should('be.visible')
		})
		it("Check database equal with data on server", () => {
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.type(' ')
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js') // Tìm tất cả các thẻ option trong thẻ select
				.then((options) => {
					const array = []; // Khởi tạo mảng để lưu các giá trị text
					// Lặp qua từng thẻ option và thêm giá trị text vào mảng
					options.each((index, option) => {
						const text = Cypress.$(option).text().trim(); // Lấy giá trị text của option
						array.push(text);
					})
					const titlesArray = SubjectTypes.map((item) => item.title.trimEnd());
					const filteredTitlesArray = titlesArray.filter((title) => title !== `${PlaceholderValue.Discipline}`);
					console.log(array)
					console.log(filteredTitlesArray)
					expect(array).to.deep.equal(filteredTitlesArray)
				})
		})
		it("Input Uppercase letters", () => {
			const keyword = "AC";
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.type(keyword, { force: true })
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js') // Tìm tất cả các thẻ option trong thẻ select
				.then((options) => {
					const array = []; // Khởi tạo mảng để lưu các giá trị text
					// Lặp qua từng thẻ option và thêm giá trị text vào mảng
					options.each((index, option) => {
						const text = Cypress.$(option).text(); // Lấy giá trị text của option
						array.push(text);
					})
					const searchResults = array;
					const titlesArray = SubjectTypes.map((item) => item.title);
					const resultData = [];
					// resultData là check data đã khai báo
					const lowercaseKeyword = keyword.toLowerCase(); // Chuyển đổi từ khóa thành chữ thường
					for (let i = 0; i < titlesArray.length; i++) {
						// Chuyển đổi tiêu đề thành chữ thường
						const lowercaseTitle = titlesArray[i].toLowerCase();
						// Kiểm tra xem tiêu đề chuyển đổi có chứa từ khóa chuyển đổi hay không
						if (typeof titlesArray[i] === 'string' && lowercaseTitle.includes(lowercaseKeyword)) {
							resultData.push(titlesArray[i]); // Thêm tiêu đề vào mảng resultData
						}
					}
					searchResults.forEach((result) => {
						const lowercaseResult = result.toLowerCase();
						const lowercaseKeyword = keyword.toLowerCase();
						expect(lowercaseResult).to.include(lowercaseKeyword);
						// keyword khớp với Search result
					});
					expect(array).to.deep.equal(resultData)
					// kết quả trả về khớp với database
				})
		})
		it("Input Lowers letters", () => {
			const keyword = "acc";
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.type(keyword, { force: true })
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js') // Tìm tất cả các thẻ option trong thẻ select
				.then((options) => {
					const array = []; // Khởi tạo mảng để lưu các giá trị text
					// Lặp qua từng thẻ option và thêm giá trị text vào mảng
					options.each((index, option) => {
						const text = Cypress.$(option).text(); // Lấy giá trị text của option
						array.push(text);
					})
					const searchResults = array;
					const titlesArray = SubjectTypes.map((item) => item.title);
					const resultData = [];
					const lowercaseKeyword = keyword.toLowerCase(); // Chuyển đổi từ khóa thành chữ thường
					for (let i = 0; i < titlesArray.length; i++) {
						// Chuyển đổi tiêu đề thành chữ thường
						const lowercaseTitle = titlesArray[i].toLowerCase();

						// Kiểm tra xem tiêu đề chuyển đổi có chứa từ khóa chuyển đổi hay không
						if (typeof titlesArray[i] === 'string' && lowercaseTitle.includes(lowercaseKeyword)) {
							resultData.push(titlesArray[i]); // Thêm tiêu đề vào mảng resultData
						}
					}
					searchResults.forEach((result) => {
						const lowercaseResult = result.toLowerCase();
						const lowercaseKeyword = keyword.toLowerCase();
						expect(lowercaseResult).to.include(lowercaseKeyword);
					});
					expect(array).to.deep.equal(resultData)
				})
		})
		it("Data has not search keywords", () => {
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.type(NoResult, { force: true })
			cy.contains(Order.NoResult)
				.should('be.visible')
		})
		it("Allow full character", () => {
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.type(CommomTextbox.FullCharacter, { force: true })
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.should('have.value', CommomTextbox.FullCharacter)
		})
		it("Show multi case", () => {
			const searchText = CommomTextbox.MultiResult
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.type(searchText, { force: true })
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js') // Tìm tất cả các thẻ option trong thẻ select
				.then((results) => {
					const searchResultsText = results.text().toLowerCase()
					const wordsArray = searchText.toLowerCase().trim().split(' ')
					console.log(wordsArray)
					const atLeastOneMatch = wordsArray.some((word) => {
						console.log(word)
						console.log(searchResultsText)
						console.log(searchResultsText.includes(word))
						return searchResultsText.includes(word);
					})
					// Sử dụng trình xác nhận của Cypress để kiểm tra kết quả
					console.log(atLeastOneMatch)
					expect(atLeastOneMatch).to.be.true;
				})
		})
		it("Allow click behavior", () => {
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.click({ force: true })
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js')
				.contains('span', SubjectTypes[1].title)
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
				.should('contain', SubjectTypes[1].title)
		})
	})
	context('PaperFormat field', () => {
		context("Click button and just it's active", () => {
			PaperFormat.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
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
									cy.contains(value)
										.should("not.have.class", "active")
								}
							})
						})
				})
			})
		})
		context("Value show corret at order Preview", () => {
			PaperFormat.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
					cy.contains(`${CheckValue}`)
						.click({ force: true })
					cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
						.contains(CheckValue)
						.should('be.visible')
				})
			})
		})
		context("Check change option successfully", () => {
			PaperFormat.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
					cy.contains(CheckValue)
						.click({ force: true })
					cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
						.contains(CheckValue)
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
	context('[Next] button', () => {
		it('Navigate to step 2', () => {
			//Add data for other required fields: Type of document, Instructions
			cy.visit(ROUTERS.SIGN_IN)
			cy.get(LOCATE_SIGNIN.TXT_EMAIL)
				.type(ExistEmail.email)
			cy.get(LOCATE_SIGNIN.TXT_PASSWORD)
				.type(ExistEmail.password)
			cy.get(LOCATE_SIGNIN.BTN_SUB)
				.click({ force: true })
			cy.wait(2000)
			cy.get(LOCATE_SIGNUP.NUMBER_BALANCE)
				.should('be.visible')
			cy.visit(ROUTERS.NEW_ORDER)
			cy.contains(AcademicLevel[1])
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.type(PaperTypes[1].title)
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.type(SubjectTypes[1].title, { force: true })
			cy.contains(`${PaperFormat[1]}`)
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.BTN_NEXT)
				.click({ force: true })
			cy.contains(StepOrderTitle.NewStep2)
				.should('be.visible')
		})
		it('Empty Required field', () => {
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.clear({ force: true })
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.clear({ force: true })
			cy.get(LOCATE_NEWFORM.BTN_NEXT)
				.click({ force: true })
			cy.contains(LOCATE_NEWFORM.ERR_MES)
				.should('be.visible')
			cy.contains(StepOrderTitle.NewStep1)
				.should('be.visible')
		})
		it('The Sign in/up slide after click [Next] button', () => {
			cy.contains(AcademicLevel[1])
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.type(PaperTypes[1].title)
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.type(SubjectTypes[1].title, { force: true })
			cy.contains(`${PaperFormat[1]}`)
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.BTN_NEXT)
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.SLD_CONT)
				.should('be.visible')
		})
		it('Check save information at step 1', () => {
			cy.visit(ROUTERS.SIGN_IN)
			cy.get(LOCATE_SIGNIN.TXT_EMAIL)
				.type(ExistEmail.email)
			cy.get(LOCATE_SIGNIN.TXT_PASSWORD)
				.type(ExistEmail.password)
			cy.get(LOCATE_SIGNIN.BTN_SUB)
				.click({ force: true })
			cy.wait(2000)
			cy.get(LOCATE_SIGNUP.NUMBER_BALANCE)
				.should('be.visible')
			cy.visit(ROUTERS.NEW_ORDER)
			cy.contains(AcademicLevel[1])
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.type(PaperTypes[1].title)
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.type(SubjectTypes[1].title, { force: true })
			cy.contains(`${PaperFormat[1]}`)
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.BTN_NEXT)
				.click({ force: true })
			cy.wait(2000)
			cy.contains(AcademicLevel[1])
				.should('be.visible')
			cy.contains(PaperTypes[1].title)
				.should('be.visible')
			cy.contains(SubjectTypes[1].title)
				.should('be.visible')
			cy.contains(`${PaperFormat[1]}`)
				.should('be.visible')
		})
	})
	it('[Privacy Policy] hyperlink active', () => {
		cy.contains('Privacy Policy')
			.click({ force: true })
		cy.location('pathname')
			.should('eq', ROUTERS.POLICY_PRIVACY)
	})
	it('[Refund Policy] hyperlink active', () => {
		cy.contains('Refund Policy')
			.click({ force: true })
		cy.location('pathname')
			.should('eq', ROUTERS.POLICY_REFUND)
	})
	it('[Cookie Policy] hyperlink active', () => {
		cy.contains('Cookie Policy')
			.click({ force: true })
		cy.location('pathname')
			.should('eq', ROUTERS.POLICY_COOKIE)
	})
	it('[Terms Of Use] hyperlink active', () => {
		cy.contains('Terms Of Use')
			.click({ force: true })
		cy.location('pathname')
			.should('eq', ROUTERS.TERMS_AND_CONDITIONS)
	})
	it('[Acceptable Policy] hyperlink active', () => {
		cy.contains('Acceptable Policy')
			.click({ force: true })
		cy.location('pathname')
			.should('eq', ROUTERS.POLICY_ACCEPTABLE)
	})
	it('[WritersPerHour.com] hyperlink active', () => {
		cy.contains('WritersPerHour.com')
			.click({ force: true })
		cy.wait(3000)
			.location('pathname')
			.should('eq', '/')
	})
	context('Order Preview', () => {
		it('Default status of collapse', () => {
			cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_DETAILS)
				.should('not.have.class', LOCATE_NEWFORM.ORDER_PREVIEW_COL)
		})
		it('Icon [^] active and change to [v] when click on it', () => {
			cy.get(LOCATE_NEWFORM.ARROW_UP_LAP)
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.ARROW_DOWN_LAP)
				.should('be.visible')
				.click({ force: true })
				.get(LOCATE_NEWFORM.ARROW_UP_LAP)
				.should('be.visible')
		})
		it('Check display default fields & value', () => {
			cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
				.contains(Order.Academic)
				.should('be.visible')
			cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
				.contains(Order.PaperFormat)
				.should('be.visible')
		})
	})
	context('Tab New Customer', () => {
		beforeEach(function () {
			cy.contains(AcademicLevel[1])
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.type(PaperTypes[1].title)
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.type(SubjectTypes[1].title, { force: true })
			cy.contains(`${PaperFormat[1]}`)
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.BTN_NEXT)
				.click({ force: true })
		})
		context("[Email] textbox", () => {
			it('Copy & Paste', () => {
				cy.document().then((doc) => cy.spy(doc, 'execCommand').as('execCommand'))
				cy.get(LOCATE_SIGNUP.TXT_EMAIL)
					.type(CopyText)
				cy.get(LOCATE_SIGNUP.TXT_EMAIL)
					.invoke('val')
					.then(($temp) => {
						const txt = $temp
						cy.get(LOCATE_SIGNUP.TXT_EMAIL)
							.focus()
						cy.document().invoke('execCommand', 'copy')
						cy.get(LOCATE_SIGNUP.TXT_EMAIL)
							.clear()
						cy.get(LOCATE_SIGNUP.TXT_EMAIL)
							.type(`${txt}`)
						cy.get(LOCATE_SIGNUP.TXT_EMAIL)
							.invoke('val')
							.should("contain", CopyText)
					})
			})
			context("Invaild Email:", function () {
				it("Leaving the field empty", () => {
					cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
						.type("123123")
					cy.get(LOCATE_SIGNUP.BTN_SUB)
						.click({ force: true })
					cy.get(LOCATE_SIGNUP.MES_ERROR)
						.should("contain", ErrorMessages.EmailRequired)
				})
				TCForInvalidEmail.forEach((value) => {
					it(`${value.description}`, () => {
						cy.get(LOCATE_SIGNUP.TXT_EMAIL)
							.type(`${value.email}`)
						cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
							.type("123123")
						cy.get(LOCATE_SIGNUP.BTN_SUB)
							.click({ force: true })
						cy.wait(2000)
						cy.get(LOCATE_SIGNUP.MES_ERROR)
							.eq(0)
							.should("contain", ErrorMessages.InvalidEmail)
					})
				})
			})
			context("Valid email", function () {
				ValidEmail.forEach((value) => {
					it(`Input email:` + ` ${value}`, () => {
						cy.get(LOCATE_SIGNUP.TXT_EMAIL)
							.type(`${value}`)
						cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
							.type("123123")
						cy.get(LOCATE_SIGNUP.CHECKBOX)
							.click({ force: true })
						cy.get(LOCATE_SIGNUP.BTN_SUB)
							.click()
						cy.wait(2000)
						cy.contains(StepOrderTitle.NewStep2)
							.should('be.visible')
					})
				})
			})
		})
		context("Password Field", () => {
			it('Copy & Paste', () => {
				cy.document().then((doc) => cy.spy(doc, 'execCommand').as('execCommand'))
				cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
					.type(CopyText)
				cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
					.invoke('val')
					.then(($temp) => {
						// const txt = $temp
						const txt = $temp
						cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
							.focus()
						cy.document()
							.invoke('execCommand', 'copy')
						cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
							.clear()
						cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
							.type(`${txt}`)
						cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
							.invoke('val')
							.should("contain", CopyText)
					})
			})
			it("Password convert to '*'", () => {
				cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
					.type(CopyText)
				cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
					.should('have.attr', 'type', 'password')
			})
			context("Invailid Password", () => {
				TCForInvaildPassword.forEach((value) => {
					it(`${value.description}`, () => {
						cy.get(LOCATE_SIGNUP.TXT_EMAIL)
							.type(faker.internet.email(), { force: true })
						cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
							.type(value.password, { force: true })
						cy.get(LOCATE_SIGNUP.BTN_SUB)
							.click({ force: true })
						cy.wait(2000)
						cy.get(LOCATE_SIGNUP.MES_ERROR)
							.should("contain", `${ErrorMessages.PasswordLeast6}`)
					})
				})
			})
			context("Vailid Password", () => {
				it("Leave the Full Name field empty", () => {
					cy.get(LOCATE_SIGNUP.TXT_EMAIL)
						.type(faker.internet.email())
					cy.get(LOCATE_SIGNUP.CHECKBOX)
						.click({ force: true })
					cy.get(LOCATE_SIGNUP.BTN_SUB)
						.click({ force: true })
					cy.wait(2000)
					cy.get(LOCATE_SIGNUP.MES_ERROR)
						.should("contain", ErrorMessages.PassRequired)
				})
				TCForVaildPassword.forEach((value) => {
					it(`${value.description}`, () => {
						cy.get(LOCATE_SIGNUP.TXT_EMAIL).type(faker.internet.email())
						cy.get(LOCATE_SIGNUP.TXT_PASSWORD).type(value.password)
						cy.get(LOCATE_SIGNUP.BTN_SUB)
							.click({ force: true })
						cy.get(LOCATE_SIGNUP.CHECKBOX)
							.click({ force: true })
						cy.wait(2000)
						cy.contains(StepOrderTitle.NewStep2)
							.should('be.visible')
					})
				})
			})
		})
		it('[Terms and Conditions] hyperLink active', () => {
			cy.contains('Terms and Conditions')
				.click({ force: true })
			cy.location('pathname')
				.should('eq', ROUTERS.TERMS_AND_CONDITIONS)
		})
		it('[Privacy Policy] hyperLink active', () => {
			cy.contains('Privacy Policy')
				.click({ force: true })
			cy.location('pathname')
				.should('eq', ROUTERS.POLICY_PRIVACY)
		})
		//below case is error after update
		it('Sign Up successfully if email contains white space before and after', () => {
			cy.get(LOCATE_SIGNIN.TXT_EMAIL)
				.type(`	${faker.internet.email()}	`)
			cy.get(LOCATE_SIGNIN.TXT_PASSWORD)
				.type(ExistEmail.password)
			cy.get(LOCATE_SIGNIN.BTN_SUB)
				.click({ force: true })
			cy.wait(2000)
			cy.contains(StepOrderTitle.NewStep2)
				.should('be.visible')
		})
	})
	context('Tab Returned Customer', () => {
		beforeEach(function () {
			cy.contains(AcademicLevel[1])
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
				.type(PaperTypes[1].title)
			cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
				.type(SubjectTypes[1].title, { force: true })
			cy.contains(`${PaperFormat[1]}`)
				.click({ force: true })
			cy.get(LOCATE_NEWFORM.BTN_NEXT)
				.click({ force: true })
			cy.contains('Returned Customer')
				.click({ force: true })
		})
		it('Sign In succesfully', () => {
			cy.get(LOCATE_SIGNIN.TXT_EMAIL)
				.type(ExistEmail.email)
			cy.get(LOCATE_SIGNIN.TXT_PASSWORD)
				.type(ExistEmail.password)
			cy.get(LOCATE_SIGNIN.BTN_SUB)
				.click({ force: true })
			cy.wait(2000)
			cy.contains(StepOrderTitle.NewStep2)
				.should('be.visible')
		})
		context('Email Field', () => {
			it('Copy & Paste', () => {
				cy.document().then((doc) => cy.spy(doc, 'execCommand').as('execCommand'))
				cy.get(LOCATE_SIGNIN.TXT_EMAIL)
					.type(CopyText)
				cy.get(LOCATE_SIGNIN.TXT_EMAIL).invoke('val').then(($temp) => {
					const txt = $temp
					cy.get(LOCATE_SIGNIN.TXT_EMAIL)
						.focus()
					cy.document()
						.invoke('execCommand', 'copy')
					cy.get(LOCATE_SIGNIN.TXT_EMAIL)
						.clear()
					cy.get(LOCATE_SIGNIN.TXT_EMAIL)
						.type(`${txt}`)
					cy.get(LOCATE_SIGNIN.TXT_EMAIL)
						.invoke('val')
						.should("contain", CopyText)
				})
			})
			it("Leaving the field empty", () => {
				cy.get(LOCATE_SIGNIN.TXT_PASSWORD)
					.type("123123")
				cy.get(LOCATE_SIGNIN.BTN_SUB)
					.click({ force: true })
				cy.wait(1000)
				cy.get(LOCATE_SIGNIN.MES_ERROR)
					.should("contain", ErrorMessages.EmailRequired)
			})
			it("Wrong email", () => {
				cy.get(LOCATE_SIGNIN.TXT_EMAIL)
					.type(WrongEmail)
				cy.get(LOCATE_SIGNIN.TXT_PASSWORD)
					.type("123123")
				cy.get(LOCATE_SIGNIN.BTN_SUB)
					.click({ force: true })
				cy.wait(1000)
				cy.get(LOCATE_SIGNIN.MES_ERROR)
					.should("contain", ErrorMessages.WrongEmailorPass)
			})
			it("Invalid email", () => {
				cy.get(LOCATE_SIGNIN.TXT_EMAIL)
					.type(TCForInvalidEmail[0].email)
				cy.get(LOCATE_SIGNIN.TXT_PASSWORD)
					.type("123123")
				cy.get(LOCATE_SIGNIN.BTN_SUB)
					.click({ force: true })
				cy.wait(1000)
				cy.get(LOCATE_SIGNIN.MES_ERROR)
					.should("contain", ErrorMessages.InvalidEmail)
			})
			it("Input exist email", () => {
				cy.get(LOCATE_SIGNIN.TXT_EMAIL)
					.type(ExistEmail.email)
				cy.get(LOCATE_SIGNIN.TXT_PASSWORD)
					.type(ExistEmail.password)
				cy.get(LOCATE_SIGNIN.BTN_SUB)
					.click({ force: true })
				cy.wait(2000)
				cy.contains(StepOrderTitle.NewStep2)
					.should('be.visible')
			})
		})
		context("Password field", () => {
			it('Copy & Paste', () => {
				cy.document().then((doc) => cy.spy(doc, 'execCommand').as('execCommand'))
				cy.get(LOCATE_SIGNIN.TXT_PASSWORD)
					.type(CopyText)
				cy.get(LOCATE_SIGNIN.TXT_PASSWORD).invoke('val').then(($temp) => {
					const txt = $temp
					cy.get(LOCATE_SIGNIN.TXT_PASSWORD)
						.focus()
					cy.document().invoke('execCommand', 'copy')
					cy.get(LOCATE_SIGNIN.TXT_PASSWORD)
						.clear()
					cy.get(LOCATE_SIGNIN.TXT_PASSWORD)
						.type(`${txt}`)
					cy.get(LOCATE_SIGNIN.TXT_PASSWORD)
						.invoke('val')
						.should("contain", CopyText)
				})
			})
			it("Leaving the field empty", () => {
				cy.get(LOCATE_SIGNIN.TXT_EMAIL)
					.type(ExistEmail.email)
				cy.get(LOCATE_SIGNIN.BTN_SUB)
					.click({ force: true })
				cy.wait(1000)
				cy.get(LOCATE_SIGNIN.MES_ERROR)
					.should("contain", ErrorMessages.PassRequired)
				// .contains("The password field is required.")
				// .should('')
			})
			it("Wrong Password", () => {
				cy.get(LOCATE_SIGNIN.TXT_EMAIL)
					.type(ExistEmail.email)
				cy.get(LOCATE_SIGNIN.TXT_PASSWORD)
					.type("Password")
				cy.get(LOCATE_SIGNIN.BTN_SUB)
					.click({ force: true })
				cy.wait(1000)
				cy.get(LOCATE_SIGNIN.MES_ERROR)
					.should("contain", ErrorMessages.WrongEmailorPass)
			})
			it("Invalid Password", () => {
				cy.get(LOCATE_SIGNIN.TXT_EMAIL)
					.type(ExistEmail.email)
				cy.get(LOCATE_SIGNIN.TXT_PASSWORD)
					.type(PasswordLV0[0].password)
				cy.get(LOCATE_SIGNIN.BTN_SUB)
					.click({ force: true })
				cy.wait(1000)
				cy.get(LOCATE_SIGNIN.MES_ERROR)
					.should("contain", ErrorMessages.PasswordLeast6)
			})
			it("Input correct email", () => {
				cy.get(LOCATE_SIGNIN.TXT_EMAIL)
					.type(ExistEmail.email)
				cy.get(LOCATE_SIGNIN.TXT_PASSWORD)
					.type(ExistEmail.password)
				cy.get(LOCATE_SIGNIN.BTN_SUB)
					.click({ force: true })
				cy.wait(2000)
				cy.contains(StepOrderTitle.NewStep2)
					.should('be.visible')
			})
		})
	})
})

