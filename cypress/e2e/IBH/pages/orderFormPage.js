import {
	AcademicLevel,
	SubjectTypes,
	folder,
	PaperTypes,
	ErrorMessages,
} from "../../../support/constants/defaultvalue";
import { ValidFile } from "../../../support/constants/validate";

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
export const PlaceholderValue = {
	PAPER: "Type or search your paper",
	SUBJECT: "Type or search your subject",
	TITLE: "Write your paper title",
	INSTRUCTIONS: "Please provide the essential information that your writer will need to begin working on your paper. You can also attach additional materials such as an outline, grading rubric, or any other documents to provide more context and guidance. This will help ensure that your paper is tailored to your specific requirements and expectations",
	UPLOAD_FILE: "Drag and drop files, or choose files"
}
export const academicLevel = [
	"High School",
	"Undergrad. (yrs 1-2)",
	"Undergrad. (yrs 3-4)",
	"Master's",
	"Doctoral",
	"IB Level",
]

export const CITATION = {
	APA: {
		title: "APA",
		description: "Telemedicine offers huge benefits in improving access to and enhancing the efficiency of healthcare, especially for people residing in rural areas (Monaghesh & Hajzadeh, 2020)."
	},
	Chicago: {
		title: "Chicago",
		description: 'Monaghesh, Elham, and Alireza Hajzadeh. 2020. "The role of telehealth during COVID-19 outbreak: a systematic review based on current evidence." BMC Public Health 20 (1): 1-9, 2.'
	},
	Harvard: {
		title: "Harvard",
		description: 'Telemedicine offers huge benefits in improving access to and enhancing the efficiency of healthcare, especially for people residing in rural areas (Monaghesh & Hajzadeh, 2020, p. 2).'
	},
	IEEE: {
		title: "IEEE",
		description: 'Telemedicine offers huge benefits in improving access to and enhancing the efficiency of healthcare, especially for people residing in rural areas [1, p. 2].'
	},
	MLA: {
		title: "MLA",
		description: 'Telemedicine offers huge benefits in improving access to and enhancing the efficiency of healthcare, especially for people residing in rural areas (Monaghesh and Hajzadeh 2).'
	},
	Turabian: {
		title: "Turabian",
		description: 'Telemedicine offers huge benefits in improving access to and enhancing the efficiency of healthcare, especially for people residing in rural areas (Monaghesh and Hajzadeh 2020, 2).'
	},
}

