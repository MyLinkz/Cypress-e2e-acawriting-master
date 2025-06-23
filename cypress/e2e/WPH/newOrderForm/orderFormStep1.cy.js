import {
	AcademicLevel, PaperFormat, PlaceholderValue, Order, PaperTypes, SubjectTypes, CommomTextbox, NoResult, StepOrderTitle,

} from "../../../support/constants/defaultvalue"
import { ROUTERS } from "../../../support/constants/url";
import orderFormPage, { defaultvalue } from "../pages/orderFormPage";
import { dataOrder2 } from "../../../fixtures/data/orderForm";
import { functions } from "lodash";
import Auth from "../../../getData/WPH/getAuth";
import {loadExcelData} from "../../../support/excelHelper";

const fileName = "./data/DataOrderForm.xlsx";
const sheetName = "Sheet1";
const dataID = 1;

describe("Order Step 1", () => {
	const dataOrder = dataOrder2;
	function getDataOrder() {
		const dataOrderForm = Cypress.env('dataOrderForm');
		return dataOrderForm; // Trả ra giá trị ORDER_TYPE
	}
	beforeEach(function () {
		if (this.currentTest.title === '[Skip beforeEach]') {
			cy.log('Skipping beforeEach for Test 1');
			this.skip(); // Bỏ qua beforeEach cho test case này
		}
		signinPage
		cy.visit(ROUTERS.ORDER);
	})

	before(() => {
		loadExcelData(fileName, sheetName).then((data) => {
			cy.wrap(data).as('testData');
			cy.get('@testData').then((testData) => {
				const dataObject = testData[dataID];  // dòng 2
				Cypress.env('dataOrderForm', dataObject);
			});
		});
	});

	context('Navigation', () => {
		it('Should navigate to the [Order Form] page by URL', () => {
			orderFormPage.verifyNavigate(ROUTERS.ORDER, orderFormPage.NewStep1)
		})
		it('Should navigate to the [Order Form] page when going from another page', () => {
			cy.visit(ROUTERS.HOME)
			orderFormPage.verifyNavigate(ROUTERS.ORDER, orderFormPage.NewStep1)
		})
	})
	it('Should navigate to the [Homepage] page when clicking on it', () => {
		cy.get(orderFormPage.BTN_LOGO)
			.click({ force: true })
		cy.location("pathname")
			.should("eq", ROUTERS.HOME)
	})
	it('Should show the [Cancel Confirm] slide up when click on it', () => {
		cy.get(orderFormPage.BTN_CANCEL)
			.click({ force: true })
		cy.get(orderFormPage.SLD_CONF)
			.should('be.visible')
	})
	context('[Cancel Confirm] slide up', () => {
		it("Shouldn't reset data when user on the [Continue With Your Order] button", () => {
			orderFormPage.inputPaperType(dataOrder.TYPE_OF_DOCUMENT)
			// .type(DocumentTypes[4].title)
			cy.get(orderFormPage.BTN_CANCEL)
				.click({ force: true })
			cy.get(orderFormPage.BTN_CONT)
				.click({ force: true })
			cy.get(orderFormPage.SEL_DOCUMENT)
				.siblings()
				.should('contain', dataOrder.TYPE_OF_DOCUMENT);
		})
		it('Should reset data when user click on [Cancel Order] button', () => {
			//close silde and reset value
			cy.get(orderFormPage.SEL_DOCUMENT)
				.type(PaperTypes[4].title)
			cy.get(orderFormPage.SEL_DISCIPLINE)
				.type(dataOrder.DISCIPLINE, { force: true })
			orderFormPage.clickNextBTN();
			cy.get(orderFormPage.BTN_CANCEL)
				.click({ force: true })
			cy.get(orderFormPage.BTN_CANCEL_CONF)
				.click({ force: true })
			cy.get(orderFormPage.SEL_DOCUMENT)
				.should('have.value', "")
		})
		context('[X] button', () => {
			it("Click on it", () => {
				cy.get(orderFormPage.SEL_DOCUMENT)
					.type(PaperTypes[4].title)
				cy.get(orderFormPage.BTN_CANCEL)
					.click({ force: true })
				cy.wait(1000)
				orderFormPage.clickXBTNForm();
				cy.get(orderFormPage.SEL_DOCUMENT)
					.should('have.value', PaperTypes[4].title)
			})
			it("Click on gray area", () => {
				cy.get(orderFormPage.SEL_DOCUMENT)
					.type(PaperTypes[4].title)
				cy.get(orderFormPage.BTN_CANCEL)
					.click({ force: true })
				cy.get(orderFormPage.BACK_DROP)
					.click({ force: true })
				cy.get(orderFormPage.SEL_DOCUMENT)
					.should('have.value', PaperTypes[4].title)

			})
		})
	})
	it('Check title of step', () => {
		cy.contains(orderFormPage.NewStep1)
			.should('be.visible')
		cy.get('h1').should('have.text', orderFormPage.NewStep1);
	})
	context('Academic Level field', () => {
		context("Click button and just it's active", () => {
			AcademicLevel.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
					orderFormPage.clickAcaLevel(CheckValue);
					orderFormPage.verifyAcaLevelActiveWithStick(CheckValue);
				})
			})
		})
		context("Value show corret at order Preview", () => {
			AcademicLevel.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
					cy.contains(`${CheckValue}`)
						.click({ force: true })
					cy.get(orderFormPage.ORDER_PREVIEW)
						.contains(CheckValue)
						.should('be.visible')
				})
			})
		})
		context("Check change option successfully", () => {
			AcademicLevel.forEach((CheckValue) => {
				it(`${CheckValue}`, () => {
					orderFormPage.clickAcaLevel(CheckValue);
					cy.get(orderFormPage.ORDER_PREVIEW)
						.contains(CheckValue)
				})
			})
		})
		it.only("Default Value", () => {
			orderFormPage.verifyAcaLevelActiveWithStick(defaultvalue.academicLevel);
		})
	})
	context('[Your paper] select box', () => {
		//Type of document
		it("Check the name of the drop-down list", () => {
			cy.get('label').eq(0)
				.contains('Your paper').should('exist');
		})
		it("Should be required field", () => {
			cy.get(orderFormPage.SEL_DOCUMENT).as('paperSEL')
				.clear({ force: true });
			cy.get(orderFormPage.SEL_DISCIPLINE)
				.type(SubjectTypes[1].title, { force: true });
			orderFormPage.clickNextBTN();
			cy.contains(orderFormPage.ERR_MES)
				.should('be.visible');
			cy.get('@paperSEL')
				.parents('.input-group')
				.should('have.class', 'input-group__invalid');
		})
		it("Order by aphabet", () => {
			cy.get(orderFormPage.SEL_DOCUMENT)
				.type(' ')
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
		it("Value show corret at order Preview", () => {
			cy.get(orderFormPage.SEL_DOCUMENT)
				.type(' ')
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js')
				.contains('span', dataOrder.TYPE_OF_DOCUMENT)
				.click({ force: true })
			cy.get(orderFormPage.ORDER_PREVIEW)
				.should('contain', dataOrder.TYPE_OF_DOCUMENT)

		})
		it("Check default value", () => {
			cy.get(orderFormPage.SEL_DOCUMENT)
				.should('have.text', Order.NEW_DOC)
		})
		it("Check place holder", () => {
			cy.get(orderFormPage.SEL_DOCUMENT)
				.invoke('attr', 'placeholder')
				.should('equal', PlaceholderValue.NEW_DOC);
		})
		it("Check search live activity", () => {
			const keyword = "pap";
			cy.get(orderFormPage.SEL_DOCUMENT)
				.type(keyword, { force: true })
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js')
				.should('be.visible')
		})
		it("Check database equal with data on server", () => {
			cy.get(orderFormPage.SEL_DOCUMENT)
				.click({ force: true })
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
					console.log('array: ' + array)
					const titlesArray = PaperTypes.map((item) => item.title.trimEnd());
					const filteredTitlesArray = titlesArray.filter((title) => title !== `${PlaceholderValue.DocumentTypes}`);
					console.log('filteredTitlesArray: ' + filteredTitlesArray)
					expect(array).to.deep.equal(filteredTitlesArray)
				})
		})
		it("Input Uppercase letters", () => {
			const keyword = "PAPE";
			cy.get(orderFormPage.SEL_DOCUMENT)
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
			cy.get(orderFormPage.SEL_DOCUMENT)
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
			cy.get(orderFormPage.SEL_DOCUMENT)
				.type(NoResult, { force: true })
			cy.contains(Order.NoResult)
				.should('be.visible')
		})
		it("Allow full character", () => {
			cy.get(orderFormPage.SEL_DOCUMENT)
				.type(CommomTextbox.FullCharacter, { force: true })
			cy.get(orderFormPage.SEL_DOCUMENT)
				.should('have.value', CommomTextbox.FullCharacter)
		})
		it("Should show many results", () => {
			const searchText = CommomTextbox.MultiResult
			cy.get(orderFormPage.SEL_DOCUMENT)
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
		it.only("Allow click behavior", () => {
			cy.get(orderFormPage.SEL_DOCUMENT)
				.click({ force: true })
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js')
				.contains('span', PaperTypes[1].title)
				.click({ force: true })
			cy.get(orderFormPage.ORDER_PREVIEW)
				.should('contain', PaperTypes[1].title)
		})
	})
	context('[Your subject] select box', () => {
		//Discipline
		it("Check the name of the drop-down list", () => {
			cy.get('label').eq(1).contains('Your subject').should('exist');
		})
		it("Should be required field", () => {
			//Add data for other required fields: Type of document, Instructions
			cy.get(orderFormPage.SEL_DOCUMENT)
				.type(PaperTypes[1].title)
			cy.get(orderFormPage.SEL_DISCIPLINE)
				.clear({ force: true })
			cy.contains(`${PaperFormat[1]}`)
				.click({ force: true })
			orderFormPage.clickNextBTN();
			cy.contains(orderFormPage.ERR_MES)
				.should('be.visible')
			cy.get(orderFormPage.SEL_DISCIPLINE)
				.parents('.input-group')
				.should('have.class', 'input-group__invalid')
		})
		it("Order by aphabet", () => {
			cy.get(orderFormPage.SEL_DOCUMENT)
				.type(' ')
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
		it("All value show corret at order Preview", () => {
			cy.get(orderFormPage.SEL_DISCIPLINE)
				.type(' ')
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js')
				.contains('span', dataOrder.DISCIPLINE)
				.click({ force: true })
			cy.get(orderFormPage.ORDER_PREVIEW)
				.should('contain', dataOrder.DISCIPLINE)

		})
		it("Default value", () => {
			cy.get(orderFormPage.SEL_DISCIPLINE)
				.should('have.text', Order.NEW_DIS)
		})
		it("Check place holder", () => {
			cy.get(orderFormPage.SEL_DISCIPLINE)
				.invoke('attr', 'placeholder')
				.should('equal', PlaceholderValue.NEW_DIS);
		})
		it("Check search live activity", () => {
			const keyword = "ac";
			cy.get(orderFormPage.SEL_DISCIPLINE)
				.type(keyword, { force: true })
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js')
				.should('be.visible')
		})
		it("Check database equal with data on server", () => {
			cy.get(orderFormPage.SEL_DISCIPLINE)
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
			cy.get(orderFormPage.SEL_DISCIPLINE)
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
			cy.get(orderFormPage.SEL_DISCIPLINE)
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
			cy.get(orderFormPage.SEL_DISCIPLINE)
				.type(NoResult, { force: true })
			cy.contains(Order.NoResult)
				.should('be.visible')
		})
		it("Allow full character", () => {
			cy.get(orderFormPage.SEL_DISCIPLINE)
				.type(CommomTextbox.FullCharacter, { force: true })
			cy.get(orderFormPage.SEL_DISCIPLINE)
				.should('have.value', CommomTextbox.FullCharacter)
		})
		it("Show multi case", () => {
			const searchText = CommomTextbox.MultiResult
			cy.get(orderFormPage.SEL_DISCIPLINE)
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
			cy.get(orderFormPage.SEL_DISCIPLINE)
				.click({ force: true })
				.parents('.input-group')
				.click({ force: true })
				.next()
				.find('.item-js')
				.contains('span', SubjectTypes[1].title)
				.click({ force: true })
			cy.get(orderFormPage.ORDER_PREVIEW)
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
					cy.get(orderFormPage.ORDER_PREVIEW)
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
					cy.get(orderFormPage.ORDER_PREVIEW)
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
		it('Should navigate to step 2', () => {
			//Add data for other required fields: Type of document, Instructions
			signinPage.signInSuccess();
			cy.visit(ROUTERS.ORDER);
			orderFormPage.fillStep1()
			cy.contains(orderFormPage.NewStep2)
				.should('be.visible')
		})
		it('Should show error when required field is empty', () => {
			cy.get(orderFormPage.SEL_DOCUMENT)
				.clear({ force: true })
			cy.get(orderFormPage.SEL_DISCIPLINE)
				.clear({ force: true })
			orderFormPage.clickNextBTN();
			cy.contains(orderFormPage.ERR_MES)
				.should('be.visible')
			cy.contains(StepOrderTitle.NewStep1)
				.should('be.visible')
		})
		it('Check save information at step 1', () => {
			signinPage.signInSuccess();
			cy.visit(ROUTERS.ORDER)
			orderFormPage.fillStep1();
			orderFormPage.clickNextBTN();
			cy.wait(2000);
			cy.get(orderFormPage.BTN_BACK)
				.click({ force: true });
			orderFormPage.verifyStep1Filled();
		})
	})
	it('[Back] button active, not save data and back to previous step', () => {
		orderFormPage.fillStep1();
		orderFormPage.clickBackBTN();
		orderFormPage.clickGoBTN();
		orderFormPage.verifyStep1NotFill();
	})
	it('[Privacy Policy] hyperlink active', () => {
		cy.contains('Privacy Policy')
			.click({ force: true })
		cy.location('pathname')
			.should('eq', ROUTERS.POLICY_PRIVACY)
	})
	it('[Money-back Policy] hyperlink active', () => {
		cy.contains('Money-back Policy')
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
	it('[WritersPerHour.com] hyperlink active', () => {
		cy.contains('WritersPerHour.com')
			.click({ force: true })
		cy.wait(3000)
			.location('pathname')
			.should('eq', '/')
	})
	context('Order Preview', () => {
		it('Default status of collapse', () => {
			cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
				.should('not.have.class', orderFormPage.ORDER_PREVIEW_COL)
		})
		it('Icon [^] active and change to [v] when click on it', () => {
			cy.get(orderFormPage.ARROW_UP_LAP)
				.click({ force: true })
			cy.get(orderFormPage.ARROW_DOWN_LAP)
				.should('be.visible')
				.click({ force: true })
				.get(orderFormPage.ARROW_UP_LAP)
				.should('be.visible')
		})
		it('Check display default fields & value', () => {
			cy.get(orderFormPage.ORDER_PREVIEW)
				.contains(Order.Academic)
				.should('be.visible')
			cy.get(orderFormPage.ORDER_PREVIEW)
				.contains(Order.PaperFormat)
				.should('be.visible')
		})
	})
	context('Additional', () => {
		it('Filled data should be returned to default values when page is reloaded.', () => {
			orderFormPage.fillStep1();
			cy.wait(1000)
			cy.reload()
			orderFormPage.verifyStep1NotFill();
		});
		it('Filled data should be reseted when navigation to Home page and returning', () => {
			orderFormPage.fillStep1();
			cy.get(orderFormPage.BTN_LOGO)
				.click({ force: true });
			cy.get(orderFormPage.BTN_ORDER_NOW)
				.click({ force: true });
			cy.wait(1000);
			orderFormPage.verifyStep1NotFill();
			cy.wait(1000);
		});
		it('Filled data should be saved when moving to the next step and returning by [Back] button', () => {
			orderFormPage.fillStep1();
			orderFormPage.clickNextBTN();
			cy.get(orderFormPage.BTN_BACK)
				.click({ force: true });
			orderFormPage.verifyStep1Filled();
		})
		it('Filled data should be saved when moving to the next step and returning by [Edit] button', () => {
			orderFormPage.fillStep1();
			orderFormPage.clickNextBTN();
			cy.get(orderFormPage.BTN_BACK)
				.click({ force: true });
			orderFormPage.verifyStep1NotFill();
		})
	})
})

