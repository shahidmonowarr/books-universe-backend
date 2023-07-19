exports.userFilterableFields = ["firstName", "lastName", "email"];

exports.userSearchableFields = ["firstName", "lastName", "email"];

exports.userPopulate = [
  "wishlist",
  {
    path: "readlist",
    populate: [
      {
        path: "bookId",
      },
    ],
  },
];
