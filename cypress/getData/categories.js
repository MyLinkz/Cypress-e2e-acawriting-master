const fs = require('fs');
const fetch = require('node-fetch');
const Auth = require('./auth.js');

class Categories {
  static async getCategory(categoryName,output) {
    const apiUrl = "https://acadashboard.dev/graphql/"; // URL API
    await Auth.getToken(); // Lấy token từ lớp Auth
    const token = localStorage.getItem('myToken');
    // GraphQL query
    const query = `
      {
        categories {
          id
          title
          description
          percent
          is_default
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
        throw new Error(`Failed to fetch categories. Status: ${response.status}`);
      }

      const data = await response.json();

      // Lưu phản hồi vào file JSON để kiểm tra sau
      const filePath = 'cypress/fixtures/Categories.json';
      // fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      // Trích xuất danh sách danh mục
      const categoryArray = data.data.categories;
      // const categoryData = categoryArray.find();
      
      let categoryData = null;

      // Lặp qua danh sách danh mục để tìm danh mục phù hợp
      for (const category of categoryArray) {
        if (category.title === categoryName) {
          categoryData = category;
          break; // Dừng vòng lặp khi tìm thấy kết quả phù hợp
        }
      }
      // let percent = categoryData[0].output;
      // console.log("percent",percent)
      if (!categoryData) {
        throw new Error(`Category "${categoryName}" not found.`);
      }
      
      const value = categoryData[output];
      return value; // Trả về đối tượng danh mục
    } catch (err) {
      console.error("Error fetching categories:", err);
      throw err;
    }
  }
}

// Gọi hàm getCategory
// (async () => {
//   try {
//     const category = await Categories.getCategory('ENL (+35%)','percent'); // Gọi hàm bất đồng bộ
//     console.log('Category Data:', category); // In ra dữ liệu danh mục nếu thành công
//   } catch (error) {
//     console.error('Error fetching category:', error); // In lỗi nếu có
//   }
// })();

module.exports = Categories;

// export default Categories; // Xuất mặc định
