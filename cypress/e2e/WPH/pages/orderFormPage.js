import {
	AcademicLevel,
	SubjectTypes,
	PaperTypes,
	folder,
	PaperFormat,
	PlaceholderValue
} from "../../../support/constants/defaultvalue";
import { ValidFile } from "../../../support/constants/validate";
import { capitalizeFirstLetter } from "../../../support/utlis";

export const Order1 = {
	Academic: "Undergrad. (yrs 3-4)",
	Discipline: "Select your discipline",
	PaperFormat: "APA 7",
	DocumentTypes: "Essay (any type)",
	Deadline: '48 hours',
	NEW_DOC: "",
	NEW_DIS: "",
	NoResult: "No results found",
	Spacing: 'Double',
	Single: 550,
	Double: 275,
	NumberSources: 0,
	NumberPages: 2,
	NumberSlide: 0,
	Extra: "BEST AVAILABLE",
}
export const Order2 = {
	Academic: "Undergrad. (yrs 3-4)",
	Discipline: "Select your discipline",
	PaperFormat: "APA 7",
	DocumentTypes: "Essay (any type)",
	Deadline: '48 hours',
	NEW_DOC: "",
	NEW_DIS: "",
	NoResult: "No results found",
	Spacing: 'Double',
	Single: 550,
	Double: 275,
	NumberSources: 0,
	NumberPages: 2,
	NumberSlide: 0,
	Extra: "BEST AVAILABLE",
}
export const Order3 = {
	Academic: "Undergrad. (yrs 3-4)",
	Discipline: "Select your discipline",
	PaperFormat: "APA 7",
	DocumentTypes: "Essay (any type)",
	Deadline: '48 hours',
	NEW_DOC: "",
	NEW_DIS: "",
	NoResult: "No results found",
	Spacing: 'Double',
	Single: 550,
	Double: 275,
	NumberSources: 0,
	NumberPages: 2,
	NumberSlide: 0,
	Extra: "BEST AVAILABLE",
}
export const dataOrder4 = {
	ID: 1,
	ORDER_TYPE: "writing",
	ACADEMIC_LEVEL: "Undergrad. (yrs 3-4)",
	TYPE_OF_DOCUMENT: "Analysis Paper", //Your paper
	DISCIPLINE: "Agriculture", //Your subject
	PAPER_FORMAT: "APA",
	TITLE: "Lorem Ipsum",
	INSTRUCTIONS: "Lorem Ipsum",
	FILE_UPLOAD: "",
	SOURCES: 3,
	DEADLINE: "48 hours",
	PAGES: 4,
	SPACING: "Single",
	SLIDES: 3,
	WRITER_CATEGORY: "ADVANCED (+25%)",
	ABSTRACT: "Yes",
	PREVIOUS_WRITER: "No",
	PAYMENT_METHOD: "Stripe",
	DISCOUNT: "paper15"
}
export const academicLevel = [
	"High School",
	"Undergrad. (yrs 1-2)",
	"Undergrad. (yrs 3-4)",
	"Master's",
	"Doctoral",
	"IB Level",
]
export const defaultvalue = {
	academicLevel: "Undergrad. (yrs 3-4)",
}

export const orderType = ["Writing", "Editing", "Rewriting"]
export const StepOrderTitle = {
	NewStep0: "What Are You Looking For?",
	NewStep1: "Paper Details",
	NewStep2: "Paper Details",
	NewStep3: "Attachments",
	NewStep4: "References",
	NewStep5: "Deadline",
	NewStep6: "Workflow",
	NewStep7: "Writer's Category",
	NewStep8: "Extras",
	NewStep9: "Order Summary"
}


