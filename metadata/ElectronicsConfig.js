
const COLORS = [
    "Black",
    "White",
    "Silver",
    "Gold",
    "Rose Gold",
    "Space Gray",
    "Midnight Green",
    "Blue",
    "Red",
    "Purple"
];
const CELLULAR_TECHNOLOGY = [
    "4G (LTE)",
    "5G (NR)"
];
const STORAGE_CAPACITY = [
    "128GB",
    "256GB",
    "512GB",
    "1TB"
];
const TOP_BRANDS = [
    "Apple",
    "Samsung",
    "Sony",
    "LG",
    "Panasonic",
    "Philips",
    "Microsoft",
    "HP",
    "Dell",
    "Lenovo",
    "Huawei",
    "Xiaomi",
    "Canon",
    "Nikon",
    "Bose",
    "Asus",
    "Acer",
    "Toshiba",
    "Nintendo",
    "GoPro",
    "Fitbit",
    "Garmin",
    "JBL",
    "Harman Kardon",
    "Beats by Dre",
    "Razer",
    "Sennheiser",
    "Bose",
    "Vizio",
    "Sharp",
    "Hisense",
    "TCL",
    "Western Digital",
    "Seagate",
    "SanDisk",
    "Corsair",
    "Roku",
    "Netgear",
    "Linksys",
    "Ubiquiti Networks",
    "Fujifilm",
    "Pioneer",
    "Yamaha",
    "Marantz",
    "Onkyo",
    "Denon",
    "Bang & Olufsen",
    "Klipsch",
    "Sonos",
    "Polaroid"
];


const smartphone_fields = [
    {
        label: "storageCapacity",
        fieldName: "Storage Capacity",
        type: "select",
        required: true,
        multiple: false,
        options: STORAGE_CAPACITY
    },
    {
        label: "color",
        fieldName: "Color",
        type: "select",
        required: true,
        multiple: false,
        options: COLORS,
    },
    {
        label: "cellularTech",
        fieldName: "Cellular Technology",
        type: "select",
        required: true,
        multiple: false,
        options: CELLULAR_TECHNOLOGY,
    },
];
const tab_fields = [
    ...smartphone_fields,
];
const pc_fields = [
    {
        label: "subCategory",
        fieldName: "Sub Category (PC)",
        type: "select",
        required: true,
        multiple: false,
        options: [],
    },
];
const audio_fields = [
    {
        label: "subCategory",
        fieldName: "Sub Category (Audio)",
        type: "select",
        required: true,
        multiple: false,
        options: []
    },
];

const camera_fields = [
    {
        label: "formFactor",
        fieldName: "Form Factor",
        type: "text",
        required: true,
        multiple: false,
    },
    {
        label: "maxRes",
        fieldName: "Max Resolution",
        type: "text",
        required: true,
        multiple: false,
    },
];
const ELECTRONICS_CATEGORIES = [
    {
        category: "SmartPhones",
        fields: smartphone_fields,
    },
    {
        category: "Cameras",
        fields: camera_fields,
    },
    {
        category: "Tabs",
        fields: tab_fields,
    },
    {
        category: "PCs & Accessories",
        fields: pc_fields,
    },
    {
        category: "Audio Peripherals",
        fields: audio_fields,
    },
];
const electronics_fields = [
    {
        label: "subCategory",
        fieldName: "Sub Category (Electronics)",
        type: "select",
        required: true,
        multiple: false,
        options: ELECTRONICS_CATEGORIES.map(k => k.category),
        metadata: ELECTRONICS_CATEGORIES,
    },
    {
        label: "brand",
        fieldName: "Brand",
        type: "autocomplete",
        required: true,
        multiple: false,
        options: TOP_BRANDS,
    },
    {
        label: "modelName",
        fieldName: "Model Name",
        type: "text",
        required: true,
        multiple: false,
    },
    {
        label: "modelYear",
        fieldName: "Model Year",
        type: "text",
        required: true,
        multiple: false,
    },
    {
        label: "timeUsed",
        fieldName: "Time Used",
        type: "text",
        required: true,
        multiple: false,
    },
    {
        label: "condition",
        fieldName: "Condition",
        type: "text",
        required: true,
        multiple: false,
    },
];
module.exports = {
    electronics_fields
}