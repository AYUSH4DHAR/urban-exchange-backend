const { electronics_fields } = require('./ElectronicsConfig');
const { books_fields } = require('./BooksConfig');
const { clothing_fields } = require('./ClothingConfig');
const { vehicles_field } = require('./VehiclesConfig');
const getProductCategoryFields = (category) => {
    let res_fields = [];
    switch (category) {
        case "Electronics": res_fields = electronics_fields;
            break;
        case "Books": res_fields = books_fields;
            break;
        case "Clothing": res_fields = clothing_fields;
            break;
        case "Vehicles": res_fields = vehicles_field
            break;
    }
    return res_fields;
}
module.exports = {
    getProductCategoryFields
}