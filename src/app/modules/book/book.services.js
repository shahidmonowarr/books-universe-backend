const { ApiError } = require("../../../errors/apiError");
const { calculatePagination } = require("../../../helpers/paginationHelpers");
const { bookSearchableFields, bookPopulate } = require("./book.constant");
const Book = require("./book.model");

exports.createBookService = async (payload, id) => {
  payload.userId = id;

  const isExist = await Book.findOne({ title: payload.title });
  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Book already exist");
  }

  const book = await Book.create(payload);
  if (!book) {
    throw new Error("Book create failed");
  }

  const result = await Book.findById(book._id).populate("userId");

  return result;
};

exports.getAllBooksService = async (paginationOptions, filters) => {
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;

  let andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: bookSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: {
          $regex: value,
          $options: "i",
        },
      })),
    });
  }

  let sortConditions = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Book.find(whereConditions)
    .populate("")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

exports.getSingleBookService = async (id) => {
  const result = await Book.findById(id).populate(bookPopulate);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Book not found");
  }
  return result;
};

exports.updateBookService = async (userId, id, payload) => {
  const book = await Book.findById(id);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, "Book not found");
  }

  if (book.userId.valueOf() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this book"
    );
  }

  const isTitleExist = await Book.findOne({ title: payload.title });
  if (book.title !== isTitleExist?.title && isTitleExist) {
    throw new Error(`Book with title ${payload.title} already exist`);
  }

  const result = await Book.findByIdAndUpdate(id, payload, {
    new: true,
  });

  if (!result) {
    throw new Error("Book update failed");
  }
  return result;
};

exports.deleteBookService = async (userId, id) => {
  const book = await Book.findById(id);

  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, "Book not found");
  }

  if (book.userId.valueOf() !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to delete this book"
    );
  }

  const result = await Book.findByIdAndDelete(id);

  if (!result) {
    throw new Error("Book delete failed");
  }
  return result;
};

exports.bookReviewService = async (userId, id, payload) => {
  const book = await findById(id);
  if (!book) {
    throw new ApiError(httpStatus.NOT_FOUND, "Book not found");
  }

  const reviews = {
    review: payload.review,
    reviewerId: userId,
  };

  const result = await Book.findByIdAndUpdate(
    id,
    { $push: { reviews: reviews } },
    { new: true }
  );

  if (!result) {
    throw new Error("Review failed");
  }

  return result;
};
