
const smartphone_fields = [
    {
        label: "storageCapacity",
        fieldName: "Storage Capacity",
        type: "text",
        required: true,
        multiple: false,
    },
    {
        label: "color",
        fieldName: "Color",
        type: "text",
        required: true,
        multiple: false,
    },
    {
        label: "cellularTech",
        fieldName: "Cellular Technology",
        type: "text",
        required: true,
        multiple: false,
    },
];
const tab_fields = [
    ...smartphone_fields,
];
const pc_fields = [
    {
        label: "subCategory",
        fieldName: "Sub Category",
        type: "select",
        required: true,
        multiple: false,
        options: [],
    },
];
const audio_fields = [
    {
        label: "subCategory",
        fieldName: "Sub Category",
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
        key: "SmartPhones",
        fields: smartphone_fields,
    },
    {
        key: "Cameras",
        fields: camera_fields,
    },
    {
        key: "Tabs",
        fields: tab_fields,
    },
    {
        key: "PCs & Accessories",
        fields: pc_fields,
    },
    {
        key: "Audio Peripherals",
        fields: audio_fields,
    },
];
const electronics_fields = [
    {
        label: "subCategory",
        fieldName: "Category",
        type: "select",
        required: true,
        multiple: false,
        options: ELECTRONICS_CATEGORIES,
    },
    {
        label: "brand",
        fieldName: "Brand",
        type: "text",
        required: true,
        multiple: false,
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