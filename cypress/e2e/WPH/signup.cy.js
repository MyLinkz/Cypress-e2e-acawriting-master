//https://docs.google.com/spreadsheets/d/19Knmyxh26B4wYwJcTvxwRQkVIHzEilkQdaaHmwQ-76Q/edit#gid=556681741
import { faker } from "@faker-js/faker";
import {
    OverLength255, CopyText, ErrorMessages,
} from "../../support/constants/defaultvalue";
import { LOCATE_SIGNIN, LOCATE_NEWFORM, LOCATE_SIGNUP } from "../../support/constants/locate"
import { ROUTERS } from "../../support/constants/url"
import {
    PasswordLV0, PasswordLV1, PasswordLV2, PasswordLV3, PasswordLV4,
    ValidFullName, TCForInvalidEmail, ValidEmail, TCForInvaildPassword,
    TCForVaildPassword
} from "../../support/constants/validate"

const HyperLink = {
    SignIn: '.signup__link',
    SignUp: 'abcd'
}
describe('Signup', () => {
    beforeEach(() => {
        cy.visit(ROUTERS.SIGN_UP)
    })
    context("Navigate", function () {
        it("From /signin", function () {
            cy.visit(ROUTERS.SIGN_IN)
            cy.contains("Sign Up")
                .click()
                .get("h1")
                .contains("Sign up for an account")
        })
        it("By URL", function () {
            cy.get("h1")
                .contains("Sign up for an account")
        })
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
                cy.get(LOCATE_SIGNUP.TXT_FULLNAME)
                    .type(CopyText)
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

                    cy.get(LOCATE_SIGNUP.NUMBER_BALANCE)
                        .should("not.contain.text", "NaN")
                })
            })
        })
    })
    context("[Full Name] Validation", () => {
        it('Copy & Paste', () => {
            cy.document().then((doc) => cy.spy(doc, 'execCommand').as('execCommand'))
            cy.get(LOCATE_SIGNUP.TXT_FULLNAME)
                .type(CopyText)
            cy.get(LOCATE_SIGNUP.TXT_FULLNAME).invoke('val').then(($temp) => {
                const txt = $temp
                cy.get(LOCATE_SIGNUP.TXT_FULLNAME)
                    .focus()
                cy.document().invoke('execCommand', 'copy')
                cy.get(LOCATE_SIGNUP.TXT_FULLNAME)
                    .clear()
                cy.get(LOCATE_SIGNUP.TXT_FULLNAME)
                    .type(`${txt}`)
                cy.get(LOCATE_SIGNUP.TXT_FULLNAME)
                    .invoke('val')
                    .should("contain", CopyText)
            })
        })
        it("Leave the Full Name field empty", () => {
            cy.get(LOCATE_SIGNUP.TXT_EMAIL)
                .type(faker.internet.email())
            cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
                .type('123123')
            cy.get(LOCATE_SIGNUP.CHECKBOX)
                .click({ force: true })
            cy.get(LOCATE_SIGNUP.BTN_SUB)
                .click({ force: true })

            cy.get(LOCATE_SIGNUP.NUMBER_BALANCE)
                .should("not.contain.text", "NaN")
        })
        ValidFullName.forEach((value) => {
            it(`Input valid value: ${value.description}`, () => {
                cy.get(LOCATE_SIGNUP.TXT_EMAIL)
                    .type(faker.internet.email())
                cy.get(LOCATE_SIGNUP.TXT_FULLNAME)
                    .type(value.fullName)
                cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
                    .type("123123")
                cy.get(LOCATE_SIGNUP.CHECKBOX)
                    .click({ force: true })
                cy.get(LOCATE_SIGNUP.BTN_SUB)
                    .click({ force: true })

                cy.get(LOCATE_SIGNUP.NUMBER_BALANCE)
                    .should("not.contain.text", "NaN")
            })
        })
        it("Input > 255 characters", () => {
            cy.get(LOCATE_SIGNUP.TXT_EMAIL)
                .type(faker.internet.email())
            cy.get(LOCATE_SIGNUP.TXT_FULLNAME)
                .type(`${OverLength255}`)
            cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
                .type('123123')
            cy.get(LOCATE_SIGNUP.CHECKBOX)
                .click({ force: true })
            cy.get(LOCATE_SIGNUP.BTN_SUB)
                .click({ force: true })

            cy.get(LOCATE_SIGNUP.MES_ERROR)
                .should("contain", ErrorMessages.OverLength255)
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
                        .type(faker.internet.email())
                    cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
                        .type(value.password)
                    cy.get(LOCATE_SIGNUP.BTN_SUB)
                        .click({ force: true })

                    cy.get(LOCATE_SIGNUP.MES_ERROR)
                        .should("contain", `${ErrorMessages.PasswordLeast6}`)
                })
            })
        })
        context("Vailid Password", () => {
            it("Leave the Full Name field empty", () => {
                cy.get(LOCATE_SIGNUP.TXT_EMAIL)
                    .type(faker.internet.email())
                cy.get(LOCATE_SIGNUP.TXT_FULLNAME)
                    .type('123123')
                cy.get(LOCATE_SIGNUP.CHECKBOX)
                    .click({ force: true })
                cy.get(LOCATE_SIGNUP.BTN_SUB)
                    .click({ force: true })

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

                    cy.get(LOCATE_SIGNUP.NUMBER_BALANCE)
                        .should("not.contain.text", "NaN")
                })
            })
        })
        context("Password strength meters", () => {
            PasswordLV0.forEach((value) => {
                it('Level 0:' + `${value.description}`, () => {
                    cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
                        .click()
                        .type(value.password)
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(0)
                        .should('not.have.class', 'active')
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(1)
                        .should('not.have.class', 'active')
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(2)
                        .should('not.have.class', 'active')
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(3)
                        .should('not.have.class', 'active')
                })
            })
            PasswordLV1.forEach((value) => {
                it('Level 1:' + `${value.description}`, () => {
                    cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
                        .click()
                        .type(value.password)
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(0)
                        .should('have.class', 'active')
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(1)
                        .should('not.have.class', 'active')
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(2)
                        .should('not.have.class', 'active')
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(3)
                        .should('not.have.class', 'active')
                })
            })
            PasswordLV2.forEach((value) => {
                it('Level 2:' + `${value.description}`, () => {
                    cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
                        .click()
                        .type(value.password)
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(0)
                        .should('have.class', 'active')
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(1)
                        .should('have.class', 'active')
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(2)
                        .should('not.have.class', 'active')
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(3)
                        .should('not.have.class', 'active')
                })
            })
            PasswordLV3.forEach((value) => {
                it('Level 3:' + `${value.description}`, () => {
                    cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
                        .click()
                        .type(value.password)
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(0)
                        .should('have.class', 'active')
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(1)
                        .should('have.class', 'active')
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(2)
                        .should('have.class', 'active')
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(3)
                        .should('not.have.class', 'active')
                })
            })
            PasswordLV4.forEach((value) => {
                it('Level 4:' + `${value.description}`, () => {
                    cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
                        .click()
                        .type(value.password)
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(0)
                        .should('have.class', 'active')
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(1)
                        .should('have.class', 'active')
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(2)
                        .should('have.class', 'active')
                    cy.get(LOCATE_SIGNUP.PASSWORD_STRENG).eq(3)
                        .should('have.class', 'active')
                })
            })
        })
    })
    context("Check box", () => {
        it("Uncheck", () => {
            cy.get(LOCATE_SIGNUP.TXT_EMAIL)
                .type(faker.internet.email())
            cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
                .type('123123')
            cy.get(LOCATE_SIGNUP.CHECKBOX)
            cy.get(LOCATE_SIGNUP.BTN_SUB)
                .click({ force: true })

            cy.get(LOCATE_SIGNUP.NUMBER_BALANCE)
                .should("not.contain.text", "NaN")
        })
        it("Checked", () => {
            cy.get(LOCATE_SIGNUP.TXT_EMAIL)
                .type(faker.internet.email())
            cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
                .type('123123')
            cy.get(LOCATE_SIGNUP.CHECKBOX)
                .click({ force: true })
            cy.get(LOCATE_SIGNUP.BTN_SUB)
                .click({ force: true })

            cy.get(LOCATE_SIGNUP.NUMBER_BALANCE)
                .should("not.contain.text", "NaN")
        })
    })
    context("Button Create account:", () => {
        it("SHOULD validate and show the error messages again after the user clicked Create Account", () => {
            cy.get(LOCATE_SIGNUP.TXT_EMAIL)
                .type('a')
            cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
                .type('a')
            cy.get(LOCATE_SIGNUP.BTN_SUB)
                .click({ force: true })
            cy.get(LOCATE_SIGNUP.MES_ERROR)
                .eq(0)
                .should("contain", ErrorMessages.InvalidEmail)
            cy.get(LOCATE_SIGNUP.MES_ERROR)
                .eq(1)
                .should("contain", ErrorMessages.PasswordLeast6)
            cy.get(LOCATE_SIGNUP.TXT_EMAIL)
                .clear()
                .type('b')
            cy.get(LOCATE_SIGNUP.TXT_PASSWORD)
                .clear()
                .type('b')
            cy.get(LOCATE_SIGNUP.BTN_SUB)
                .click({ force: true })
            cy.get(LOCATE_SIGNUP.MES_ERROR)
                .eq(0)
                .should("contain", ErrorMessages.InvalidEmail)
            cy.get(LOCATE_SIGNUP.MES_ERROR)
                .eq(1)
                .should("contain", ErrorMessages.PasswordLeast6)
        })
    })
    context("Sign-in button", () => {
        it("Navigate to the sign-in page correctly", () => {
            cy.get(HyperLink.SignIn)
                .click({ force: true })
            cy.location("pathname")
                .should("eq", ROUTERS.SIGN_IN)
        })
    })

})
