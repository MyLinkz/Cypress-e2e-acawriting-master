
// const Calculator = require('../path/to/Calculator');

// import {getCategoryData} from "../../getData/categories"
// Cypress.config('baseUrl', 'https://');
const { initTestMeta, writeTestResult } = require('../../support/resultWriter');

import { orderType } from './pages/orderFormPage';
import { loadExcelData } from '../../support/excelHelper';

describe('Test', () => {
	it('Test read file excel', () => {
		cy.visit("/");
		readExcel().catch(console.error);
	})
})
describe('Data Driven Test', () => {
	before(() => {
		cy.task('readSheet', {
			filename: 'data/DataOrderForm.xlsx',
			sheetName: 'Sheet1'
		}).then((data) => {
			cy.wrap(data).as('testData');
		});
	});

	it('Test theo từng dòng data', function () {
		this.testData.forEach((dataRow, index) => {
			initTestMeta({
				filename: 'data/DataOrderForm.xlsx',
				sheetName: 'Sheet1',
				rowIndex: index + 1
			});

			cy.visit('/');
			console.log(dataRow.NAME);
			console.log(dataRow.Email);
			console.log(dataRow.URL);

		});
	});
});
describe('Data Driven Test từ Excel', () => {
	before(() => {
		// Đọc dữ liệu từ file Excel
		cy.task('readSheet', {
			filename: 'data/DataOrderForm.xlsx',
			sheetName: 'Sheet1'
		}).then((data) => {
			if (!data || data.length === 0) {
				throw new Error('Không có dữ liệu từ file Excel');
			}
			const header = data.shift();  // Lấy dòng đầu tiên làm header (các tên cột)
			const formattedData = data.map(row => {
				const mappedRow = {};
				header.forEach((colName, index) => {
					mappedRow[colName] = row[index];  // Ghép từng giá trị vào đúng cột
				});
				return mappedRow;
			});
			cy.wrap(formattedData).as('testData'); // Lưu vào alias để dùng trong test
			cy.get('@testData').then((testData) => {
				// Sử dụng cy.wrap().each() để Cypress có thể theo dõi và quản lý các bước test
				cy.wrap(testData).each((dataRow, index) => {
					// Khởi tạo metadata cho báo cáo kết quả
					initTestMeta({
						filename: 'data/DataOrderForm.xlsx',
						sheetName: 'Sheet1',
						rowIndex: index + 1  // +2 vì header là dòng 1, và index bắt đầu từ 0
					});
					this.orderType = testData[index].ACADEMIC_LEVEL;
					// console.log(`data lan ${index} ${testData1}`)

				});
			});
		});
	});

	it('Thực hiện test với từng dòng dữ liệu', function () {
		cy.visit("/")
		console.log(this.orderType)

	});

});

const fileName = "./data/DataOrderForm.xlsx";
const sheetName = "Sheet1";
const dataID = 1;
describe('Data Driven Test từ Excel test2', () => {
	function getOrderType() {
		return Cypress.env('ORDER_TYPE');
	}
	before(() => {
		// Đọc dữ liệu từ file Excel
		loadExcelData(fileName, sheetName).then((data) => {
			cy.wrap(data).as('testData');
			cy.get('@testData').then((testData) => {
				const orderType = testData[1];
				Cypress.env('ORDER_TYPE', orderType.ORDER_TYPE);
			})
		})
	});

	it('Thực hiện test với từng dòng dữ liệu', function () {
		cy.visit("/")
		console.log(`orderType in 22TC11 = ${getOrderType()}`);


	});

});

describe.only('Data Driven Test từ Excel test2', () => {

	function getOrderType() {
		const dataOrderForm = Cypress.env('dataOrderForm');
		return dataOrderForm.ORDER_TYPE; // Trả ra giá trị ORDER_TYPE
	}


	// const fileName = 'data/DataOrderForm.xlsx';
	// const sheetName = 'Sheet1';

	before(() => {
		loadExcelData(fileName, sheetName).then((data) => {
			cy.wrap(data).as('testData');
			cy.get('@testData').then((testData) => {
				const dataObject = testData[dataID];  // dòng 2
				Cypress.env('dataOrderForm', dataObject);
			});
		});
	});

	it('Thực hiện test với từng dòng dữ liệu', function () {
		cy.visit("/");

		// const orderType = Cypress.env('dataOrderForm');
		console.log(`orderType in 22TC11 = ${getOrderType()}`);
	});

});
