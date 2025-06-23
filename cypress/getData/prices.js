const fs = require('fs');
const fetch = require('node-fetch');
const Auth = require('./auth.js');


class Price {
  static async getPrice(urgent, level) {
    const apiUrl = "https://acadashboard.dev/graphql/"; // URL API
    await Auth.getToken(); // Lấy token từ lớp Auth
    const token = localStorage.getItem('myToken')
    
    // GraphQL query
    const query = `
      {
        prices(pid: 1) {
          urgency {
            title
          }
          level {
            title
          }
          price
        }
      }
    `;

    try {
      // Gửi request qua thư viện `node-fetch`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch prices. Status: ${response.status}`);
      }

      const data = await response.json();

      // Lưu phản hồi vào file JSON
      const filePath = 'cypress/fixtures/prices.json';
      // fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      // Trích xuất danh sách giá
      const pricesArray = data.data.prices;
      let price = 0;

      // Tìm giá phù hợp
      for (const priceObject of pricesArray) {
        const urgencyTitle = priceObject.urgency.title;
        const levelTitle = priceObject.level.title;

        if (urgent === urgencyTitle && level === levelTitle) {
          price = priceObject.price;
          break;
        }
      }

      return price;
    } catch (err) {
      console.error("Error fetching prices:", err);
      throw err;
    }
  }
}

// Sử dụng async/await để gọi hàm `getPrice`
// (async () => {
//   try {
//     const price = await Price.getPrice("48 hours", "Undergrad. (yrs 3-4)"); // Gọi hàm bất đồng bộ
//     console.log('Price:', price); // In ra giá nếu thành công
//     const token = localStorage.getItem('tokenKey')
//   } catch (error) {
//     console.log('Error fetching price:', error); // In lỗi nếu có
//   }
// })();

module.exports = Price; // Sử dụng `module.exports` thay vì `export default` nếu dùng CommonJS

// export default Price; // Xuất mặc định
// console.log(Price.getPrice);
