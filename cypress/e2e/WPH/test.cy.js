import { ROUTERS } from "../../support/constants/url";
import ExcelHelper from "../../support/excelHelper";
import Calculator from '../../support/calculator';
const ExcelJS = require('exceljs');
import signinPage from "./pages/signinPage";
// import Categories from '../../getData/categories';
// import cypressConfig from "cypress-wait-until/cypress.config";
// const Calculator = require('../path/to/Calculator');

// import {getCategoryData} from "../../getData/categories"
// Cypress.config('baseUrl', 'https://');
describe.only('Excel Helper Test', () => {
	it('Read data from Excel', () => {
		const excelHelper = new ExcelHelper();
		const filePath = 'cypress/fixtures/data/DataOrderForm.xlsx';

		excelHelper.setExcelFile(filePath, 'Sheet1');
		cy.wrap(null).then(() => {
			const data = excelHelper.getCellDataByName('ACADEMIC_LEVEL', 6);
			console.log('Dữ liệu từ Excel:', data);
			cy.log('Dữ liệu từ Excel:', data);
		});
	});
	it('Test', () => {
		cy.request('http://localhost:8080/cypress/fixtures/step0.html')
			.then((response) => {
				// Kiểm tra HTTP status code
				expect(response.status).to.eq(200);
				// Xử lý nội dung
				expect(response.body).to.include('<html>'); // Ví dụ kiểm tra nội dung
			});
	});
	it('Test HTML file', () => {
		cy.visit('/cypress/fixtures/step0.html'); // Đường dẫn tới file HTML đã chuyển đổi
		cy.get('selector').should('be.visible'); // Kiểm tra nội dung trong file
	});
	it('Test', () => {
		cy.request('http://localhost:8080/step0.html')
			.then((response) => {
				// Kiểm tra HTTP status code
				expect(response.status).to.eq(200);
			});
	});


	it('should calculate page price correctly', () => {
		cy.visit(ROUTERS.HOME); // Visit the home page

		const calculator = new Calculator();
		// const categories = new Categories();
		const orderFormData = {
			ID: 1,
			orderType: "editing",
			acalevelTXT: "Undergrad. (yrs 3-4)",
			TYPE_OF_DOCUMENT: "Analysis Paper",
			DISCIPLINE: "Agriculture",
			PAPER_FORMAT: "APA",
			TITLE: "Lorem Ipsum",
			INSTRUCTIONS: "Lorem Ipsum",
			FILE_UPLOAD: "",
			SOURCES: 3,
			urgentTXT: "48 hours",
			pages: 4,
			spacing: "Single",
			slides: 3,
			writerLvlTxt: "ENL (+35%)",
			isAbsPrice: "Yes",
			isPreWriter: "Yes",
			PAYMENT_METHOD: "Stripe",
			disCode: "paper15"
		};

		// Gọi phương thức setValuesFromOrderForm để nhập dữ liệu
		// calculator.setValuesFromOrderForm(orderFormData);
		// Tính toán expectedPagePrice hoặc lấy từ dữ liệu mẫu
		const expectedPagePrice = 123.45;

		// So sánh giá trị trả về từ phương thức getPagePrice


		// await calculator.setValuesFromOrderForm(orderFormData);

		// const test3 = calculator.discountRound;
		// console.log("Den_discountRound price: ", calculator.DiscountRound)


		// IIFE => immediately invoked function expression
		// (async () => {
		// 	try {
		// 		await calculator.setValuesFromOrderForm(orderFormData);

		// 		const test3 = calculator.discountRound;
		// 		console.log("Den_discountRound price: ",test3)

		// 	} catch (error) {
		// 		console.log('Error fetching price:', error); // In lỗi nếu có
		// 	}
		// })();
		//
		// cy.wrap(null)
		// .then(() => {
		// 	return calculator.setValuesFromOrderForm(orderFormData); // Thao tác bất đồng bộ
		// })
		// .then(() => {
		// 	const test3 = calculator.discountRound;
		// 	console.log("Den_discountRound price: " + test3); // Ghi log giá trị
		// })
		// .then(null, (error) => {
		// 	// Xử lý lỗi trong `then`
		// 	console.log('Error fetching price: ' + error);
		// });


		cy.wrap(null).then(async () => {
			try {
				await calculator.setValuesFromOrderForm(orderFormData); // Gọi hàm bất đồng bộ
				const test3 = calculator.discountRound;
				console.log("Den_discountRound price: " + test3); // Ghi log
				console.log("Grand total: ", calculator.grandTotal)
			} catch (error) {
				console.log('Error fetching price: ' + error); // Xử lý lỗi
			}
		});


	});
	it('should ', () => {
		// can be chained but will not receive the previous subject
		cy.get('button').loginViaApi('user')
	});
});
describe("Test 2", () => {
	let isSetupSuccessful = true;

	beforeEach(function () {
		signinPage.signInSuccess();
		cy.visit(ROUTERS.NEW_ORDER);
		cy.get(".title", "test")
		cy.on('fail', (err) => {
			isSetupSuccessful = false;
			cy.log('Setup failed:', err.message);
			return false; // Ngăn Cypress dừng test
		});
	});

	it('Test case 1', function () {
		if (!isSetupSuccessful) this.skip();
		// Logic test case 1
	});

	it('Test case 2', function () {
		if (!isSetupSuccessful) this.skip();
		// Logic test case 2
	});

})
