//https://docs.google.com/spreadsheets/d/19Knmyxh26B4wYwJcTvxwRQkVIHzEilkQdaaHmwQ-76Q/edit#gid=1754057790

// Cypress.config('baseUrl', 'http://192.168.1.55:3021/');
// import 'cypress-wait-until';

import 'cypress-file-upload';
import {
    AcademicLevel, PaperFormat, PlaceholderValue, CopyText, TopicLength,
    ExistEmail, PaperTypes, SubjectTypes, ErrorMessages,
    StepOrderTitle, CommomTextbox, TheOrderByStep1, TheOrderByStep2
} from "../../support/constants/defaultvalue"
import { LOCATE_SIGNIN, LOCATE_NEWFORM } from "../../support/constants/locate"
import { ROUTERS } from "../../support/constants/url"
import { formatFileName, InValidFile, UnderValidFile, ValidFile, UploadMultiFile, UploadFileFormat, UnderValidFile25MB, ValidFile25MB, InValidFile25MB } from '../../support/constants/validate';
import { Signin } from '../../support/utlis';
import orderFormPage from './pages/orderFormPage';
describe("Step 2", () => {
    const maxRetries = 5;
    let retryCount = 0;
    const LOCATE_NEWFORM = orderFormPage;
    beforeEach(function () {

        Signin()
        cy.contains('Order Now')
            .click({ force: true })
        cy.contains(AcademicLevel[1], { timeout: 20000 })
            .click({ force: true })
        cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
            .type(PaperTypes[1].title)
        cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
            .type(SubjectTypes[1].title, { force: true })
        cy.contains(`${PaperFormat[1]}`)
            .click({ force: true })
        cy.get(LOCATE_NEWFORM.BTN_NEXT)
            .click({ force: true })
        //     .click({ force: true })
        // Go to step 2
    })
    it('Check title of step', () => {
        cy.contains(StepOrderTitle.NewStep2)
            .should('be.visible')
    })
    context('[Title] textbox', () => {
        it("Check place holder", () => {
            cy.get(LOCATE_NEWFORM.TXT_TITLE)
                .invoke('attr', 'placeholder')
                .should('equal', PlaceholderValue.NEW_TITLE);
        })
        it("Empty textbox -> Next", () => {
            cy.get(LOCATE_NEWFORM.TXT_TITLE)
                .clear()
            cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
                .type(CopyText)
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.contains(StepOrderTitle.NewStep3)
        })
        it("Check count character", () => {
            cy.get(LOCATE_NEWFORM.TXT_TITLE)
                .type(TopicLength.Longer)
            cy.get(LOCATE_NEWFORM.COUNT_CHAR)
                .invoke("text")
                .should('eq', `${TopicLength.EqualNumber} / 300`)
        })
        it("Input <300 character", () => {
            cy.get(LOCATE_NEWFORM.TXT_TITLE)
                .type(TopicLength.LessThan)
            cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
                .type(CopyText)
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.contains(StepOrderTitle.NewStep3)
                .should('be.visible')
        })
        it("Input =300 character", () => {
            cy.get(LOCATE_NEWFORM.TXT_TITLE)
                .type(TopicLength.Equal)
            cy.get(LOCATE_NEWFORM.COUNT_CHAR)
                .invoke("text")
                .should('eq', `${TopicLength.EqualNumber} / 300`)
            cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
                .type(CopyText)
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.contains(StepOrderTitle.NewStep3)
                .should('be.visible')
        })
        it("Input >300 character", () => {
            cy.get(LOCATE_NEWFORM.TXT_TITLE)
                .type(TopicLength.Longer)
            cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
                .type(CopyText)
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.contains(StepOrderTitle.NewStep3)
                .should('be.visible')

        })
        it("Value show corret at order Preview", () => {
            cy.get(LOCATE_NEWFORM.TXT_TITLE)
                .type(TopicLength.Equal)
            cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                .contains(TopicLength.Equal)
                .should('be.visible')
        })
        it("Enter space character, and auto trim", () => {
            cy.get(LOCATE_NEWFORM.TXT_TITLE)
                .type(TopicLength.Spacing)
            cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                // .invoke("text")/*  */
                .should("contain", TopicLength.Spacing.trim())
        })
    })
    context('[Instructions] textbox', () => {
        it("Check place holder", () => {
            cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
                .invoke('attr', 'placeholder')
                .should('equal', PlaceholderValue.NEW_INSTRUCT);
        })
        it("Empty -> Next", () => {
            //Add data for other required fields: Type of document, Instructions
            cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
                .clear({ force: true })
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.contains(`${ErrorMessages.OrderFieldRequired}`)
                .should('be.visible')
            cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                .should('not.contain', 'Instructions:')
        })
        it("Input data succesfully and show at Order Preview", () => {
            cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
                .type(CommomTextbox.FullCharacter)
            cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                .should('contain', CommomTextbox.FullCharacter)
        })
    })
    context('Upload file', () => {
        it('Loading state', () => {
            cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                .selectFile('cypress/fixtures/25MB.bin', { force: true })
            cy.get(LOCATE_NEWFORM.SPING_LOAD)
                .should('be.visible')
        })
        it('Complete upload', () => {
            cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                .selectFile('cypress/fixtures/25MB.bin', { force: true })
            cy.get(LOCATE_NEWFORM.BTN_DOWNLOAD, { timeout: 60000 })
                .should('be.visible')
        })
        it('Error upload', () => {
            cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                .selectFile('cypress/fixtures/26MB.bin', { force: true })
            cy.get(LOCATE_NEWFORM.INVALID_FILE, { timeout: 60000 })
                .should('be.visible')
        })
        context('Check download file', () => {
            it('Not show icon download when loading file', () => {
                cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                    .selectFile('cypress/fixtures/20MB.bin', { force: true })
                cy.get(LOCATE_NEWFORM.BTN_DOWNLOAD)
                    .should('not.exist')
            })
            it('Not show icon download when upload error file', () => {
                cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                    .selectFile('cypress/fixtures/26MB.bin', { force: true })
                cy.get(LOCATE_NEWFORM.INVALID_FILE, { timeout: 60000 })
                    .should('be.visible')
                cy.get(LOCATE_NEWFORM.BTN_DOWNLOAD, { timeout: 60000 })
                    .should('not.exist')
            })
            it('Complete download and open successfull', () => {
                cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                    .selectFile('cypress/fixtures/test.txt', { force: true })

                cy.get(LOCATE_NEWFORM.BTN_DOWNLOAD)
                    .should('be.visible')
                    .click({ force: true })
                cy.verifyDownload('test.txt');
                cy.readFile('cypress/downloads/test.txt').then((content) => {
                    expect(content).to.include('test'); // Kiểm tra nội dung có chứa văn bản mong đợi
                })
            })
        })
        context('Check delete file', () => {
            it('Not show icon delete when loading file', () => {
                cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                    .selectFile('cypress/fixtures/20MB.bin', { force: true })
                cy.get(LOCATE_NEWFORM.DEL_FILE)
                    .should('not.exist')
            })
            it('Not show icon download when upload error file', () => {
                cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                    .selectFile('cypress/fixtures/26MB.bin', { force: true })
                cy.get(LOCATE_NEWFORM.INVALID_FILE, { timeout: 60000 })
                    .should('be.visible')
                cy.get(LOCATE_NEWFORM.DEL_FILE, { timeout: 60000 })
                    .should('not.exist')
            })
            it('Complete download and delete successfull', () => {
                cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                    .selectFile('cypress/fixtures/test.txt', { force: true })
                cy.get(LOCATE_NEWFORM.DEL_FILE)
                    .click({ force: true })
                cy.contains('test.txt')
                    .should('not.exist')
            })
        })
        it('Uploading multiple files at the same time', () => {
            cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                // .selectFile([UnderValidFile.location,InValidFile.location,ValidFile.location], { force: true })
                .selectFile(UploadFileFormat.map(file => file.location), { force: true })

        })
        it("Should success File <6Mb", () => {
            cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                .selectFile(UnderValidFile.location, { force: true })
            cy.get(LOCATE_NEWFORM.BTN_DOWNLOAD, { timeout: 60000 })
                .should('be.visible')
        })
        it("Should success File =6Mb", () => {
            cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                .selectFile(ValidFile.location, { force: true })
            cy.get(LOCATE_NEWFORM.BTN_DOWNLOAD, { timeout: 60000 })
                .should('be.visible')
        })
        it("Should error file >6Mb", () => {
            cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                .selectFile(InValidFile.location, { force: true })
            cy.get(LOCATE_NEWFORM.INVALID_FILE, { timeout: 60000 })
                .should('be.visible')
        })
        it("Should succes file <25Mb", () => {
            cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                .selectFile(UnderValidFile25MB.location, { force: true });
            cy.get(LOCATE_NEWFORM.BTN_DOWNLOAD, { timeout: 60000 })
                .should('be.visible');
        })
        it("Should success file =25Mb", () => {
            cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                .selectFile(ValidFile25MB.location, { force: true });
            cy.get(LOCATE_NEWFORM.BTN_DOWNLOAD, { timeout: 60000 })
                .should('be.visible');
        })
        it("Should error file >25Mb", () => {
            cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                .selectFile(InValidFile25MB.location, { force: true });
            cy.get(LOCATE_NEWFORM.INVALID_FILE, { timeout: 60000 })
                .should('be.visible');
        })
        it('Multi file format', () => {
            UploadFileFormat.forEach((item) => {
                cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                    .selectFile(item.location, { force: true })
                cy.get(LOCATE_NEWFORM.BTN_DOWNLOAD)
                    .should('be.visible')
            })
        })
        it('File name should compair', () => {
            const fileName = 'longnamefiletestlongnamefiletestlongnamefiletestlongnamefiletestlongnamefiletestlongnamefiletestlongnamefiletestlongnamefiletest.txt'
            cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                .selectFile(`cypress/fixtures/${fileName}`, { force: true })

            cy.get('.name').invoke('text').then((text) => {
                expect(formatFileName(fileName)).to.equal(text);
            });
        })
        it('Still keep file after next or back step', () => {
            cy.get(LOCATE_NEWFORM.BTN_UPLOAD)
                .selectFile(ValidFile.location, { force: true })
            cy.get(LOCATE_NEWFORM.BTN_DOWNLOAD, { timeout: 60000 })
                .should('be.visible')
            cy.get(LOCATE_NEWFORM.BTN_BACK)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.contains(ValidFile.name)
                .should('be.visible')
            cy.get(LOCATE_NEWFORM.BTN_DOWNLOAD, { timeout: 60000 })
                .should('be.visible')
        })
    })
    it('[Back] button active, not save data and back to previous step', () => {
        cy.get(LOCATE_NEWFORM.BTN_BACK)
            .click({ force: true })
        cy.contains(StepOrderTitle.NewStep1)
            .should('be.visible')
        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
            .should('contain', AcademicLevel[1])
            .should('contain', PaperTypes[1].title)
            .should('contain', SubjectTypes[1].title)
            .should('contain', `${PaperFormat[1]}`)
        cy.get(LOCATE_NEWFORM.ORDER_INPUT)
            .should('contain', AcademicLevel[1])
            .should('contain', PaperTypes[1].title)
            .should('contain', SubjectTypes[1].title)
            .should('contain', `${PaperFormat[1]}`)
    })
    it('[Next] button active, and go to step 3 successfully', () => {
        cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
            .type(CopyText, { force: true })
        cy.get(LOCATE_NEWFORM.BTN_NEXT)
            .click({ force: true })
        cy.contains(StepOrderTitle.NewStep3)
            .should('be.visible')
    })
    context.only('Order Preview', () => {
        it('Default status of collapse', () => {
            cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_COL)
                .should('not.exist')
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
        it('Check display by the order', () => {
            TheOrderByStep1.forEach((item) => {
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_ITEM).eq(item.id)
                    .should('contain', item.name)
            })
        })
        it.only('Title & intruction should display on it', () => {
            cy.get(LOCATE_NEWFORM.TXT_TITLE)
                .type(CopyText, { force: true })
            cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
                .type(CopyText, { force: true })
            TheOrderByStep2.forEach((item) => {
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_ITEM).eq(item.id)
                    .should('contain', item.name)
            })
        })
    })
    context('[Edit] button', () => {
        it('Back to that field succesfully', () => {
            cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                .contains(AcademicLevel[1])
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.STEP_NAME)
                .should('contain', StepOrderTitle.NewStep1)
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.STEP_NAME)
                .should('contain', StepOrderTitle.NewStep2)

            cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                .contains(PaperTypes[1].title)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.STEP_NAME)
                .should('contain', StepOrderTitle.NewStep1)
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.STEP_NAME)
                .should('contain', StepOrderTitle.NewStep2)

            cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                .contains(SubjectTypes[1].title)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.STEP_NAME)
                .should('contain', StepOrderTitle.NewStep1)
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.STEP_NAME)
                .should('contain', StepOrderTitle.NewStep2)

            cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                .contains(`${PaperFormat[1]}`)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.STEP_NAME)
                .should('contain', StepOrderTitle.NewStep1)
        })
        it('Not function at current step', () => {
            cy.get(LOCATE_NEWFORM.TXT_TITLE)
                .type(CommomTextbox.Letter)
            cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
                .type(CopyText)
            cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                .contains(CommomTextbox.Letter)
                .click({ force: true })
            cy.contains(StepOrderTitle.NewStep2)
                .should('be.visible')
            cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                .contains(CopyText)
                .click({ force: true })
            cy.contains(StepOrderTitle.NewStep2)
                .should('be.visible')
        })
    })
    context('Check the saving of order information at screen step 2', () => {
        it('Back to Step 1 and after that go to step 2. The fields will be empty', () => {
            cy.get(LOCATE_NEWFORM.TXT_TITLE)
                .type(CopyText, { force: true })
            cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
                .type(CopyText, { force: true })
            cy.get(LOCATE_NEWFORM.BTN_BACK)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.TXT_TITLE)
                .should('not.contain', CopyText)
            cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
                .should('not.contain', CopyText)
        })
        it('Next to Step 3 and after that back to step 2. The fields will be saved', () => {
            cy.get(LOCATE_NEWFORM.TXT_TITLE)
                .type(CopyText, { force: true })
            cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
                .type(CopyText, { force: true })
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.BTN_BACK)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.TXT_TITLE)
                .invoke('val')
                .should('contain', CopyText)
            cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
                .should('contain', CopyText)
        })
    })
})
