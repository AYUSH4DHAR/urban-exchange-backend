
const MEN_CLOTHING_TYPES = [
    "T-shirts",
    "Shirts (casual, dress shirts)",
    "Polo shirts",
    "Sweaters",
    "Hoodies",
    "Jackets (bomber jackets, leather jackets, blazers)",
    "Coats (overcoats, trench coats)",
    "Suits (formal suits, tuxedos)",
    "Pants (jeans, chinos, dress pants)",
    "Shorts",
    "Activewear (tracksuits, gym shorts, workout tops)",
    "Swimwear (swim shorts, swim trunks)",
    "Underwear (briefs, boxers, boxer briefs)",
    "Socks (dress socks, casual socks)",
    "Sleepwear (pajamas, loungewear)",
    "Accessories (ties, bow ties, belts, suspenders, hats, scarves, gloves)",
    "Shoes (dress shoes, sneakers, boots, loafers)",
    "Formalwear (formal shirts, waistcoats, cummerbunds)"
];
const WOMEN_CLOTHING_TYPES = [
    "T-shirts",
    "Blouses",
    "Shirts (casual, dress shirts)",
    "Tunics",
    "Sweaters",
    "Cardigans",
    "Hoodies",
    "Jackets (denim jackets, leather jackets, blazers)",
    "Coats (overcoats, trench coats)",
    "Dresses",
    "Skirts",
    "Pants (jeans, leggings, dress pants)",
    "Shorts",
    "Activewear (sports bras, leggings, workout tops)",
    "Swimwear (bikinis, one-piece swimsuits, cover-ups)",
    "Lingerie (bras, panties, lingerie sets)",
    "Socks (ankle socks, knee-high socks, tights)",
    "Sleepwear (pajamas, nightgowns, loungewear)",
    "Formalwear (formal dresses, evening gowns, cocktail dresses)",
    "Suits (pantsuits, skirt suits)",
    "Jumpsuits",
    "Romper suits",
    "Maternity wear",
    "Accessories (scarves, hats, belts, handbags, jewelry)",
    "Shoes (heels, flats, boots, sandals, sneakers)"
];
const KIDS_CLOTHING_TYPES = [
    "T-shirts",
    "Shirts",
    "Blouses (for girls)",
    "Dresses",
    "Skirts (for girls)",
    "Sweaters",
    "Hoodies",
    "Jackets (denim jackets, hooded jackets)",
    "Coats (puffer coats, wool coats)",
    "Pants (jeans, leggings, cargo pants)",
    "Shorts",
    "Activewear (tracksuits, sport shorts, athletic tops)",
    "Swimwear (swim shorts, swimsuits)",
    "Pajamas",
    "Underwear (briefs, panties)",
    "Socks (ankle socks, crew socks)",
    "Tights",
    "Hats",
    "Gloves",
    "Scarves",
    "Raincoats",
    "Snowsuits",
    "Formalwear (dresses for girls, suits for boys)",
    "School uniforms",
    "Costumes (for dress-up and Halloween)",
    "Footwear (sneakers, sandals, boots, slippers)"
];
const men_fields = [
    {
        label: "size",
        fieldName: "Size",
        type: "text",
        required: true,
        multiple: false,
    },
    {
        label: "type",
        fieldName: "Type",
        type: "text",
        required: true,
        multiple: false,
        options: MEN_CLOTHING_TYPES,
    },
];
const women_fields = [
    {
        label: "size",
        fieldName: "Size",
        type: "text",
        required: true,
        multiple: false,
    },
    {
        label: "type",
        fieldName: "Type",
        type: "text",
        required: true,
        multiple: false,
        options: WOMEN_CLOTHING_TYPES,
    },
];
const kids_age_groups = [
    "0-2 years",
    "2-4 years",
    "4-6 years",
    "6-8 years",
    "8-10 years",
    "10-12 years",
];
const kids_fields = [
    {
        label: "ageGroup",
        fieldName: "AgeGroup",
        type: "text",
        required: true,
        multiple: false,
        options: kids_age_groups
    },
    {
        label: "type",
        fieldName: "Type",
        type: "text",
        required: true,
        multiple: false,
        options: KIDS_CLOTHING_TYPES,
    },
];
const CLOTHING_CATEGORIES = [
    {
        key: "Men",
        fields: men_fields,
    },
    {
        key: "Women",
        fields: women_fields,
    },
    {
        key: "Kids",
        fields: kids_fields,
    },
];
const clothing_fields = [
    {
        label: "subCategory",
        fieldName: "Category",
        type: "text",
        required: true,
        multiple: false,
        options: CLOTHING_CATEGORIES,
    },
    {
        label: "material",
        fieldName: "Material",
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
    clothing_fields
}