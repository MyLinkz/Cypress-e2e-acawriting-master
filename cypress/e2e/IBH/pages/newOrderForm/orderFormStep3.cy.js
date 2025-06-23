import {defaultvalue, ErrorMessages, Order, UploadFile} from "../../../../support/constants/defaultvalue"

import {
	InValidFile,
	InValidFile25MB,
	specialFile,
	UnderValidFile,
	UnderValidFile25MB,
	UploadFileFormat,
	ValidFile,
	ValidFile25MB
} from '../../../../support/constants/validate';

import {IBH_ROUTERS} from "../../../../support/constants/url";
import orderFormPage, {PlaceholderValue} from "../../pages/orderFormPage";
import signInPage from "../../pages/signinPage";

// Cypress.config('baseUrl', 'http://192.168.1.55:3021/');
import {loadExcelData} from '../../../../support/excelHelper';
import {StepOrderTitle} from "../orderFormPage";

const fileName = "./data/DataOrderForm.xlsx";
const sheetName = "DataOF_IBH";
const dataID = 1;
const dataID2 = 2;
Cypress.config('baseUrl', 'https://kamora:iamafriend@ibhelper.dev/');
describe("Order Step 3", () => {
	// const dataOrder = dataOrder1;

	function getFileName() {
		const dataOrderForm = Cypress.env('dataOrderForm');
		return dataOrderForm.FILE_UPLOAD; // Trả ra giá trị ORDER_TYPE
	}

	function getOrderType() {
		const dataOrderForm = Cypress.env('dataOrderForm');
		return dataOrderForm.ORDER_TYPE; // Trả ra giá trị ORDER_TYPE
	}

	function getDataOrder() {
		return Cypress.env('dataOrderForm'); // Trả ra giá trị ORDER_TYPE
	}

	function getDataOrderID2() {
		return Cypress.env('dataOrderFormID2'); // Trả ra giá trị ORDER_TYPE
	}

	before(() => {
		loadExcelData(fileName, sheetName).then((data) => {
			cy.wrap(data).as('testData'); // Lưu toàn bộ dữ liệu vào alias
			cy.get('@testData').then((testData) => {
				const dataObject = testData[dataID - 1]; // Lấy object theo dataID
				Cypress.env('dataOrderForm', dataObject); // Lưu vào biến môi trường
			});
		});
	});
	before(() => {
		loadExcelData(fileName, sheetName).then((data) => {
			cy.wrap(data).as('testData'); // Lưu toàn bộ dữ liệu vào alias
			cy.get('@testData').then((testData) => {
				const dataObject = testData[dataID2 - 1]; // Lấy object theo dataID
				Cypress.env('dataOrderFormID2', dataObject); // Lưu vào biến môi trường
			});
		});
	});
	beforeEach(function () {
		signInPage.signInSuccess();
		cy.visit(IBH_ROUTERS.ORDER);
		cy.wait(2000);
		orderFormPage.fillStep0(getDataOrder());
		orderFormPage.clickGoBTN();
		orderFormPage.fillStep1(getDataOrder());
		orderFormPage.clickNextBTN();
		orderFormPage.fillStep2(getDataOrder());
		orderFormPage.clickNextBTN();
	})

	context('Navigation', () => {
		it('Should navigate to the [Order Form] page by URL', () => {
			orderFormPage.verifyStepName(orderFormPage.NewStep3)
		})
	})
	it('Should navigate to the [Homepage] page when user clicks on logo', () => {
		cy.get(orderFormPage.BTN_LOGO)
			.click({force: true});
		cy.location("pathname")
			.should("eq", IBH_ROUTERS.HOME)
	})
	it('Should show the [Cancel Confirm] slide up when click on it', () => {
		cy.get(orderFormPage.BTN_CANCEL)
			.click({force: true})
		cy.get(orderFormPage.SLD_CONT)
			.should('be.visible')
	})
	context('[Cancel confirm] slide up', () => {
		context('Close silde up', () => {
			it('Should close the [Cancel confirm] slide up when clicking on [x] icon', () => {
				cy.get(orderFormPage.BTN_CANCEL)
					.click({force: true});
				orderFormPage.clickXBTNForm();
				orderFormPage.verifyStepName(orderFormPage.NewStep3)
			})
			it('Should close the [Cancel confirm] slide up when clicking out of the popup', () => {
				cy.get(orderFormPage.BTN_CANCEL)
					.click({force: true});
				// orderFormPage.clickXBTNForm();
				cy.get(orderFormPage.BACK_DROP).eq(0)
					.click({force: true})
				orderFormPage.verifyStepName(orderFormPage.NewStep3)
			})
		})
		it("Shouldn't reset data when user on the [Continue With Your Order] button", () => {
			orderFormPage.fillStep3(getDataOrder());
			cy.get(orderFormPage.BTN_CANCEL)
				.click({force: true})
			cy.get(orderFormPage.BTN_CONT)
				.click({force: true})
			orderFormPage.verifyStepName(orderFormPage.NewStep3);
			orderFormPage.verifyShowDownloadIcon();
		})
		it('Should reset data when user click on [Cancel Order] button', () => {
			//close silde and reset value
			cy.get(orderFormPage.BTN_CANCEL)
				.click({force: true});
			cy.get(orderFormPage.BTN_CANCEL_CONF)
				.click({force: true});
			orderFormPage.verifyOrderTypeActive(defaultvalue.SERVICE_TYPE);
		})
	})
	context('Upload file', () => {
		it('Check place holder', () => {
			cy.get('.file-upload').invoke('text').should('include', PlaceholderValue.UPLOAD_FILE);
		})
		it('Should display local files and upload successfully', () => {
			cy.get(orderFormPage.BTN_UPLOAD)
				.selectFile('cypress/fixtures/files/6MB.bin', {force: true})
			orderFormPage.verifyShowDownloadIcon();
		});
		it('Should allow dragging and dropping files', () => {
			cy.get(orderFormPage.BTN_UPLOAD).selectFile('cypress/fixtures/files/6MB.bin', {force: true});

		});
		it('Error upload', () => {
			cy.get(orderFormPage.BTN_UPLOAD)
				.selectFile('cypress/fixtures/files/26MB.bin', {force: true})
			orderFormPage.verifyFileError();
		})
		context('Check download file', () => {
			it('Not show icon download when loading file', () => {
				cy.get(orderFormPage.BTN_UPLOAD)
					.selectFile('cypress/fixtures/files/6MB.bin', {force: true})
				orderFormPage.verifyNotShowDownloadIcon();
			})
			it('Not show icon download when upload error file', () => {
				cy.get(orderFormPage.BTN_UPLOAD)
					.selectFile('cypress/fixtures/files/26MB.bin', {force: true})
				orderFormPage.verifyNotShowDownloadIcon();
				orderFormPage.verifyFileError();
			})
			xit('Complete download and open successfully', () => {
				cy.get(orderFormPage.BTN_UPLOAD)
					.selectFile('cypress/fixtures/files/test.txt', {force: true})
				orderFormPage.verifyShowDownloadIcon();
				cy.wait(2000)
				cy.get('.download > .sc-f2c94c47-0')
					.click()
				cy.task('verifyDownload', 'cypress/downloads/test.txt').then((exists) => {
					expect(exists).to.be.true; // Đảm bảo file đã được tải xuống

					// Chỉ kiểm tra nội dung nếu file tồn tại
					cy.readFile('cypress/downloads/test.txt').should('contain', 'test');
				});
			})
		})
		context('Check delete file', () => {
			it('Not show icon delete when loading file', () => {
				cy.get(orderFormPage.BTN_UPLOAD)
					.selectFile('cypress/fixtures/files/20MB.bin', {force: true})
				orderFormPage.verifyNotShowDelIcon();
			})
			it('Not show icon download when upload error file', () => {
				cy.get(orderFormPage.BTN_UPLOAD)
					.selectFile('cypress/fixtures/files/20MB.bin', {force: true})
				orderFormPage.verifyNotShowDelIcon();
				orderFormPage.verifyFileError();
			})
			it('Complete download and delete successfully', () => {
				cy.get(orderFormPage.BTN_UPLOAD)
					.selectFile('cypress/fixtures/files/test.txt', {force: true});
				cy.wait(3000);
				cy.get(orderFormPage.DEL_FILE)
					.click();
				cy.contains('test.txt')
					.should('not.exist');
			})
		})
		it('Uploading multiple files at the same time', () => {
			cy.get(orderFormPage.BTN_UPLOAD)
				// .selectFile([UnderValidFile.location,InValidFile.location,ValidFile.location], { force: true })
				.selectFile(UploadFileFormat.map(file => file.location), {force: true})
		})
		it("Should success File <6Mb", () => {
			cy.get(orderFormPage.BTN_UPLOAD)
				.selectFile(UnderValidFile.location, {force: true})
			orderFormPage.verifyShowDownloadIcon();
		})
		it("Should success File =6Mb", () => {
			cy.get(orderFormPage.BTN_UPLOAD)
				.selectFile(ValidFile.location, {force: true})
			orderFormPage.verifyShowDownloadIcon();
		})
		it("Should error file >6Mb", () => {
			cy.get(orderFormPage.BTN_UPLOAD)
				.selectFile(InValidFile.location, {force: true})
			orderFormPage.verifyFileError();
		})
		xit("Should succes file <25Mb", () => {
			cy.get(orderFormPage.BTN_UPLOAD)
				.selectFile(UnderValidFile25MB.location, {force: true});
			cy.get(orderFormPage.BTN_DOWNLOAD, {timeout: 60000})
				.should('be.visible');
		})
		xit("Should success file =25Mb", () => {
			cy.get(orderFormPage.BTN_UPLOAD)
				.selectFile(ValidFile25MB.location, {force: true});
			cy.get(orderFormPage.BTN_DOWNLOAD, {timeout: 60000})
				.should('be.visible');
		})
		xit("Should error file >25Mb", () => {
			cy.get(orderFormPage.BTN_UPLOAD)
				.selectFile(InValidFile25MB.location, {force: true});
			orderFormPage.verifyFileError();
		})
		it('Multi file format', () => {
			let i = 0;
			UploadFileFormat.forEach((item) => {

				cy.get(orderFormPage.BTN_UPLOAD)
					.selectFile(item.location, {force: true})
				// console.log("item: ",indexOf(item))
				cy.get(orderFormPage.BTN_DOWNLOAD).eq(i)
					.should('exist')
					.and('be.visible')
					.and(($el) => {
						expect($el.children().length).to.be.greaterThan(0);  // phải có nội dung con bên trong
					});
				i++;
			})
		})
		it('Should not allow proceeding to next step if the upload file field is empty', () => {
			if (getDataOrder().ORDER_TYPE === 'writing') {
				cy.get(orderFormPage.BTN_NEXT)
					.contains('Skip')

				// .contains('Skip')
				// .should('be.visible')
				cy.get(orderFormPage.BTN_NEXT)
					.should('not.contain', 'Next')
				return;
			}
			orderFormPage.clickNextBTN();
			cy.get(orderFormPage.ERR_MES)
				.should("contain", ErrorMessages.OrderFieldRequired);
		});
		it('Still keep file after next or back step', () => {
			orderFormPage.uploadFileSuccess();
			orderFormPage.verifyShowDownloadIcon();
			orderFormPage.clickBackBTN();
			orderFormPage.clickNextBTN();
			cy.contains(ValidFile.name)
				.should('exist')
			orderFormPage.verifyShowDownloadIcon();
		})
		it('Should not allow proceeding to the next step if the file is still being uploaded', () => {
			cy.get(orderFormPage.BTN_UPLOAD)
				.selectFile(UploadFile.OverValid, {force: true})
			cy.get(orderFormPage.BTN_NEXT)
				.should('be.disabled')
		})
		it('Should allow proceeding to next step after uploading a file', () => {
			orderFormPage.uploadFileSuccess();
			orderFormPage.verifyShowDownloadIcon();
			orderFormPage.clickNextBTN();
			orderFormPage.verifyStepName(StepOrderTitle.NewStep4);
		})
		it('[Back] button active, back to previous step', () => {
			orderFormPage.clickBackBTN();
			orderFormPage.verifyStep2Filled(getDataOrder());
		})
		it('[Skip] Should allow leaving the upload file field empty and proceeding to step 4', () => {
			orderFormPage.clickSkipBTN();
			orderFormPage.verifyStepName(StepOrderTitle.NewStep4);
		})
		it('Should display correct file name', () => {
			cy.wrap(specialFile).each((file) => {
				cy.log("file.name ", file.name)
				orderFormPage.uploadFileSuccess(file.name);
				cy.contains(file.name).should('exist'); // Kiểm tra file đã upload
				orderFormPage.verifyShowDownloadIcon();
			});
		})
		context('Order Preview', () => {
			it('Default status of collapse', () => {
				cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
					.should('not.have.class', orderFormPage.ORDER_PREVIEW_COL)
			})
			it('Icon [^] active and change to [v] when click on it', () => {
				cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
					.find('.header')
					.click({force: true})
				orderFormPage.verifyCOLNotOpen(orderFormPage.ORDER_PREVIEW_DETAILS)
			})
			it('Check display default fields & value', () => {
				orderFormPage.uploadFileSuccess();
				cy.get(orderFormPage.ORDER_PREVIEW)
					.contains(getDataOrder().TYPE_OF_DOCUMENT)
					.should('be.visible');
				cy.get(orderFormPage.ORDER_PREVIEW)
					.contains(getDataOrder().DISCIPLINE)
					.should('be.visible')
				cy.get(orderFormPage.ORDER_PREVIEW)
					.contains(getDataOrder().ACADEMIC_LEVEL)
					.should('be.visible');
				if (getDataOrder().TITLE != '') {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.contains(getDataOrder().TITLE)
						.should('be.visible');
				} else {
					cy.get(orderFormPage.ORDER_PREVIEW)
						.should('not.contain', 'Title');
				}
				cy.get(orderFormPage.ORDER_PREVIEW)
					.contains(getDataOrder().INSTRUCTIONS)
					.should('be.visible')
				cy.get(orderFormPage.ORDER_PREVIEW)
					.contains(ValidFile.name)
					.should('be.visible')
			})
			it('Each item should be clickable to navigate to its corresponding screen', () => {
				orderFormPage.uploadFileSuccess();
				//step1
				cy.get(orderFormPage.ORDER_PREVIEW).contains(getDataOrder().TYPE_OF_DOCUMENT)
					.click({force: true});
				orderFormPage.verifyStepName(StepOrderTitle.NewStep1);
				cy.get(orderFormPage.ORDER_PREVIEW).contains('Attachments')
					.click({force: true});


				cy.get(orderFormPage.ORDER_PREVIEW).contains(getDataOrder().DISCIPLINE)
					.click({force: true});
				orderFormPage.verifyStepName(StepOrderTitle.NewStep1);
				cy.get(orderFormPage.ORDER_PREVIEW).contains('Attachments')
					.click({force: true});


				cy.get(orderFormPage.ORDER_PREVIEW).contains(getDataOrder().ACADEMIC_LEVEL)
					.click({force: true});
				orderFormPage.verifyStepName(StepOrderTitle.NewStep1);
				cy.get(orderFormPage.ORDER_PREVIEW).contains('Attachments')
					.click({force: true});

				//step2
				if (getDataOrder().TITLE != '') {
					cy.get(orderFormPage.ORDER_PREVIEW).contains(getDataOrder().TITLE)
						.click({force: true});
					orderFormPage.verifyStepName(StepOrderTitle.NewStep2);
					cy.get(orderFormPage.ORDER_PREVIEW).contains('Attachments')
						.click({force: true});
				}
				cy.get(orderFormPage.ORDER_PREVIEW).contains(getDataOrder().INSTRUCTIONS)
					.click({force: true});
				orderFormPage.verifyStepName(StepOrderTitle.NewStep2);
				cy.get(orderFormPage.ORDER_PREVIEW).contains('Attachments')
					.click({force: true});
			})
		})
	})
	it('[Back] button active, not save data and back to previous step', () => {
		orderFormPage.fillStep3(getDataOrder());
		orderFormPage.clickBackBTN();
		orderFormPage.clickNextBTN()
		orderFormPage.verifyStep2Filled(getDataOrder());
	})
	it('[Next] button, should navigate to step 4', () => {
		orderFormPage.updateOrderType(getOrderType(), "Rewriting", 3)
		orderFormPage.uploadFileSuccess(getFileName());
		orderFormPage.clickNextBTN();
		orderFormPage.verifyStepName(StepOrderTitle.NewStep4);
	})
	it('[Skip] button, should navigate to step 4', () => {
		orderFormPage.updateOrderType(getOrderType(), "Writing", 3)
		orderFormPage.clickSkipBTN();
		orderFormPage.verifyStepName(StepOrderTitle.NewStep4);
	})
	context('Order Preview', () => {
		it('Default status of collapse', () => {
			orderFormPage.verifyCOLOpen(orderFormPage.ORDER_PREVIEW_DETAILS);
		})
		it('Icon [^] active and change to [v] when click on it', () => {
			cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
				.find('.header')
				.click({force: true});
			orderFormPage.verifyCOLNotOpen(orderFormPage.ORDER_PREVIEW_DETAILS);
		})
		xit('Check display default fields & value', () => {
			cy.get(orderFormPage.ORDER_PREVIEW)
				.contains(Order.Academic)
				.should('be.visible');
			cy.get(orderFormPage.ORDER_PREVIEW)
				.contains(Order.PaperFormat)
				.should('be.visible');
		})
		it('Each item should be clickable to navigate to its corresponding screen', () => {
			orderFormPage.clickPaperEditBTN();
			orderFormPage.verifyStepName(StepOrderTitle.NewStep1);
		})
	})
	context('[Edit] button', () => {
		it('Check the update of "Order Preview" when updating the data in Order type', () => {
			orderFormPage.updateOrderType(getOrderType(), orderFormPage.getOtherOrderType(getOrderType()), 2);
			orderFormPage.verifyOrderType(orderFormPage.getOtherOrderType(getOrderType()));
		})
		it('Check the update of "Order Preview" when updating the data in step 1', () => {
			orderFormPage.clickPaperEditBTN();
			orderFormPage.verifyStepName(StepOrderTitle.NewStep1);
			orderFormPage.updateStep1(getDataOrderID2());
			orderFormPage.clickTitleEditBTN();
			cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
				.should('contain', getDataOrderID2().TYPE_OF_DOCUMENT)
				.should('contain', getDataOrderID2().DISCIPLINE);
		})
		it('Check the update of "Order Preview" when updating the data in step 2', () => {
			orderFormPage.clickInstructionEditBTN();
			orderFormPage.verifyStepName(StepOrderTitle.NewStep2);
			orderFormPage.updateStep2(getDataOrderID2());
			orderFormPage.clickPaperEditBTN();
			cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
				.should('contain', getDataOrderID2().TITLE)
				.should('contain', getDataOrderID2().INSTRUCTIONS);
		})
		it('Check the update of "Order Preview" when updating the data in step 3', () => {
			orderFormPage.uploadFileSuccess();
			orderFormPage.clickInstructionEditBTN();
			orderFormPage.verifyStepName(StepOrderTitle.NewStep2);
			orderFormPage.updateStep2(getDataOrderID2());
			orderFormPage.clickPaperEditBTN();
			cy.get(orderFormPage.ORDER_PREVIEW_DETAILS)
				.should('contain', ValidFile.name)
		})
	})
	context.only('Additional', () => {
		let fileName = ValidFile.name;
		let skipAfterEach = false;
		beforeEach(() => {
			orderFormPage.uploadFileSuccess(fileName);
		})
		afterEach(() => {
			if (skipAfterEach) {
				cy.log("Skipping afterEach for this test");
				return;
			}
			cy.wait(500)
			orderFormPage.verifyStep3Filled(fileName);
		})
		context('Never pressed the [Next] button before', () => {
			it('File uploaded should be saved when reloading page', () => {
				cy.wait(1000)
				cy.reload()
			});
			it('File uploaded should be saved when moving to previous step and returning', () => {
				orderFormPage.clickBackBTN();
				orderFormPage.clickNextBTN();
			})
			it('File uploaded should be saved when navigation to [Home page] and go to [Order form] by [Order Now] or [Continue To Order] button', () => {
				cy.get(orderFormPage.BTN_LOGO)
					.click({force: true});
				cy.get(orderFormPage.BTN_ORDER_NOW).contains('Order Now')
					.click({force: true});
			})
			it('File uploaded should be saved when navigation to [Home page] and go to [Order form] by [Back] button of browser', () => {
				cy.get(orderFormPage.BTN_LOGO)
					.click({force: true});
				cy.wait(5000);
				cy.go('back');
			})
			it('File uploaded should be saved when opening new tab and inputting URL', () => {
				cy.url().then((currentUrl) => {
					const username = Cypress.env("USERNAME");
					const password = Cypress.env("PASSWORD");

					// Chuyển URL hiện tại sang định dạng có Basic Auth
					const authUrl = currentUrl.replace("https://", `https://${username}:${password}@`);

					// Truy cập lại trang với Basic Auth
					cy.visit(authUrl);
				});
			})
		})
		context('Step 4 must be active', () => {
			beforeEach(() => {
				orderFormPage.clickNextBTN();
				orderFormPage.clickBackBTN()
			})
			it('File uploaded should be saved when moving to the next step and returning by [Back] button', () => {
				orderFormPage.clickNextBTN();
				orderFormPage.clickBackBTN()
				console.log("Successfully uploaded");
			})
			it('File uploaded should be saved when moving to the next step and returning by [Edit] button', () => {
				orderFormPage.clickNextBTN();
				orderFormPage.clickDetailCOLOpen();
				cy.wait(500)
				orderFormPage.clickFileEditBTN();
			})
			it.only('File uploaded should be saved when page is reloaded.', () => {
				cy.reload()
				cy.wait(500);
			})
			it('File uploaded should be saved when navigation to [Home page] and go to [Order form] by [Order Now] or [Continue To Order] button ', () => {
				cy.get(orderFormPage.BTN_LOGO)
					.click({force: true});
				cy.get(orderFormPage.BTN_ORDER_NOW).contains('Order Now')
					.click({force: true});
			})
			it('File uploaded should be saved when navigation to [Home page] and go to [Order form] by [Back] button of browser', () => {
				cy.get(orderFormPage.BTN_LOGO)
					.click({force: true});
				cy.wait(5000);
				cy.go('back');
			})
			it('File uploaded should be saved when opening new tab and inputting URL', () => {
				cy.url().then((currentUrl) => {
					const username = Cypress.env("USERNAME");
					const password = Cypress.env("PASSWORD");

					// Chuyển URL hiện tại sang định dạng có Basic Auth
					const authUrl = currentUrl.replace("https://", `https://${username}:${password}@`);

					// Truy cập lại trang với Basic Auth
					cy.visit(authUrl);
				});
			})
		})
	})
})

