exports.bookSearchableFields = ["title", "author", "genre"];

exports.bookFilterableFields = ["searchTerm", "genre", "publicationDate"];

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
