import fs from 'fs';
import Auth from './auth.js'; // Import lớp Auth để lấy token
import fetch from 'node-fetch';

class Discounts {
  static async getDiscount(discountCode) {
    const apiUrl = "https://acadashboard.dev/graphql/"; // URL API
    await Auth.getToken(); // Lấy token từ lớp Auth
    const token = localStorage.getItem('myToken')
    
    // GraphQL query
    const query = `
      {
        discounts(pid: 1, first: 100, page: 1) {
          data {
            id
            name
            type
            value
            expired_at
          }
        }
      }
    `;

    try {
      // Gửi request GraphQL qua `node-fetch`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch discounts. Status: ${response.status}`);
      }

      const data = await response.json();

      // Lưu phản hồi vào file JSON để kiểm tra sau
      const filePath = 'cypress/fixtures/Discounts.json';
      // fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      // Trích xuất danh sách mã giảm giá
      const discountArray = data.data.discounts.data;
      let discountValue = 0;

      // Lặp qua danh sách mã giảm giá để tìm mã phù hợp
      for (const discountObject of discountArray) {
        const nameCode = discountObject.name;

        if (nameCode === discountCode) {
          discountValue = discountObject.value;
          break; // Dừng vòng lặp khi tìm thấy kết quả phù hợp
        }
      }

      if (discountValue === 0) {
        throw new Error(`Discount code "${discountCode}" not found.`);
      }

      return discountValue;
    } catch (err) {
      console.error("Error fetching discounts:", err);
      throw err;
    }
  }
}

// // Gọi hàm getDiscount
// (async () => {
//   try {
//     const discount = await Discounts.getDiscount('paper15'); // Gọi hàm bất đồng bộ
//     console.log('Discount:', discount); // In ra giá trị giảm giá nếu thành công
//   } catch (error) {
//     console.error('Error fetching discount:', error); // In lỗi nếu có
//   }
// })();

module.exports = Discounts; 

// export default Discounts; // Xuất mặc định
