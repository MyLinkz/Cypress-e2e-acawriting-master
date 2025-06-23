const fs = require('fs');
const zlib = require('zlib');

class Auth {
	static URLAuth = `https://writersperhour.dev/api/signin`;

	static getAuth(email, password) {
		// Cypress handles promises natively; no need for Cypress.Promise
		cy.request({
			method: 'POST',
			url: 'https://writersperhour.dev/api/signin', // URL đúng của API
			headers: {
				'Authorization': 'Basic a2Ftb3JhOmlhbWFmcmllbmQ=',
				'Content-Type': 'application/text',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
				"Cookie": 'token=c0e3d2b5ca6192e2085fed6f71555ae8',
			},
			body: {
				email: email,
				password: password
			},
			failOnStatusCode: false // Bỏ qua lỗi nếu trả về status code không phải 2xx hoặc 3xx
		}).then((response) => {
			// Kiểm tra nếu có lỗi trong response
			if (response.status !== 200) {
				cy.log(`Request failed with status ${response.status}: ${response.body.message}`);
			} else {
				// Đọc token và lưu vào cookie
				const token = response.body.token;
				cy.setCookie('token', token); // Lưu token vào cookie
				// Đảm bảo rằng token có mặt trong response
				expect(token).to.exist;
			}
			// })
		});
	}
}

module.exports = Auth;
