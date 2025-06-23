import {ExistEmail} from "./constants/defaultvalue";

require('cy-verify-downloads').addCustomCommand();
// require('cypress-downloadfile/lib/downloadFileCommand')
import {ROUTERS} from "../support/constants/url"
import 'cypress-file-upload';
import './commands'

Cypress.Commands.add('login', () => {
	cy.fixture('user').then(({email, password}) => {
		cy.session([email, password], () => {
			cy.visit(ROUTERS.SIGN_IN);
			cy.get('input[name="email"]').type(email);
			cy.get('input[type="password"]').type(password);
			cy.get('button[type="submit"]').click();
		})
	})
});
Cypress.Commands.add('isFileExist', (filePath) => {
	// Thực hiện kiểm tra và trả về kết quả
	// Ví dụ: Sử dụng Node.js fs để kiểm tra sự tồn tại của tệp
	return cy.task('isFileExist', filePath);
});
// Cypress.Commands.add('checkFileExists', (filePath) => {
// 	cy.task('checkFileExists', filePath).should('be.true');
// });
Cypress.Commands.add('setRandomInputValuesOnCalculator', () => {
	/* select random document type */
	cy.get('.c-select__selected').first().click({force: true});
	cy.get('.c-select__item')
		.its('length')
		.then((length) => {
			cy.get('.c-select__item')
				.eq(Math.floor(Math.random() * ((length - 1) - 0 + 1)) + 0)
				.click({force: true})
				.wait(100);
		})
	/* select random academic level */
	cy.get('.c-select__selected').eq(1).click({force: true});
	cy.get('.c-select__item')
		.its('length')
		.then((length) => {
			cy.get('.c-select__item')
				.eq(Math.floor(Math.random() * ((length - 1) - 0 + 1)) + 0)
				.click({force: true});
		})
	/* set random pages */
	cy.get('#increase-page')
		.trigger("mousedown", {force: true})
		.wait(Math.round((1000 + Math.random() * 1000) / 100) * 100)
		.trigger("mouseup", {force: true});

	/* select random deadline */
	cy.get('.deadline-selection__item')
		.its('length')
		.then(length => {
			cy.get('.deadline-selection__item')
				.eq(Math.floor(Math.random() * ((length - 1) - 0 + 1)) + 0)
				.click({force: true});
		})
})
Cypress.Commands.add("getClass", (selector) => {
	return cy.get(`[class=${selector}]`)
})
Cypress.Commands.add("getType", (selector) => {
	return cy.get(`[type=${selector}]`)
})
Cypress.Commands.add("getValue", (selector) => {
	return cy.get(`[value=${selector}]`)
})

Cypress.Commands.add("getDataType", (selector) => {
	return cy.get(`[data-type=${selector}]`)
})
Cypress.Commands.add("getName", (selector) => {
	return cy.get(`[name=${selector}]`)
})
Cypress.Commands.add("getTitle", (selector) => {
	return cy.get(`[title=${selector}]`)
})
Cypress.Commands.add("getPlaceHolder", (selector) => {
	return cy.get(`[placeholder=${selector}]`)
})
Cypress.Commands.add("verifylocate", (selector) => {
	return cy.location("pathname").should("eq", selector)
})
Cypress.Commands.add("checkCopyPaste", (CopyText, selector) => {
	cy.get(selector)
		.type(CopyText);

	// Lấy giá trị hiện tại và lưu vào biến
	cy.get(selector)
		.invoke('val')
		.then(($temp) => {
			const txt = $temp;

			// Xóa nội dung trong ô email
			cy.get(selector)
				.clear();

			// Dán giá trị vào lại ô email
			cy.get(selector)
				.type(`${txt}`);

			// Kiểm tra xem giá trị đã dán có đúng không
			cy.get(selector)
				.invoke('val')
				.should("eq", CopyText);  // Dùng 'eq' để so sánh chính xác giá trị
		});
})

Cypress.Commands.add('dragAndDropFile', (selector, filePath, fileType = '') => {
    cy.fixture(filePath, 'base64').then(fileContent => {
        const blob = Cypress.Blob.base64StringToBlob(fileContent, fileType);

        const testFile = new File([blob], filePath, { type: fileType });
        const dataTransfer = new DataTransfer();

        dataTransfer.items.add(testFile);

        cy.get(selector).trigger('drop', {
            dataTransfer,
        });
    });
});

Cypress.Commands.add('loginViaApi', (userType, options = {}) => {
	// this is an example of skipping your UI and logging in programmatically

	// setup some basic types
	// and user properties
	const types = {
		admin: {
			name:ExistEmail.email ,
			admin: true,
		},
		user: {
			name: ExistEmail.email,
			admin: false,
		},
	}

	// grab the user
	const user = types[userType]

	// create the user first in the DB
	cy.request({
		method: 'POST',
		url: 'https://kamora:iamafriend@writersperhour.dev/api/signin',
		headers: {
			authorization: 'Basic a2Ftb3JhOmlhbWFmcmllbmQ=',
			'content-type': 'application/json',
		},
		body: JSON.stringify({
			name: 'client-846-fake@kamora.vn',
			admin: true,
		}),
		failOnStatusCode: false, // Bỏ qua lỗi 500 để tiếp tục kiểm tra
	}).then((response) => {
		cy.log(response.body); // Xem nội dung trả về
	});

})
Cypress.on('window:before:load', (win) => {
	win.navigator.__defineGetter__('userAgent', () => 'Mozilla/5.0');
  });
  
const compareSnapshotCommand = require('cypress-visual-regression/dist/command');
compareSnapshotCommand();
// Cypress.Commands.add('isFileExist', (filePath) => {
// 	// Thực hiện logic kiểm tra sự tồn tại của tệp và trả về true hoặc false
// 	// Ví dụ:
// 	// const fs = require('fs-extra');
// 	// return fs.existsSync(filePath);
// 	return true; // Thay đổi theo logic thực tế của bạn
// });
