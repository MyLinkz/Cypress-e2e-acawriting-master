// import { getCategoryData } from "../getData/categories";
const Categories = require('../getData/categories')
// const Pri
import { getPrice } from "../getData/prices";

// const getPrice = require('../../getData/prices.js')

import { getDiscount } from "../getData/discount";

// const getDiscount = require('../../getData/discount.js')
class Calculator {
  constructor() {
    // Khởi tạo các giá trị ban đầu
    this.getPagePrice = 0;
    this.writerPrice = 0;
    this.preWriter = 0;
    this.preWriterRound = "";
    this.extraTotalRound = "";
    this.absPrice = 0;
    this.preWriterPercent = 5;
    this.discount = 0;
    this.discountRound = "";
    this.balance = 0;
    this.singlePagePrice = 0;
    this.slidePrice = 0;
    this.slideCost = 0;
    this.writerLevelPriceRound = "";
    this.extraTotal = 0;
    this.type = "";
    this.urgent = "";
    this.acalevelNumb = "";
    this.pages = 0;
    this.slides = 0;
    this.spacing = "";
    this.youPay = 0;
    this.writerRate = 30;
    this.writerFee = 0;
    this.isAbsPrice = false;
    this.isPreWriter = false;
    this.disCode = "";
    this.grandTotal = 0;
    this.writerLvl = "";
  }

  get DiscountRound() {
    return this.discountRound;
  }

  roundToTwoDecimalPlaces(value) {
    return Math.round(value * 100) / 100;
  }

  spacingPrice() {
    if (this.spacing === "Double") {
      return 0;
    }
    if (this.spacing === "Single") {
      return this.singlePagePrice * 2;
    }
    return 0;
  }

  slidePriceCalculation() {
    this.slidePrice = (this.slides * this.singlePagePrice) / 2;
  }

  slideCostCalculation() {
    this.slideCost = this.roundToTwoDecimalPlaces(this.singlePagePrice / 2);
  }

  async pagePriceCalculation() {
    this.singlePagePrice = await getPrice(this.urgent, this.acalevelNumb); // Gọi hàm bất đồng bộ
    if (this.type === "editing") {
      this.singlePagePrice /= 2;
    }

    const numberOfPagePrice = this.singlePagePrice * this.pages;
    const total = numberOfPagePrice + this.slidePrice + this.spacingPrice();
    this.getPagePrice = this.roundToTwoDecimalPlaces(total);
  }

  async discountCalculation() {
    const percent = await getDiscount(this.disCode); // Gọi hàm bất đồng bộ
    this.discount = this.roundToTwoDecimalPlaces((percent * this.getPagePrice) / 100);
    this.discountRound = this.discount.toFixed(2);
  }


  async writerLevelPriceCalculation() {
    const percent = await Categories.getCategory(this.writerLvl, "percent"); // Gọi hàm bất đồng bộ
    this.writerPrice = this.roundToTwoDecimalPlaces((percent * this.getPagePrice) / 100);
    this.writerLevelPriceRound = this.writerPrice.toFixed(2);
  }

  abstractPriceCalculation() {
    if (this.isAbsPrice) {
      this.absPrice = 22.0;
    }
  }

  preWriterCalculation() {
    if (this.isPreWriter) {
      this.preWriter = this.roundToTwoDecimalPlaces(
        (this.preWriterPercent * this.getPagePrice) / 100
      );
      this.preWriterRound = this.preWriter.toFixed(2);
    }
  }

  extrasTotalCalculation() {
    this.extraTotal = this.roundToTwoDecimalPlaces(
      this.writerPrice + this.absPrice + this.preWriter
    );
    this.extraTotalRound = this.extraTotal.toFixed(2);
  }

  grandTotalCalculation() {
    this.grandTotal = this.roundToTwoDecimalPlaces(
      this.getPagePrice - this.discount + this.extraTotal - this.balance
    );
    console.log("grandTotal  ",this.grandTotal)
    this.youPay = this.grandTotal <= 0 ? 0.0 : this.grandTotal;
  }

  writerFeeCalculation() {
    this.writerFee = this.roundToTwoDecimalPlaces((this.youPay * this.writerRate) / 100);
  }

  async setValuesFromOrderForm(orderForm) {
    this.type = orderForm.orderType;
    this.urgent = orderForm.urgentTXT;
    this.acalevelNumb = orderForm.acalevelTXT;
    this.pages = orderForm.pages;
    this.slides = orderForm.slides;
    this.spacing = orderForm.spacing;
    this.isAbsPrice = orderForm.isAbsPrice;
    this.isPreWriter = orderForm.isPreWriter;
    this.disCode = orderForm.disCode;
    this.writerLvl = orderForm.writerLvlTxt;

    // Gọi các hàm bất đồng bộ
    await this.pagePriceCalculation(); // Đợi hàm tính giá trang
    this.slidePriceCalculation(); // Đợi tính toán slide
    this.slideCostCalculation(); // Đợi tính toán chi phí slide
    await this.discountCalculation(); // Đợi tính toán giảm giá
    this.writerLevelPriceCalculation(); // Đợi tính toán mức giá writer
    this.abstractPriceCalculation(); // Không cần await
    this.preWriterCalculation(); // Không cần await
    this.extrasTotalCalculation(); // Không cần await
    this.writerFeeCalculation(); // Không cần await
    this.grandTotalCalculation();
  }
}

// module.exports = Calculator;
export default Calculator;
