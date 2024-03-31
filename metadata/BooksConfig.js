const BOOK_GENRES = [
    "Action and Adventure",
    "Art",
    "Biography",
    "Children's",
    "Comics",
    "Cookbooks",
    "Crime",
    "Drama",
    "Fantasy",
    "Historical Fiction",
    "Horror",
    "Mystery",
    "Poetry",
    "Romance",
    "Science Fiction",
    "Self-help",
    "Suspense and Thriller",
    "Travel",
    "Young Adult"
];
const books_fields = [
    {
        label: "Title",
        fieldName: "Title",
        type: "text",
        required: true,
        multiple: false,
    },
    {
        label: "genre",
        fieldName: "Genre",
        type: "select",
        required: true,
        multiple: false,
        options: BOOK_GENRES,
    },
];
module.exports = {
    books_fields
}