class orderForm {
	//Order type
	RAD_WRITING = '.sc-2552336a-0 > .list > :nth-child(1)';
	RAD_EDITING = '.sc-2552336a-0 > .list > :nth-child(2)';
	RAD_REWRITING = '.left .list > :nth-child(3)';
	SEL_DOCUMENT = 'input#input-document';
	SEL_DISCIPLINE = 'input#input-discipline';
	RAD_ACADEMIC = "";
	RAD_PAPER = "";
	TXT_TITLE = '.custom-input-form > input';
	TXT_INSTRUCTIONS = '.text-editor';
	// TXT_INSTRUCTIONS= '.scrollbar';
	// TXT_INSTRUCTIONS= '.scrollbar';
	TXT_DISCOUNT = '.p-order-preview.laptop-screen [placeholder="Enter your discount code"]';
	COUNT_CHAR = '.max-length';
	PRE_ACA = "";
	BTN_LOGO = '.logo > .laptop-screen';
	BTN_CANCEL = '.header-button-back';
	BTN_CANCEL_CONF = '.cancel-button';
	SLD_CONF = '.slide-confirm-popup';
	SLD_CONT = '.slide-popup';
	BTN_CONT = '.continue-button';
	BTN_NEXT = ".sc-b87e219c-0";
	BTN_BACK = '.back';
	// BTN_X_FORM = '.slide-confirm-popup > .button-close > .sc-843c7219-0 > [width="24"] > svg > path';
	BTN_X = '.button-close';
	BTN_APPLY = '.sc-fd083aac-0 > .sc-71b5b232-0 > .preview-main > .wrap-price > .discount > .discount-price > button';
	BTN_EDIT = '[alt="edit"]';
	BTN_DELETE = '[alt="trash"]';
	BTN_ORDER_NOW = 'button.sc-b87e219c-0.ixLigl.primary__outlined';
	BACK_DROP = '.slide-backdrop';
	ORDER_INPUT = '.p-order-form';
	ORDER_PREVIEW = '.right';
	ORDER_PREVIEW_COL = '.preview-content--collapsed';
	ORDER_PREVIEW_SPEC = '.preview-specifications';
	ORDER_PREVIEW_DETAILS = '.preview-details';
	ORDER_PREVIEW_EXTRA = '.undefined';
	ORDER_PREVIEW_ITEM = '.preview-item';
	ORDER_PREVIEW_EDIT = 'preview-edit';
	ORDER_PREVIEW_PRICE = '.sc-fd083aac-0 > .sc-71b5b232-0 > .preview-main';
	BTN_CHECKOUT = '.sc-14b06fb3-0';
	ERR_MES = '.message';
	ARROW_UP_LAP = '.laptop-screen.arrow--up';
	ARROW_DOWN_LAP = '.laptop-screen.arrow--down';
	STEP_NAME = 'h1';
	BTN_UPLOAD = 'input[type="file"]';
	INVALID_FILE = '.error-wrapper';
	SPING_LOAD = '.spin';
	BTN_DOWNLOAD = '.download';
	BTN_COL = '.preview__btn-collapse';
	BTN_DEL_FILE = '.delete';
	BTN_INC = '.c-input-number1.ml-8';
	BTN_DEC = '.c-input-number1.mr-8';
	NUMB_PAGES = '.c-input-number1__input';
	BTN_CHECKBOX = 'input[type="checkbox"]';
	SEL_SPACING = '.workload-item > :nth-child(2)';
	SEL_DEADLINE = '.select-tag-list';
	RAD_EXTRA = '.writer-wrap-item';
	SEC_SAVE_VALUE = '.saved-value';
	NewStep0 = "What do you need assistance with?";
	NewStep1 = "Paper Details";
	NewStep2 = "Paper Details";
	NewStep3 = "Attachments";
	NewStep4 = "References";
	NewStep5 = "Deadline";
	NewStep6 = "Workflow";
	NewStep7 = "Writer's Category";
	NewStep8 = "Extras";
	NewStep9 = "Order Summary";

	verifyNavigate(url, title) {
		cy.location("pathname")
			.should("eq", url)
		cy.get('.order-form-container')
			.should("contain", title);
	}
	verifyStepName(title) {
		cy.get(this.STEP_NAME)
			.should("contain", title);
	}
	fillStep0(dataOrder) {
		this.clickOrderType(dataOrder.ORDER_TYPE);
	}
	fillStep1(dataOrder) {
		this.clickAcaLevel(dataOrder.ACADEMIC_LEVEL);
		this.inputPaperType(dataOrder.TYPE_OF_DOCUMENT);
		this.inputSubjectType(dataOrder.DISCIPLINE);
	}

	verifyStep1Filled(dataOrder) {
		/*cy.contains(dataOrder4.ACADEMIC_LEVEL)
			.click({ force: true });*/
		cy.get(this.SEL_DOCUMENT)
			.invoke('attr', 'placeholder')
			.should("eq", dataOrder.TYPE_OF_DOCUMENT);
		cy.get(this.SEL_DISCIPLINE)
			.invoke('attr', 'placeholder')
			.should("eq", dataOrder.DISCIPLINE);
	}

	verifyStep1NotFill() {
		cy.get(this.SEL_DOCUMENT)
			.invoke('attr', 'placeholder')
			.should("eq", PlaceholderValue.NEW_DOC);
		cy.get(this.SEL_DISCIPLINE)
			.invoke('attr', 'placeholder')
			.should("eq", PlaceholderValue.NEW_DIS);
	}

	fillStep2(dataOrder) {
		cy.get(this.TXT_TITLE)
			.type(dataOrder.TITLE);
		cy.get(this.TXT_INSTRUCTIONS)
			.type(dataOrder.INSTRUCTIONS)
			.click({ force: true })
	}
	verifyStep2Filled(dataOrder) {
		cy.get(this.TXT_TITLE)
			.should("have.value", dataOrder.TITLE);
		cy.get(this.TXT_INSTRUCTIONS)
			.contains(dataOrder.INSTRUCTIONS);
	}
	verifyOrderType(value) {
		cy.get(this.ORDER_PREVIEW)
			.should('contain', capitalizeFirstLetter(value));
	}

