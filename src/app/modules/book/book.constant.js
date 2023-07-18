exports.bookSearchableFields = ["title", "author", "genre"];

exports.bookFilterableFields = ["searchTerm", "genre", "publishedDate"];

exports.bookPopulate = [
  "userId",
  {
    path: "reviews",
    populate: [
      {
        path: "reviewerId",
      },
    ],
  },
];
