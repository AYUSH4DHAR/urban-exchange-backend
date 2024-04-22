
const bike_types = [
    "Motor Bike",
    "Scooter",
    "Bicycle",
];
const bikes_fields = [
    {
        label: "type",
        fieldName: "Type",
        type: "select",
        required: true,
        multiple: false,
        options: bike_types,
    },
];
const cars_fields = [
    {
        label: "fuelType",
        fieldName: "Fuel Type",
        type: "text",
        required: true,
        multiple: false,
    },
    {
        label: "transmission",
        fieldName: "Transmission",
        type: "text",
        required: true,
        multiple: false,
        options: ['Manual', 'Automatic']
    },
];
const VEHICLES_CATEGORIES = [
    {
        category: "Cars",
        fields: cars_fields,
    },
    {
        category: "Bikes",
        fields: bikes_fields,
    },
];
const vehicles_field = [
    {
        label: "subCategory",
        fieldName: "Sub Category (Vehicles)",
        type: "select",
        required: true,
        multiple: false,
        options: VEHICLES_CATEGORIES.map(k => k.category),
        metadata: VEHICLES_CATEGORIES,
    },
    {
        label: "kmDriven",
        fieldName: "KM Driven",
        type: "text",
        required: true,
        multiple: false,
    },
    {
        label: "year",
        fieldName: "Year",
        type: "text",
        required: true,
        multiple: false,
    },


];
module.exports = {
    vehicles_field
}