// https://docs.google.com/spreadsheets/d/19Knmyxh26B4wYwJcTvxwRQkVIHzEilkQdaaHmwQ-76Q/edit#gid=1173477861
// import 'cypress-wait-until';
import 'cypress-file-upload';
import {
    AcademicLevel, PaperFormat, Order, CopyText,
    ExistEmail, PaperTypes, SubjectTypes,
    StepOrderTitle, CommomTextbox, Deadline,
    Extra
} from "../../support/constants/defaultvalue"
import {
    LOCATE_SIGNIN, LOCATE_NEWFORM
} from "../../support/constants/locate"
import { ROUTERS } from "../../support/constants/url"
import { Signin, ShowValue } from '../../support/utlis';
describe("Step 4", () => {
    const maxRetries = 5;
    let retryCount = 0;
    beforeEach(function () {
        retryCount = 0;
        cy.log(`Retrying beforeEach... Attempt ${retryCount + 1}`);
        while (retryCount < maxRetries) {
            try {
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
                cy.get(LOCATE_NEWFORM.TXT_TITLE)
                    .type(CopyText)
                cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
                    .type(CommomTextbox.Letter)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.BTN_NEXT)
                    .click({ force: true })
                // Go to step 3
                cy.get(LOCATE_NEWFORM.BTN_INC_PAGES)
                    .click()
                cy.get(LOCATE_NEWFORM.BTN_INC_SLIDE)
                    .click()
                cy.get(LOCATE_NEWFORM.BTN_INC_SOURCE)
                    .click()
                cy.get(LOCATE_NEWFORM.SEL_DEADLINE)
                    .contains(Deadline[1])
                    .click()
                cy.get(LOCATE_NEWFORM.SEL_SPACING)
                    .find('button:not(.active)')
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.BTN_NEXT)
                    .click({ force: true })
                break
            } catch (error) {
                retryCount++;
                cy.log(`Retrying beforeEach... Attempt ${retryCount + 1}`); console.log(`Retrying beforeEach... Attempt ${retryCount + 1}`);
            }
        }
        if (retryCount === maxRetries) {
            throw new Error(`Failed to prepare before each test after ${maxRetries} attempts.`);
        }
    })
    it('Check title of step', () => {
        cy.contains(StepOrderTitle.NewStep4)
            .should('be.visible')
    })
    context('Writer', () => {
        it('Default value', () => {
            cy.get(LOCATE_NEWFORM.RAD_EXTRA)
                .contains(Order.Extra)
                .parent()
                .parent()
                .should('have.class', 'item-active')
        })
        Extra.forEach((item) => {
            it(`[${item.id}] radio button active successsfully`, () => {
                cy.get(LOCATE_NEWFORM.ORDER_INPUT)
                    .contains(item.id)
                    .click({ force: true })
                    .parent()
                    .parent()
                    .should('have.class', 'item-active')
            })
        })
        context("Order Preview update successfully when change value", () => {
            Extra.forEach((item) => {
                it(`[${item.id}] radio button active successsfully`, () => {
                    cy.get(LOCATE_NEWFORM.ORDER_INPUT)
                        .contains(item.id)
                        .click({ force: true })
                    cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_EXTRA)
                        .should('contain', item.id)
                })
            })
        })
    })
    it('[Back] button active, not save data and back to previous step', { timeout: 10000 }, () => {
        cy.get(LOCATE_NEWFORM.BTN_BACK)
            .click({ force: true })
        cy.contains(StepOrderTitle.NewStep3)
            .should('be.visible')
        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_DETAILS)
            .should('be.visible')
        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_SPEC)
            .should('be.visible')
        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_EXTRA)
            .should('not.exist')
    })
    it('[Next] button active, and go to next step successfully', () => {
        cy.contains(Extra[2].id)
            .click({ force: true })
        cy.get(LOCATE_NEWFORM.BTN_NEXT)
            .click({ force: true })
        cy.contains(StepOrderTitle.NewStep5)
            .should('be.visible')
        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
            .should('contain', Extra[2].id)
    })
    context('Order Preview', () => {
        context('Details', () => {
            it('Default is collapsed', () => {
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_DETAILS)
                    .find(LOCATE_NEWFORM.ORDER_PREVIEW_COL)
                    .should('exist')
            })
            it('Open & Close collapse', () => {
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_DETAILS)
                    .find(LOCATE_NEWFORM.ORDER_PREVIEW_COL)
                    .should('exist')
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_DETAILS)
                    .find(LOCATE_NEWFORM.BTN_COL)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_DETAILS)
                    .find(LOCATE_NEWFORM.ORDER_PREVIEW_COL)
                    .should('not.exist')
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_DETAILS)
                    .find(LOCATE_NEWFORM.BTN_COL)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_DETAILS)
                    .find(LOCATE_NEWFORM.ORDER_PREVIEW_COL)
                    .should('exist')
            })
            it('Can Edit at the fields', () => {
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                    .contains(AcademicLevel[1])
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.STEP_NAME)
                    .should('contain', StepOrderTitle.NewStep1)
                cy.get(LOCATE_NEWFORM.BTN_NEXT)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.BTN_NEXT)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.STEP_NAME)
                    .should('contain', StepOrderTitle.NewStep3)

                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                    .contains(PaperTypes[1].title)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.STEP_NAME)
                    .should('contain', StepOrderTitle.NewStep1)
                cy.get(LOCATE_NEWFORM.BTN_NEXT)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.BTN_NEXT)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.STEP_NAME)
                    .should('contain', StepOrderTitle.NewStep3)

                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                    .contains(SubjectTypes[1].title)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.STEP_NAME)
                    .should('contain', StepOrderTitle.NewStep1)
                cy.get(LOCATE_NEWFORM.BTN_NEXT)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.BTN_NEXT)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.STEP_NAME)
                    .should('contain', StepOrderTitle.NewStep3)

                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                    .contains(`${PaperFormat[1]}`)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.STEP_NAME)
                    .should('contain', StepOrderTitle.NewStep1)
            })
            it('Icon [^] active and change to [v] when click on it', () => {
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_DETAILS)
                    .find(LOCATE_NEWFORM.ARROW_DOWN_LAP)
                    .should('be.visible')
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_DETAILS)
                    .find(LOCATE_NEWFORM.BTN_COL)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_DETAILS)
                    .find(LOCATE_NEWFORM.ARROW_UP_LAP)
                    .should('be.visible')
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_DETAILS)
                    .find(LOCATE_NEWFORM.BTN_COL)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_DETAILS)
                    .find(LOCATE_NEWFORM.ARROW_DOWN_LAP)
                    .should('be.visible')
            })
        })
        context('Specifications', () => {
            it('Default is collapse', () => {
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_SPEC)
                    .find(LOCATE_NEWFORM.ORDER_PREVIEW_COL)
                    .should('exist')
            })
            it('Close & Open collapse', () => {
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_SPEC)
                    .find(LOCATE_NEWFORM.BTN_COL)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_SPEC)
                    .find(LOCATE_NEWFORM.ORDER_PREVIEW_COL)
                    .should('not.exist')
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_SPEC)
                    .find(LOCATE_NEWFORM.BTN_COL)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_SPEC)
                    .find(LOCATE_NEWFORM.ORDER_PREVIEW_COL)
                    .should('exist')
            })
            it('Cannot Edit at the fields', () => {
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                    .contains('Deadline:')
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.STEP_NAME)
                    .contains(StepOrderTitle.NewStep3)

                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                    .contains('Sources to be cited:')
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.STEP_NAME)
                    .contains(StepOrderTitle.NewStep3)

                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                    .contains('Pages:')
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.STEP_NAME)
                    .contains(StepOrderTitle.NewStep3)

            })
            it('Icon [^] active and change to [v] when click on it', () => {
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_SPEC)
                    .find(LOCATE_NEWFORM.ARROW_DOWN_LAP)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_SPEC)
                    .find(LOCATE_NEWFORM.ARROW_UP_LAP)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_SPEC)
                    .find(LOCATE_NEWFORM.ARROW_DOWN_LAP)
                    .should('be.visible')
            })
        })
        context('Extras', () => {
            it('Default is not collapse', () => {
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_EXTRA)
                    .find(LOCATE_NEWFORM.ORDER_PREVIEW_COL)
                    .should('not.exist')
            })
            it('Close & Open collapse', () => {
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_EXTRA)
                    .find(LOCATE_NEWFORM.BTN_COL)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_EXTRA)
                    .find(LOCATE_NEWFORM.ORDER_PREVIEW_COL)
                    .should('exist')
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_EXTRA)
                    .find(LOCATE_NEWFORM.BTN_COL)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_EXTRA)
                    .find(LOCATE_NEWFORM.ORDER_PREVIEW_COL)
                    .should('not.exist')
            })
            it('Cannot Edit at the fields', () => {
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                    .contains("Writer's category")
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.STEP_NAME)
                    .contains(StepOrderTitle.NewStep4)
            })
            it('Icon [^] active and change to [v] when click on it', () => {
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_EXTRA)
                    .find(LOCATE_NEWFORM.ARROW_UP_LAP)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_EXTRA)
                    .find(LOCATE_NEWFORM.ARROW_DOWN_LAP)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_EXTRA)
                    .find(LOCATE_NEWFORM.ARROW_UP_LAP)
                    .should('be.visible')
            })
        })
    })
    context('Approx. cost', () => {
        AcademicLevel.forEach((item) => {
            it(`Cost change incase update Academic Level: ${item}`, () => {
                cy.get(LOCATE_NEWFORM.BTN_NEXT)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                    .find('span')
                    .contains('Academic Level:')
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.ORDER_INPUT)
                    .contains(item)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.BTN_NEXT)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.BTN_NEXT)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.BTN_NEXT)
                    .click({ force: true })
                ShowValue({
                    callback: (value) => {
                        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                            .should('contain', `$${value.TotalPriceFix}`)
                    }
                })
            })
        })
        it('Cost unchange incase change "Type of Document"', () => {
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                .find('span')
                .contains('Type of Document')
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.SEL_DOCUMENT)
                .type(PaperTypes[8].title, { force: true })
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            ShowValue({
                callback: (value) => {
                    cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                        .should('contain', `$${value.TotalPriceFix}`)
                }
            })
        })
        it('Cost unchange incase change "Discipline"', () => {
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                .find('span')
                .contains('Discipline')
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.SEL_DISCIPLINE)
                .type(SubjectTypes[8].title, { force: true })
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            ShowValue({
                callback: (value) => {
                    cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                        .should('contain', `$${value.TotalPriceFix}`)
                }
            })
        })
        PaperFormat.forEach((item) => {
            it(`Cost unchange incase change "Paper Format": ${item}`, () => {
                cy.get(LOCATE_NEWFORM.BTN_NEXT)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                    .find('span')
                    .contains('Paper Format')
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.ORDER_INPUT)
                    .contains(`${item}`)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.BTN_NEXT)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.BTN_NEXT)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.BTN_NEXT)
                    .click({ force: true })
                ShowValue({
                    callback: (value) => {
                        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                            .should('contain', `$${value.TotalPriceFix}`)
                    }
                })
            })
        })
        it('Cost unchange incase change "Tile"', () => {
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                .find('span')
                .contains('Title')
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.TXT_TITLE)
                .type('test', { force: true })
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            ShowValue({
                callback: (value) => {
                    cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                        .should('contain', `$${value.TotalPriceFix}`)
                }
            })
            cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                .find('span')
                .contains('Title')
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.TXT_TITLE)
                .clear({ force: true })
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            ShowValue({
                callback: (value) => {
                    cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                        .should('contain', `$${value.TotalPriceFix}`)
                }
            })
        })
        it('Cost unchange incase change "Instructions"', () => {
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                .find('span')
                .contains('Instructions')
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.TXT_INSTRUCTIONS)
                .type('testAC', { force: true })
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            ShowValue({
                callback: (value) => {
                    cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                        .should('contain', `$${value.TotalPriceFix}`)
                }
            })
        })
        it('Cost unchange incase change "Sources to be cited"', () => {
            cy.get(LOCATE_NEWFORM.BTN_BACK)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.BTN_INC_SOURCE)
                .dblclick({ force: true })
            cy.get(LOCATE_NEWFORM.BTN_NEXT)
                .click({ force: true })
            ShowValue({
                callback: (value) => {
                    cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                        .should('contain', `$${value.TotalPriceFix}`)
                }
            })
        })
        Deadline.forEach((item) => {
            it('Cost unchange incase change "Deadline"', () => {
                cy.get(LOCATE_NEWFORM.BTN_BACK)
                    .click({ force: true })
                cy.get(LOCATE_NEWFORM.SEL_DEADLINE)
                    .contains(`${item}`)
                    .click({ force: true })
                ShowValue({
                    callback: (value) => {
                        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                            .should('contain', `$${value.TotalPriceFix}`)
                    }
                })
            })
        })
        it('Cost unchange incase change "Pages"', () => {
            cy.get(LOCATE_NEWFORM.BTN_BACK)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.BTN_INC_PAGES)
                .dblclick({ force: true })
            ShowValue({
                callback: (value) => {
                    cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                        .should('contain', `$${value.TotalPriceFix}`)
                }
            })
            cy.get(LOCATE_NEWFORM.BTN_DEC_PAGES)
                .click({ force: true })
            ShowValue({
                callback: (value) => {
                    cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                        .should('contain', `$${value.TotalPriceFix}`)
                }
            })
        })
        it('Cost unchange incase change "Spacing"', () => {
            cy.get(LOCATE_NEWFORM.BTN_BACK)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.SEL_SPACING)
                .contains('Double')
                .click({ force: true })
            ShowValue({
                callback: (value) => {
                    cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                        .should('contain', `$${value.TotalPriceFix}`)
                }
            })
            cy.get(LOCATE_NEWFORM.SEL_SPACING)
                .contains('Single')
                .click({ force: true })
            ShowValue({
                callback: (value) => {
                    cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                        .should('contain', `$${value.TotalPriceFix}`)
                }
            })
        })
        it('Cost unchange incase change "Slide"', () => {
            cy.get(LOCATE_NEWFORM.BTN_BACK)
                .click({ force: true })
            cy.get(LOCATE_NEWFORM.BTN_INC_SLIDE)
                .dblclick({ force: true })
            ShowValue({
                callback: (value) => {
                    cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                        .should('contain', `$${value.TotalPriceFix}`)
                }
            })
            cy.get(LOCATE_NEWFORM.BTN_DEC_SLIDE)
                .click({ force: true })
            ShowValue({
                callback: (value) => {
                    cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                        .should('contain', `$${value.TotalPriceFix}`)
                }
            })
        })
        Extra.forEach((item) => {
            it(`Cost change incase change Writer to: ${item.id}`, () => {
                cy.get(LOCATE_NEWFORM.ORDER_INPUT)
                    .contains(item.id)
                    .click({ force: true })
                ShowValue({
                    callback: (value) => {
                        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                            .should('contain', `$${value.TotalPriceFix}`)
                    }
                })
            })
        })
    })
    it('Check accordion is working', () => {
        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_DETAILS)
            .find(LOCATE_NEWFORM.BTN_COL)
            .click({ force: true })
        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_SPEC)
            .find(LOCATE_NEWFORM.ORDER_PREVIEW_COL)
            .should('exist')
        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_EXTRA)
            .find(LOCATE_NEWFORM.ORDER_PREVIEW_COL)
            .should('exist')

        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_SPEC)
            .find(LOCATE_NEWFORM.BTN_COL)
            .click({ force: true })
        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_DETAILS)
            .find(LOCATE_NEWFORM.ORDER_PREVIEW_COL)
            .should('exist')
        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_EXTRA)
            .find(LOCATE_NEWFORM.ORDER_PREVIEW_COL)
            .should('exist')

        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_EXTRA)
            .find(LOCATE_NEWFORM.ORDER_PREVIEW_COL)
            .click({ force: true })
        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_DETAILS)
            .find(LOCATE_NEWFORM.BTN_COL)
            .should('exist')
        cy.get(LOCATE_NEWFORM.ORDER_PREVIEW_SPEC)
            .find(LOCATE_NEWFORM.BTN_COL)
            .should('exist')
    })
    Extra.forEach((item) => {
        it(`Check Extra value:${item.id}`, () => {
            cy.get(LOCATE_NEWFORM.ORDER_INPUT)
                .contains(item.id)
                .click({ force: true })
            ShowValue({
                callback: (value) => {
                    console.log(value.ExtraFix)
                    cy.get(LOCATE_NEWFORM.ORDER_PREVIEW)
                        .should('contain', `$${value.ExtraFix}`)
                }
            })
        })
    })
})