	verifyDefaultOrderType() {
		this.verifyOrderTypeActive('writing');
	}

	verifyOrderTypeActive(orderType) {
		cy.get('.list > div').each(($el) => {
			const text = $el.find('h2').text().trim();
			if (text === orderType) {
				// Kiểm tra phần tử được active
				cy.wrap($el).should('have.class', 'active');
			} else {
				// Kiểm tra phần tử không được active
				cy.wrap($el).should('not.have.class', 'active');
			}
		});
	}

	clickOrderBTN() {
		cy.contains('button', 'Order Now')
			.click({ force: true });
	}

	clickGoBTN() {
		cy.wait(2000);
		cy.contains('button', 'Go')
			.click({ force: true });
	}

	clickNextBTN() {
		cy.contains('button', 'Next')
			.click({ force: true });
	}
	clickSkipBTN() {
		cy.contains('button', 'Skip')
			.click({ force: true });
	}
	clickBackBTN() {
		cy.get(this.BTN_BACK)
			.click({ force: true });
	}

	clickOrderType(option) {
		// Lọc ra phần tử có h2 khớp với option
		cy.get('.list > div')
			.filter((_, el) => Cypress.$(el).find('h2').text().trim() === option)
			.should('exist') // Đảm bảo phần tử tồn tại
			.click({ force: true }); // Click vào phần tử
	}

	clickXBTNAuth() {
		cy.get(this.BTN_X).eq(0)
			.click({ force: true });
		cy.wait(1000)
	}

	clickXBTNForm() {
		cy.get(this.BTN_X).eq(1)
			.click({ force: true });
	}

	clickAcaLevel(checkValue) {
		const index = AcademicLevel.indexOf(checkValue);
		cy.get('.dot-wrapper').eq(index)
			.click({ force: true });
	}
	uploadFileSuccess(dataOrder=null) {
		if (dataOrder) {
			cy.log("dataOrder ", dataOrder)
			cy.get(this.BTN_UPLOAD)
				.selectFile( `${folder}${dataOrder}`, { force: true })
				this.verifyShowDownloadIcon();
				return;
		}
		cy.get(this.BTN_UPLOAD)
			.selectFile(ValidFile.location, { force: true })
		this.verifyShowDownloadIcon();
	}
	verifyAcaLevelActiveWithStick(checkValue) {
		const index = AcademicLevel.indexOf(checkValue);

		// Kiểm tra `dot-wrapper`
		cy.get('.dot-wrapper').each(($dot, idx) => {
			if (idx <= index) {
				cy.wrap($dot).find('.dot-inner').should('have.class', 'active');
			} else {
				cy.wrap($dot).find('.dot-inner').should('not.have.class', 'active');
			}
		});

		// Kiểm tra `stick` (số lượng stick = số lượng dot-wrapper - 1)
		cy.get('.stick').each(($stick, idx) => {
			if (idx < index) {
				cy.wrap($stick).should('have.class', 'active');
			} else {
				cy.wrap($stick).should('not.have.class', 'active');
			}
		});

		// Kiểm tra tổng số `stick` và `dot-wrapper` phù hợp
		cy.get('.dot-wrapper').should('have.length', AcademicLevel.length);
		cy.get('.stick').should('have.length', AcademicLevel.length - 1);
	}

	inputPaperType(value) {
		cy.get(this.SEL_DOCUMENT)
			.click({ force: true })
			.type(value)
			.parents('.dropdown-header')
			.next()
			.find('.wrapper-list')
			.contains('span', value)
			.click({ force: true })
	}
	setOrderForm(value) {
		cy.window().then((win) => {
			win.localStorage.setItem('new-order-form', value);
		});
	}
	inputSubjectType(value) {
		cy.get(this.SEL_DISCIPLINE)
			.click({ force: true })
			.type(value)
			.parents('.dropdown-header')
			.next()
			.find('.wrapper-list')
			.contains('span', value)
			.click({ force: true })
	}
	verifyShowDownloadIcon() {
		cy.get(this.BTN_DOWNLOAD)
			.should('exist')
			.and('be.visible')
			.and(($el) => {
				expect($el.children().length).to.be.greaterThan(0);  // phải có nội dung con bên trong
			});
	}
	verifyNotShowDownloadIcon() {
		cy.get(this.BTN_DOWNLOAD)
			.should('exist')
			.and(($el) => {
				expect($el.children().length).to.equal(0); // Không có nội dung con
			});
	}
	verifyNotShowDelIcon() {
		cy.get(this.BTN_DEL_FILE)
			.should('exist')
			.and(($el) => {
				expect($el.children().length).to.equal(0); // Không có nội dung con
			});
	}
	verifyFileError() {
		cy.get(this.INVALID_FILE, { timeout: 60000 })
			.should('be.visible')
			.contains('File upload failed')
	}
}

export default new orderForm();
