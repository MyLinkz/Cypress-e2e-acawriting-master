import {
    defaultvalue,
    ErrorMessages,
    UploadFile
} from "../../../support/constants/defaultvalue"

import { InValidFile, UnderValidFile, ValidFile, UploadFileFormat, UnderValidFile25MB, ValidFile25MB, InValidFile25MB, specialFile } from '../../../support/constants/validate';

import { ROUTERS } from "../../../support/constants/url";
import orderFormPage from "../pages/orderFormPage";
import signinPage from "../pages/signinPage";

// Cypress.config('baseUrl', 'http://192.168.1.55:3021/');

import { loadExcelData } from '../../../support/excelHelper';
import { StepOrderTitle } from "../../IBH/pages/orderFormPage";
import { get } from "lodash";

const fileName = "./data/DataOrderForm.xlsx";
const sheetName = "Sheet2";
const dataID = 1;

describe("Order Step 3", () => {

    function getOrderType() {
        const dataOrderForm = Cypress.env('dataOrderForm');
        return dataOrderForm.ORDER_TYPE; // Trả ra giá trị ORDER_TYPE
    }
    function getDataOrder() {
        const dataOrderForm = Cypress.env('dataOrderForm');
        return dataOrderForm; // Trả ra giá trị ORDER_TYPE
    }
    before(() => {
        loadExcelData(fileName, sheetName).then((data) => {
            cy.wrap(data).as('testData');
            cy.get('@testData').then((testData) => {
                const dataObject = testData[dataID];  // dòng 2
                Cypress.env('dataOrderForm', dataObject);
            });
        });
    });

    beforeEach(function () {
        signinPage.signInByToken("client-846-fake@kamora.vn", "iamafriend");
        cy.visit(ROUTERS.ORDER);
        cy.wait(2000);
		console.log('test :', getDataOrder())
        orderFormPage.fillStep0(getDataOrder());
        orderFormPage.clickGoBTN();
        orderFormPage.fillStep1(getDataOrder());
        orderFormPage.clickNextBTN();
        orderFormPage.fillStep2(getDataOrder());
        orderFormPage.clickNextBTN();
    })

    context('Navigation', () => {
        it('Should navigate to the [Order Form] page by URL', () => {
            orderFormPage.verifyNavigate(ROUTERS.ORDER, orderFormPage.NewStep3)
        })
    })
    it('Should navigate to the [Homepage] page when user clicks on logo', () => {
        cy.get(orderFormPage.BTN_LOGO)
            .click({ force: true });
        cy.location("pathname")
            .should("eq", ROUTERS.HOME)
    })
    context('[Cancel] button', () => {
        it('Should show the [Cancel Confirm] slide up when click on it', () => {
            cy.get(orderFormPage.BTN_CANCEL)
                .click({ force: true })
            cy.get(orderFormPage.SLD_CONT)
                .should('be.visible')
        })
        context('Close silde up', () => {
            it('Should close the [Cancel confirm] slide up when clicking on [x] icon', () => {
                cy.get(orderFormPage.BTN_CANCEL)
                    .click({ force: true });
                orderFormPage.clickXBTNForm();
                orderFormPage.verifyStepName(orderFormPage.NewStep3)
            })
            it('Should close the [Cancel confirm] slide up when clicking out of the popup', () => {
                cy.get(orderFormPage.BTN_CANCEL)
                    .click({ force: true });
                orderFormPage.clickXBTNForm();
                cy.get(orderFormPage.BACK_DROP).eq(0)
                    .click({ force: true })
                orderFormPage.verifyStepName(orderFormPage.NewStep3)
            })
        })
        it("Shouldn't reset data when user on the [Continue With Your Order] button", () => {
            cy.get(orderFormPage.BTN_CANCEL)
                .click({ force: true })
            cy.get(orderFormPage.BTN_CONT)
                .click({ force: true })
            orderFormPage.verifyStepName(orderFormPage.NewStep3);
        })
        it('Should reset data when user click on [Cancel Order] button', () => {
            //close silde and reset value
            cy.get(orderFormPage.BTN_CANCEL)
                .click({ force: true });
            cy.get(orderFormPage.BTN_CANCEL_CONF)
                .click({ force: true });
            orderFormPage.verifyOrderTypeActive(defaultvalue.SERVICE_TYPE);
        })
    })
    context('Check footer', () => {
        it('[Privacy Policy] hyperlink active', () => {
            cy.contains('Privacy Policy')
                .click({ force: true })
            cy.location('pathname')
                .should('eq', ROUTERS.POLICY_PRIVACY)
        })
        it('[Refund Policy] hyperlink active', () => {
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
    })
    context('Upload file', () => {
        it('Check place holder', () => {
            cy.get('.file-upload').invoke('text').should('include', 'Upload your files')
            cy.get('.file-upload').invoke('text').should('include', 'Drag and drop your files here or choose files')
        })
        it('should display local files and upload successfully', () => {
            cy.get(orderFormPage.BTN_UPLOAD)
                .selectFile('cypress/fixtures/files/6MB.bin', { force: true })
            orderFormPage.verifyShowDownloadIcon();
        });
        it('Should allow dragging and dropping files', () => {
            cy.get(orderFormPage.BTN_UPLOAD).selectFile('cypress/fixtures/files/6MB.bin', { force: true });

        });
        it('Error upload', () => {
            cy.get(orderFormPage.BTN_UPLOAD)
                .selectFile('cypress/fixtures/files/26MB.bin', { force: true })
            orderFormPage.verifyFileError();
        })
        context('Check download file', () => {
            it('Not show icon download when loading file', () => {
                cy.get(orderFormPage.BTN_UPLOAD)
                    .selectFile('cypress/fixtures/files/6MB.bin', { force: true })
                orderFormPage.verifyNotShowDownloadIcon();
            })
            it('Not show icon download when upload error file', () => {
                cy.get(orderFormPage.BTN_UPLOAD)
                    .selectFile('cypress/fixtures/files/26MB.bin', { force: true })
                orderFormPage.verifyNotShowDownloadIcon();
                orderFormPage.verifyFileError();
            })
            it('Complete download and open successfull', () => {
                cy.get(orderFormPage.BTN_UPLOAD)
                    .selectFile('cypress/fixtures/files/test.txt', { force: true })
                orderFormPage.verifyShowDownloadIcon();
                cy.wait(2000)
                cy.get('.download > .sc-843c7219-0')
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
                    .selectFile('cypress/fixtures/files/20MB.bin', { force: true })
                orderFormPage.verifyNotShowDelIcon();
            })
            it('Not show icon download when upload error file', () => {
                cy.get(orderFormPage.BTN_UPLOAD)
                    .selectFile('cypress/fixtures/files/20MB.bin', { force: true })
                orderFormPage.verifyNotShowDelIcon();
                orderFormPage.verifyFileError();
            })
            it('Complete download and delete successfull', () => {
                cy.get(orderFormPage.BTN_UPLOAD)
                    .selectFile('cypress/fixtures/files/test.txt', { force: true });
                cy.wait(3000);
                cy.get(orderFormPage.BTN_DEL_FILE)
                    .click();
                cy.contains('test.txt')
                    .should('not.exist');
            })
        })
        it('Uploading multiple files at the same time', () => {
            cy.get(orderFormPage.BTN_UPLOAD)
                // .selectFile([UnderValidFile.location,InValidFile.location,ValidFile.location], { force: true })
                .selectFile(UploadFileFormat.map(file => file.location), { force: true })
        })
        it("Should success File <6Mb", () => {
            cy.get(orderFormPage.BTN_UPLOAD)
                .selectFile(UnderValidFile.location, { force: true })
            orderFormPage.verifyShowDownloadIcon();
        })
        it("Should success File =6Mb", () => {
            cy.get(orderFormPage.BTN_UPLOAD)
                .selectFile(ValidFile.location, { force: true })
            orderFormPage.verifyShowDownloadIcon();
        })
        it("Should error file >6Mb", () => {
            cy.get(orderFormPage.BTN_UPLOAD)
                .selectFile(InValidFile.location, { force: true })
            orderFormPage.verifyFileError();
        })
        it("Should succes file <25Mb", () => {
            cy.get(orderFormPage.BTN_UPLOAD)
                .selectFile(UnderValidFile25MB.location, { force: true });
            cy.get(orderFormPage.BTN_DOWNLOAD, { timeout: 60000 })
                .should('be.visible');
        })
        it("Should success file =25Mb", () => {
            cy.get(orderFormPage.BTN_UPLOAD)
                .selectFile(ValidFile25MB.location, { force: true });
            cy.get(orderFormPage.BTN_DOWNLOAD, { timeout: 60000 })
                .should('be.visible');
        })
        it("Should error file >25Mb", () => {
            cy.get(orderFormPage.BTN_UPLOAD)
                .selectFile(InValidFile25MB.location, { force: true });
            orderFormPage.verifyFileError();
        })
        it('Multi file format', () => {
            let i = 0;
            UploadFileFormat.forEach((item) => {

                cy.get(orderFormPage.BTN_UPLOAD)
                    .selectFile(item.location, { force: true })
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
            if (getDataOrder().ORDER_TYPE == 'writing') {
                cy.get(orderFormPage.BTN_NEXT)
                    .contains('Skip')
                    .should('be.visible')
                cy.get(orderFormPage.BTN_NEXT)
                    .should('not.contain', 'Next')
                return;
            }
            cy.get(orderFormPage.BTN_NEXT)
                .click({ force: true })
            cy.get(orderFormPage.ERR_MES)
                .should("contain", ErrorMessages.OrderFieldRequired);
        });
        it.skip('Still keep file after next or back step', () => {
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
                .selectFile(UploadFile.OverValid, { force: true })
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
        it.only('Should display correct file name', () => {
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
                cy.get(orderFormPage.ARROW_UP_LAP)
                    .click({ force: true })
                cy.get(orderFormPage.ARROW_DOWN_LAP)
                    .should('be.visible')
                    .click({ force: true })
                    .get(orderFormPage.ARROW_UP_LAP)
                    .should('be.visible')
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
                    .click({ force: true });
                orderFormPage.verifyStepName(StepOrderTitle.NewStep1);
                cy.get(orderFormPage.ORDER_PREVIEW).contains('Attachments')
                    .click({ force: true });


                cy.get(orderFormPage.ORDER_PREVIEW).contains(getDataOrder().DISCIPLINE)
                    .click({ force: true });
                orderFormPage.verifyStepName(StepOrderTitle.NewStep1);
                cy.get(orderFormPage.ORDER_PREVIEW).contains('Attachments')
                    .click({ force: true });


                cy.get(orderFormPage.ORDER_PREVIEW).contains(getDataOrder().ACADEMIC_LEVEL)
                    .click({ force: true });
                orderFormPage.verifyStepName(StepOrderTitle.NewStep1);
                cy.get(orderFormPage.ORDER_PREVIEW).contains('Attachments')
                    .click({ force: true });

                //step2
                if (getDataOrder().TITLE != '') {
                    cy.get(orderFormPage.ORDER_PREVIEW).contains(getDataOrder().TITLE)
                        .click({ force: true });
                    orderFormPage.verifyStepName(StepOrderTitle.NewStep2);
                    cy.get(orderFormPage.ORDER_PREVIEW).contains('Attachments')
                        .click({ force: true });
                }
                cy.get(orderFormPage.ORDER_PREVIEW).contains(getDataOrder().INSTRUCTIONS)
                    .click({ force: true });
                orderFormPage.verifyStepName(StepOrderTitle.NewStep2);
                cy.get(orderFormPage.ORDER_PREVIEW).contains('Attachments')
                    .click({ force: true });
            })
        })
    })

})

