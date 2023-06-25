const Products = require("./models/productsschema");
const productData = require("./Data/productsdata");

const DefaultData = async () => {
  try {
    await Products.deleteMany({});
    const storeData = await Products.insertMany(productData);
    // console.log(storeData);
  } catch (error) {
    console.log("error " + error.message);
  }
};
module.exports = DefaultData();