export const defaultValue = {
	academicLevel: "Undergrad. (yrs 3-4)",
	paper: "Essay (any type)",
	subject: PlaceholderValue.SUBJECT,
	citation: CITATION.APA.title,
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
	SEL_PAPER = '.document-selection:eq(0)';
	SEL_SUBJECT = '.document-selection:eq(1)';
	SEL_CITATION = '.dropdown-citation'
	RAD_ACADEMIC = "";
	RAD_PAPER = "";
	TXT_TITLE = `[placeholder="${PlaceholderValue.TITLE}"]`;
	TXT_INSTRUCTIONS = '.text-editor > .tiptap.ProseMirror p';
	// TXT_INSTRUCTIONS= '.scrollbar';
	TXT_DISCOUNT = '.p-order-preview.laptop-screen [placeholder="Enter your discount code"]';
	COUNT_CHAR = '.max-length';
	PRE_ACA = "";
	BTN_LOGO = '[alt="Logo"]';
	BTN_CANCEL = '.content > button';
	BTN_CANCEL_CONF = '.cancel-button';
	SLD_CONF = '.slide-popup';
	SLD_CONT = '.slide-popup';
	BTN_CONT = '.continue-button';
	BTN_NEXT = '.button-list > .sc-6fe1cc8-0';
	BTN_BACK = '.back';
	// BTN_X_FORM = '.slide-confirm-popup > .button-close > .sc-843c7219-0 > [width="24"] > svg > path';
	BTN_X = '.button-close';
	BTN_APPLY = '.sc-fd083aac-0 > .sc-71b5b232-0 > .preview-main > .wrap-price > .discount > .discount-price > button';
	BTN_EDIT = '[alt="edit"]';
	BTN_DELETE = '[alt="trash"]';
	BTN_ORDER_NOW = '.button-show';
	BACK_DROP = '.slide-backdrop';
	ORDER_INPUT = '.p-order-form';
	ORDER_PREVIEW = '.sidebar';
	// ORDER_PREVIEW_COL = '.preview-content--collapsed';
	ORDER_PREVIEW_SPEC = '.preview-specifications';
	ORDER_PREVIEW_DETAILS = `${this.ORDER_PREVIEW} > .sc-9e21699a-0 > .preview-list > .item:eq(0)`;
	ORDER_PREVIEW_EXTRA = '.undefined';
	ORDER_PREVIEW_ITEM = '.preview-item';
	ORDER_PREVIEW_EDIT = 'preview-edit';
	ORDER_PREVIEW_PRICE = '.sc-fd083aac-0 > .sc-71b5b232-0 > .preview-main';
	BTN_CHECKOUT = '.sc-14b06fb3-0';
	ERR_MES = 'Please make sure that all fields are filled!';
	ARROW_UP_LAP = '.laptop-screen.arrow--up';
	ARROW_DOWN_LAP = '.laptop-screen.arrow--down';
	STEP_NAME = 'h1';
	BTN_UPLOAD = 'input[type="file"]';
	INVALID_FILE = '.error-wrapper';
	SPING_LOAD = '.spin';
	BTN_DOWNLOAD = '.download';
	BTN_COL = '.preview__btn-collapse';
	DEL_FILE = '.delete';
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

	verifyStep(title) {
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

	updateStep1(dataOrder) {
		this.clickAcaLevel(dataOrder.ACADEMIC_LEVEL);
		cy.get(this.SEL_PAPER).clear();
		this.inputPaperType(dataOrder.TYPE_OF_DOCUMENT);
		cy.get(this.SEL_SUBJECT).clear();
		this.inputSubjectType(dataOrder.DISCIPLINE);
	}

	verifyStep1Filled(dataOrder) {
		/*cy.contains(dataOrder4.ACADEMIC_LEVEL)
			.click({ force: true });*/
		cy.get(this.SEL_PAPER)
			.invoke('attr', 'placeholder')
			.should("contain", dataOrder.TYPE_OF_DOCUMENT);
		cy.get(this.SEL_SUBJECT)
			.invoke('attr', 'placeholder')
			.should("contain", dataOrder.DISCIPLINE);
	}

	verifyStep1NotFill() {
		cy.get(this.SEL_PAPER)
			.invoke('attr', 'placeholder')
			.should("eq", defaultValue.paper);
		cy.get(this.SEL_SUBJECT)
			.invoke('attr', 'placeholder')
			.should("eq", PlaceholderValue.SUBJECT);
	}

	fillStep2(dataOrder) {
		cy.get(this.TXT_TITLE)
			.type(dataOrder.TITLE);
		cy.get(this.TXT_INSTRUCTIONS)
			.type(dataOrder.INSTRUCTIONS);
	}

	verifyStep2Filled(dataOrder) {
		cy.get(this.TXT_TITLE)
			.should('have.value', dataOrder.TITLE);
		cy.get(this.TXT_INSTRUCTIONS)
			.contains(dataOrder.INSTRUCTIONS)
			.should('be.visible');
	}

	verifyStep2NotFill() {
		cy.get(this.TXT_TITLE)
			.should('have.value', '');
		cy.get(this.TXT_INSTRUCTIONS)// Tìm thẻ <p> chứa data-placeholder
			.should('have.attr', 'data-placeholder', PlaceholderValue.INSTRUCTIONS);
	}

	updateStep2(dataOrder) {
		cy.get(this.TXT_TITLE).clear();
		this.inputTitleTB(dataOrder.TITLE);
		cy.get(this.TXT_INSTRUCTIONS).clear();
		this.inputInstructionTB(dataOrder.INSTRUCTIONS);
	}

	fillStep3(dataOrder) {
		if (dataOrder.FILE_UPLOAD === null) {
			return;
		}
		this.uploadFileSuccess(dataOrder.FILE_UPLOAD)
	}

	verifyStep3Filled(fileName) {
		cy.contains(fileName).should('exist'); // Kiểm tra file đã upload
		this.verifyDownloadIcon()
	}

	fillStep4(dataOrder) {
		this.inputCitationTB(dataOrder.CITATION);
	};

	fillStep5(dataOrder) {
		this.inputDiscount(dataOrder.DISCOUNT);
		cy.wait(2000);
	}

	verifyOrderType(value) {
		cy.get(this.ORDER_PREVIEW)
			.should('contain', value);
	}

	verifyDefaultOrderType() {
		this.verifyOrderTypeActive('writing');
	}

	verifyOrderTypeActive(orderType) {
		cy.get('.list > div').each(($el) => {
			const text = $el.find('h2').text().trim();
			if (text === orderType.toLowerCase()) {
				// Kiểm tra phần tử được active
				cy.wrap($el).should('have.class', 'active');
			} else {
				// Kiểm tra phần tử không được active
				cy.wrap($el).should('not.have.class', 'active');
			}
		});
	}

	verifyAlphabet(selector) {
		cy.get(selector)
			.type(' ')
			.parents('.dropdown-header')
			.next()
			.find('.item') // Tìm tất cả các thẻ option trong thẻ select
			.then((options) => {
				const array = []; // Khởi tạo mảng để lưu các giá trị text
				// Lặp qua từng thẻ option và thêm giá trị text vào mảng
				options.each((index, option) => {
					const text = Cypress.$(option).text(); // Lấy giá trị text của option
					array.push(text)
				})
				const sortedValues = [...array].sort((a, b) => a.localeCompare(b))
				expect(array).to.deep.equal(sortedValues)
				// In mảng array vào console
			});
	}

	searchLive(selector, keyword) {
		cy.get(selector)
			.type(keyword, { force: true })
			.parents('.dropdown-header')
			.click({ force: true })
			.next()
			.find('.item')
			.should('be.visible')
	}

	clickOrderNowBTN() {
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
		console.log("option: ", option);
		cy.get('.list > div')
			.filter((_, el) => Cypress.$(el).find('h2').text().trim() === option.toLowerCase())
			.should('exist') // Đảm bảo phần tử tồn tại
			.click({ force: true }); // Click vào phần tử
	}

	clickXBTNAuth() {
		cy.get(this.BTN_X).eq(0)
			.click({ force: true });
		cy.wait(1000)
	}

	clickXBTNForm() {
		cy.get(this.BTN_X).eq(0)
			.click({ force: true });
	}

	clickAcaLevel(checkValue) {
		const index = AcademicLevel.indexOf(checkValue);
		cy.get('.dot-wrapper').eq(index)
			.click({ force: true });
	}

	clickAcaLevelOld(checkValue) {
		cy.contains('button', checkValue)
			.click({ force: true });
	}

	clickPaperFormatOld(checkValue) {
		cy.contains('button', checkValue)
			.click({ force: true });
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

	verifyStepName(title) {
		cy.get(this.STEP_NAME)
			.should("contain", title)
			.should('be.visible')
	}

	inputPaperType(value) {
		cy.get(this.SEL_PAPER)
			.click({ force: true })
			.type(value)
			.parents('.dropdown-header')
			.next()
			.find('.wrapper-list')
			.contains('span', value)
			.click({ force: true })
	}

	verifyPaperType(value) {
		cy.get(this.SEL_PAPER)
			.invoke('val')  // Lấy giá trị của input
			.then((text) => {
				expect(text.trim()).to.equal(value.trim());
			});

	}

	verifySubjectType(value) {
		cy.get(this.SEL_SUBJECT)
			.should('have.value', value);
	}

	setOrderForm(value) {
		cy.window().then((win) => {
			win.localStorage.setItem('new-order-form', value);
		});
	}

	inputSubjectType(value) {
		cy.get(this.SEL_SUBJECT)
			.click({ force: true })
			.type(value)
			.parents('.dropdown-header')
			.next()
			.find('.wrapper-list')
			.contains('span', value)
			.click({ force: true })
	}

	inputTitleTB(valueTitle) {
		cy.get(this.TXT_TITLE)
			.type(valueTitle);
	}

	inputInstructionTB(valueInstruction) {
		cy.get(this.TXT_INSTRUCTIONS)
			.type(valueInstruction);
	}

	verifyDownloadIcon() {
		cy.wait(10000)
		cy.get(this.BTN_DOWNLOAD)
			.should('exist')
			.and('be.visible')
			.and(($el) => {
				expect($el.children().length).to.be.greaterThan(0);  // phải có nội dung con bên trong
			});
	}

	inputCitationTB(valueCitation) {
		cy.get(this.SEL_CITATION)
			.click({ force: true })
		cy.get(this.SEL_CITATION)
			.find('.wrapper-list')
			.contains(valueCitation)
			.click({ force: true })
	}

	clickSourceNum(checkValue) {
		if (checkValue === "Writer\'s choice") {
			cy.get(this.BTN_CHECKBOX)
				.check({ force: true })
		} else {
			for (let i = 0; i < checkValue; i++) {
				cy.get(this.BTN_INC).eq(0)
					.click({ force: true })
			}
		}
	}

	clickPageNum(checkValue) {
		switch (checkValue) {
			case 2:
				return;
			case 1:
				cy.get(this.BTN_DEC).eq(1).click({ force: true });
				return;
			case 0:
				cy.get(this.BTN_DEC).eq(1).dblclick({ force: true });
				return;
			default:
				if (checkValue > 2) {
					for (let i = 2; i < checkValue; i++) {
						cy.get(this.BTN_INC).eq(1).click({ force: true });
					}
				} else {
					console.log("Input is invalid");
				}
		}
	}

	clickPPNum(checkValue) {
		for (let i = 2; i <= checkValue; i++) {
			cy.get(this.BTN_INC).eq(2)
				.click({ force: true })
		}
	}

	inputDiscount(checkValue) {
		if (checkValue == null || checkValue === "") {
		} else {
			cy.get('.discount-title')
				.click({ force: true });
			cy.get('.input-wrap ')
				.type(checkValue);
			cy.get('.button-discount')
				.click({ force: true });
		}
	}

	uploadFileSuccess(dataOrder = null) {
		if (dataOrder) {
			cy.log("dataOrder ", dataOrder)
			cy.get(this.BTN_UPLOAD)
				.selectFile(`${folder}${dataOrder}`, { force: true })
			this.verifyShowDownloadIcon();
			return;
		}
		cy.get(this.BTN_UPLOAD)
			.selectFile(ValidFile.location, { force: true })
		this.verifyShowDownloadIcon();
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
				expect($el.children().length).to.eq(0); // phải có nội dung con bên trong
			});
	}

	verifyNotShowDelIcon() {
		cy.get(this.DEL_FILE)
			.should('exist')
			.and(($el) => {
				expect($el.children().length).to.eq(0); // phải có nội dung con bên trong
			});
	}

	findOption(selector, value) {
		return cy.get(selector)
			.click({ force: true })
			.type(value)
			.parents('.dropdown-header')
			.next()
			.find('.wrapper-list .item');
	}

	verifyUppercase(option, type, keyword) {
		const searchResults = option.map((i, el) => Cypress.$(el).text()).get();
		let resultData;
		if (type === "paper") {
			resultData = PaperTypes
				.map(item => item.title)
				.filter(title => title.toLowerCase().includes(keyword.toLowerCase()));
		} else if (type === "subject") {
			resultData = SubjectTypes
				.map(item => item.title)
				.filter(title => title.toLowerCase().includes(keyword.toLowerCase()));
		}

		// Kiểm tra kết quả tìm kiếm
		searchResults.forEach(result => {
			expect(result.toLowerCase()).to.include(keyword.toLowerCase());
		});

		// Kiểm tra xem dữ liệu hiển thị có khớp với kết quả mong đợi không
		expect(searchResults).to.deep.equal(resultData);
	}

	verifyLowercase(option, type, keyword) {
		const searchResults = option.map((i, el) => Cypress.$(el).text()).get();
		let resultData;
		if (type === "paper") {
			resultData = PaperTypes
				.map(item => item.title)
				.filter(title => title.toLowerCase().includes(keyword.toLowerCase()));
		} else if (type === "subject") {
			resultData = SubjectTypes
				.map(item => item.title)
				.filter(title => title.toLowerCase().includes(keyword.toLowerCase()));
		}
		// Kiểm tra kết quả tìm kiếm
		searchResults.forEach(result => {
			expect(result.toLowerCase()).to.include(keyword.toLowerCase());
		});

		// Kiểm tra xem dữ liệu hiển thị có khớp với kết quả mong đợi không
		expect(searchResults).to.deep.equal(resultData);
	}

	getDetailCOL() {
		return cy.get(this.ORDER_PREVIEW)
			.contains('Details')
			// .parent()
			.parent();
	}

	verifyCOLOpen(selector) {
		cy.get(selector)
			.should('have.class', 'active')
	}

	verifyCOLNotOpen(selector) {
		cy.get(selector)
			.should('not.have.class', 'active')
	}

	clickDetailCOLOpen() {
		this.getDetailCOL().then($el => {
			if ($el.hasClass('active')) {
				return; // Nếu đã có class 'active' thì không làm gì cả
			}
			console.log("vao` day")
			cy.wrap($el).then(($wrappedEl) => {
				cy.get($wrappedEl).click({ force: true });
			});
		});
	}

	verifyData($options, value) {
		const array = []; // Lưu danh sách giá trị lấy được từ dropdown

		// Lặp qua từng option và lấy text
		cy.wrap($options).each(($option) => {
			cy.wrap($option)
				.invoke('text')
				.then((text) => {
					array.push(text.trim()); // Loại bỏ khoảng trắng thừa
				});
		}).then(() => { // Đảm bảo Cypress chờ `each()` hoàn tất trước khi kiểm tra
			const typeMap = {
				paper: PaperTypes.map((item) => item.title.trimEnd()),
				subject: SubjectTypes.map((item) => item.title.trimEnd()),
			};

			let titlesArray = typeMap[value] || [];
			titlesArray = titlesArray.filter((title) => title.includes(value)); // Lọc theo từ khóa nhập vào

			const filteredTitlesArray = titlesArray.filter((title) => title !== PlaceholderValue.Discipline);

			console.log("array: ", array);
			console.log("filteredTitlesArray: ", filteredTitlesArray);

			expect(array).to.deep.equal(filteredTitlesArray);
		});
	}

	findEditBTN(value) {
		return cy.get(this.ORDER_PREVIEW)
			.find('.name')
			.contains(value)
			.parent()
			.parent() // Vì .pen nằm trong một div cha khác
			.find('.pen')
			.children()
	}

	//step 1
	clickPaperEditBTN() {
		this.findEditBTN("Paper")
			.click({ force: true });
	}

	//step2
	clickTitleEditBTN() {
		this.findEditBTN("Title")
			.click({ force: true });
	}

	clickInstructionEditBTN() {
		this.findEditBTN("Instructions")
			.click({ force: true });
	}

	//step3
	clickFileEditBTN() {
		this.findEditBTN("Attachments")
			.click({ force: true });
	}

	clickOrderTypeEditBTN(orderType) {
		cy.get(this.ORDER_PREVIEW)
			.find('.type')
			.contains(orderType)
			.parent()
			.parent() // Vì .pen nằm trong một div cha khác
			.find('.pen')
			.children()
			.click({ force: true });
	}

	verifyFileError() {
		cy.get(this.INVALID_FILE, { timeout: 60000 })
			.contains(ErrorMessages.FileUploadFailed)
	}

	//step4
	inputCitationSEL(value) {
		cy.get(this.SEL_CITATION)
			.click({ force: true })
			.type(value)
			.find('.wrapper-list .item')
			.click({ force: true })
	}

	updateOrderType(currentOrderType, newOrderType, currentStep) {
		this.clickOrderTypeEditBTN(currentOrderType);
		this.clickOrderType(newOrderType);
		for (let i = 0; i < currentStep; i++) {
			if (i === 0) {
				this.clickGoBTN();
				continue; // Chuyển sang vòng lặp tiếp theo
			}
			cy.get(this.STEP_NAME).then(($stepElements) => {
				const foundStep = $stepElements.filter((_, el) => el.innerText.includes(StepOrderTitle.NewStep3));
				if (foundStep.length) {
					cy.get(this.ORDER_PREVIEW).then(($previewElements) => {
						const foundPreview = $previewElements.filter((_, el) => el.innerText.includes("Writing"));
						if (foundPreview.length) {
							this.clickSkipBTN();
							// Dừng vòng lặp
						} else {
							this.clickNextBTN();
						}
					});
				} else {
					this.clickNextBTN();
				}
			});
		}
	}

	getOtherOrderType(currentType) {
		return orderType.find(type => type !== currentType);
	}
}

export default new orderForm();
