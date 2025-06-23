//https://docs.google.com/spreadsheets/d/19Knmyxh26B4wYwJcTvxwRQkVIHzEilkQdaaHmwQ-76Q/edit#gid=1195342885
import {
    CopyText, ErrorMessages, WrongEmail,
    ExistEmail
} from "../../support/constants/defaultvalue"
import { ROUTERS } from "../../support/constants/url"
import { TCForInvalidEmail, PasswordLV0 } from "../../support/constants/validate"
import signinPage from "./pages/signinPage"
describe('Sign in', () => {
    beforeEach(() => {
        cy.visit(ROUTERS.SIGN_IN)
    })
    context("Navigate", function () {
        it("By URL", function () {
            cy.get(signinPage.TITLE)
                .contains("Sign in to your account")
        })
        it("From Home pages", function () {
            cy.visit(ROUTERS.HOME)
            cy.contains('Sign in')
                .click({ force: true })
            cy.verifylocate(ROUTERS.SIGN_IN)
            cy.contains("Sign in to your account")
                .should('be.visible')
        })
    })
    it('Sign in succesfully', () => {
        signinPage.typeEmail(ExistEmail.email)
        signinPage.typePassword(ExistEmail.password)
        cy.get(signinPage.CHECKBOX)
            .click({ force: true })
        cy.get(signinPage.BTN_SUB)
            .click({ force: true })
        cy.wait(4000)
        cy.verifylocate(ROUTERS.HOME)
        cy.get(signinPage.NUMBER_BALANCE)
            .should("not.contain.text", "NaN")
    })
    context('Email Field', () => {
        it('Copy & Paste', () => {
            // Đảm bảo CopyText đã được định nghĩa, ví dụ:
            cy.checkCopyPaste(CopyText, signinPage.TXT_EMAIL)
        })

        it("Leaving the field empty", () => {
            signinPage.typePassword("123123")
            cy.get(signinPage.BTN_SUB)
                .click({ force: true })
            cy.wait(1000)
            cy.get(signinPage.MES_ERROR)
                .should("contain", ErrorMessages.EmailRequired)
        })
        it("Wrong email", () => {
            cy.get(signinPage.TXT_EMAIL)
                .type(WrongEmail)
            signinPage.typePassword("123123")
            cy.get(signinPage.BTN_SUB)
                .click({ force: true })
            cy.wait(1000)
            cy.get(signinPage.MES_ERROR)
                .should("contain", ErrorMessages.WrongEmailorPass)
        })
        it("Invalid email", () => {
            cy.get(signinPage.TXT_EMAIL)
                .type(TCForInvalidEmail[0].email)
            signinPage.typePassword("123123")
            cy.get(signinPage.BTN_SUB)
                .click({ force: true })
            cy.wait(1000)
            cy.get(signinPage.MES_ERROR)
                .should("contain", ErrorMessages.InvalidEmail)
        })
        it("Input exist email", () => {
            signinPage.typeEmail(ExistEmail.email)
            signinPage.typePassword(ExistEmail.password)
            cy.get(signinPage.BTN_SUB)
                .click({ force: true })
            cy.wait(4000)
            cy.location('pathname')
                .should('eq', ROUTERS.HOME)
            cy.get(signinPage.NUMBER_BALANCE)
                .should("not.contain.text", "NaN")
        })
        it('should sign in successfully if email contains white space before and after', () => {
            signinPage.typeEmail(`	${ExistEmail.email}	`)
            signinPage.typePassword(ExistEmail.password)
            cy.get(signinPage.BTN_SUB)
                .click({ force: true })
            cy.location('pathname')
                .should('eq', ROUTERS.HOME);
            cy.wait(4000)
            cy.get(signinPage.NUMBER_BALANCE)
                .should("not.contain.text", "NaN")
        })
    })
    context("Password field", () => {
        it('Copy & Paste', () => {
            cy.checkCopyPaste(CopyText, signinPage.TXT_EMAIL)
        })
        it("Leaving the field empty", () => {
            signinPage.typeEmail(123123)
            cy.get(signinPage.BTN_SUB)
                .click({ force: true })
            cy.wait(1000)
            cy.contains("The password field is required.")
                .should('be.visible')

        })
        it("Wrong Password", () => {
            signinPage.typeEmail(ExistEmail.email)
            signinPage.typePassword("Password")
            cy.get(signinPage.BTN_SUB)
                .click({ force: true })
            cy.wait(1000)
            cy.get(signinPage.MES_ERROR)
                .should("contain", ErrorMessages.WrongEmailorPass)
        })
        it("Invalid Password", () => {
            signinPage.typeEmail(ExistEmail.email)
            signinPage.typePassword(PasswordLV0[0].password)
            cy.get(signinPage.BTN_SUB)
                .click({ force: true })
            cy.wait(1000)
            cy.get(signinPage.MES_ERROR)
                .should("contain", ErrorMessages.PasswordLeast6)
        })
        it("Input correct email", () => {
            signinPage.typeEmail(ExistEmail.email)
            signinPage.typePassword(ExistEmail.password)
            cy.get(signinPage.BTN_SUB)
                .click({ force: true })
            cy.wait(10000)
            cy.location('pathname')
                .should('eq', ROUTERS.HOME)
            cy.get(signinPage.NUMBER_BALANCE)
                .should("not.contain.text", "NaN")
        })
    })
    context("Remember me", () => {
        it("Checked, Sign in success fully", () => {
            signinPage.typeEmail(ExistEmail.email)
            signinPage.typePassword(ExistEmail.password)
            cy.get(signinPage.CHECKBOX)
                .click({ force: true })
            cy.get(signinPage.BTN_SUB)
                .click({ force: true })
            cy.wait(4000)
            cy.location('pathname')
                .should('eq', ROUTERS.HOME)
            cy.clearCookies()
            cy.visit(ROUTERS.SIGN_IN)
            cy.get("h1")
                .contains("Sign in to your account")
        })
    })
    it("Forgot Password", () => {
        cy.contains("Forgot password?")
            .click({ force: true })
        cy.location("pathname")
            .should("eq", ROUTERS.FORGOT_PASSWORD)
        cy.get("h1")
            .contains("Forgot your password?")
    })
    it("Sign up hyperlink is active", () => {
        cy.contains("Sign Up")
            .click({ force: true })
        cy.location("pathname")
            .should("eq", ROUTERS.SIGN_UP)
    })
})
