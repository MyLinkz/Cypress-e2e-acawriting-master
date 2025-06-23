import {ROUTERS} from "../../../../support/constants/url"
import signinPage from "../../pages/signinPage";
import {loadExcelData, readSheet} from '../../../../support/excelHelper';
import orderFormPage from "../../pages/orderFormPage";
// const { ExcelHelper } = require('../../../../support/newExcelHelper');
Cypress.config('baseUrl', 'https://kamora:iamafriend@ibhelper.dev/');


const fileName = "./data/DataOrderForm.xlsx";
const sheetName = "Sheet2";
const dataID = 3

describe("IBH-test", () => {
	function getOrderType() {
		const dataOrderForm = Cypress.env('dataOrderForm');
		return dataOrderForm.ORDER_TYPE; // Trả ra giá trị ORDER_TYPE
	}

	function getDataOrder() {
		return Cypress.env('dataOrderForm'); // Trả ra giá trị ORDER_TYPE
	}

	before(() => {
		loadExcelData(fileName, sheetName).then((data) => {
			cy.wrap(data).as('testData');
			cy.get('@testData').then((testData) => {
				const dataObject = testData[dataID - 1];  // dòng 2
				Cypress.env('dataOrderForm', dataObject);
			});
		});
	});

	beforeEach(function () {
		signinPage.signInSuccess();
		//    cy.reload();
	})
	it("Create order form WPH", () => {
		cy.visit(ROUTERS.ORDER);
		cy.get('.btn-cookie > .sc-6fe1cc8-0 > .button-show')
			.click({force: true});
		orderFormPage.fillStep1(getDataOrder());
		orderFormPage.clickNextBTN();
		orderFormPage.fillStep2(getDataOrder());
		orderFormPage.clickNextBTN();
		orderFormPage.fillStep3(getDataOrder());
		orderFormPage.clickNextBTN();
		orderFormPage.fillStep4(getDataOrder());
		orderFormPage.clickNextBTN();
		orderFormPage.fillStep5(getDataOrder());

	})
})

describe("IBH-test2", () => {
	function getOrderType() {
		const dataOrderForm = Cypress.env('dataOrderForm');
		return dataOrderForm.ORDER_TYPE; // Trả ra giá trị ORDER_TYPE
	}

	function getDataOrder() {
		console.log("Test " + Cypress.env('dataOrderFormSheet'))
		return Cypress.env('dataOrderFormSheet'); // Trả ra giá trị ORDER_TYPE
	}

	before(() => {
		cy.task("readSheet", {filename: fileName, sheetName: "Sheet2"})
			.then((data) => {
				  // dòng 2
				Cypress.env('dataOrderForm', data);
				console.log("Data from Excel:", data);
			});
	});

	beforeEach(function () {
		signinPage.signInSuccess();
		//    cy.reload();
	})
	// it('test order form', () => {
	// 	cy.visit(ROUTERS.ORDER);
	// 	console.log(data)
	// })

})
describe("IBH-test3", () => {
	function getOrderType() {
		const dataOrderForm = Cypress.env('dataOrderForm');
		return dataOrderForm.ORDER_TYPE; // Trả ra giá trị ORDER_TYPE
	}

	function getDataOrder() {
		// console.log("Test " + Cypress.env('dataOrderFormSheet'))
		return Cypress.env('dataOrderFormSheet'); // Trả ra dữ liệu
	}

	before(() => {
		cy.task("readSheet", {filename: fileName, sheetName: "Sheet2"}).then((data) => {

			const headers = data[0]; // Lấy hàng đầu tiên làm tiêu đề cột
			const testDataList = data.slice(1).map(row => {
				return Object.fromEntries(headers.map((key, index) => [key, row[index]]));
			});

			// Lưu vào biến môi trường Cypress
			Cypress.env('dataOrderFormSheet', testDataList);
			// Cypress.env('dataOrderFormSheet', data); // Lưu dữ liệu vào môi trường Cypress
			// console.log("Data from Excel:", data);
		});
	});
	//
	// beforeEach(function () {
	// 	signinPage.signInSuccess();
	// });

	context('test order form', () => {
		it('Test từng order', function () {
			let dataOrderForm = Cypress.env('dataOrderForm');

			dataOrderForm.forEach(order => {
				cy.visit(ROUTERS.ORDER);
				console.log(`Đang test ORDER_TYPE: ${order.ORDER_TYPE}`);
			});
		});
	});

	it.only('should process all orders', () => {

		Cypress.env('dataOrderFormSheet').forEach((testData) => {
			if (testData.RESULT === 'Passed') {
			} else {
				signinPage.signInSuccess();
				cy.get('.btn-cookie > .sc-6fe1cc8-0 > .button-show')
					.click({force: true});
				cy.visit(ROUTERS.ORDER);

				cy.log(`Processing order ID: ${testData.ID}`);
				cy.log(`Processing order TYPE_OF_DOCUMENT: ${testData.TYPE_OF_DOCUMENT}`);
				cy.visit(ROUTERS.ORDER);
				console.log(testData);
				orderFormPage.fillStep1(testData);
				orderFormPage.clickNextBTN();
				orderFormPage.fillStep2(testData);
				orderFormPage.clickNextBTN();
				orderFormPage.fillStep3(testData);
				orderFormPage.clickNextBTN();
				orderFormPage.fillStep4(testData);
				orderFormPage.clickNextBTN();
				orderFormPage.fillStep5(testData);
                cy.screenshot(`DataValue${testData.ID}`);
                // cy.get('.sc-d1971123-0 > .sc-6fe1cc8-0 > .button-show')
				// 	.click({force: true});
                //     cy.wait(4000);
				// cy.clearAllCookies();
				// cy.clearAllSessionStorage();
				// cy.clearAllLocalStorage()
				
				

			}
		});
	});
});


// const ExcelHelper = require('./newExcelHelper');

// const {ExcelHelper} = require('../../../../support/newExcelHelper'); // Không có {}


// describe('Excel Data Test', () => {
// 	const excel = new ExcelHelper(fileName, 'Sheet2');

// 	it('should read a specific cell', async () => {
// 		const cellValue = await excel.readCell(2, 3);
// 		expect(cellValue).to.equal('ExpectedValue');
// 	});

// 	// it('should write a value to a specific cell', async () => {
// 	// 	await excel.writeCell(2, 3, 'NewValue');
// 	// 	const cellValue = await excel.readCell(2, 3);
// 	// 	expect(cellValue).to.equal('NewValue');
// 	// });
// 	//
// 	// it('should read an entire row', async () => {
// 	// 	const rowValues = await excel.readRow(2);
// 	// 	expect(rowValues).to.include.members(['Value1', 'Value2']);
// 	// });
// 	//
// 	// it('should write an entire row', async () => {
// 	// 	await excel.writeRow(3, ['A', 'B', 'C']);
// 	// 	const rowValues = await excel.readRow(3);
// 	// 	expect(rowValues).to.deep.equal(['A', 'B', 'C']);
// 	// });
// 	//
// 	// it('should read an entire column', async () => {
// 	// 	const colValues = await excel.readColumn(2);
// 	// 	expect(colValues).to.include('SomeValue');
// 	// });
// });
