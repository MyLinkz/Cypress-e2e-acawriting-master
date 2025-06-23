// import { log } from 'console';
import * as fs from 'fs';
// const fs = require('fs');
const fetch = require('node-fetch');

// import fetch from 'node-fetch';

class Auth {
  static async getToken() {
    const apiUrl = "https://acadashboard.dev/graphql/"; // URL API
    const username = "support@kamora.vn"; // Email người dùng
    const password = "iamafriend";

    // GraphQL mutation query
    const mutation = `
      mutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
        }
      }
    `;

    // Tạo payload request
    const requestPayload = {
      query: mutation,
      variables: {
        email: username,
        password: password,
      },
    };

    try {
      // Gửi request GraphQL qua `node-fetch`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch token. Status: ${response.status}`);
      }

      // Lấy dữ liệu từ phản hồi
      const responseData = await response.json();

      // Trích xuất token từ phản hồi
      const tokenValue = responseData.data.login.token;

      // Ghi phản hồi vào file JSON để kiểm tra sau
      localStorage.setItem('myToken', tokenValue)

      // const tokenValueFromStorage = localStorage.getItem('myToken')
      // console.log('tokenValueFromStorage', tokenValueFromStorage)
      return tokenValue;
    } catch (err) {
      console.error("Error fetching token:", err);
      throw err;
    }
  }
}

// (async () => {
//   try {
//     const token = await Auth.getToken(); // Gọi hàm bất đồng bộ
//     console.log(('Token:', token)); // In ra token nếu thành công
//   } catch (error) {
//     console.log('Error fetching token:', error); // In lỗi nếu có
//   }
// })();
// export default Auth; // Xuất mặc định
module.exports = Auth; // Xuất mặc định trong CommonJS
