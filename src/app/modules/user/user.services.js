const httpStatus = require("http-status");
const { ApiError } = require("../../../errors/apiError");
const { calculatePagination } = require("../../../helpers/paginationHelpers");
const { userSearchableFields, userPopulate } = require("./user.constant");
const User = require("./user.model");
const { generateUserId } = require("../../../utilities/user.utils");
const bcrypt = require("bcrypt");
const config = require("../../../config");

exports.getUserProfileService = async (_id) => {
  const result = User.findById(_id).populate(userPopulate);
  if (!result) {
    throw new Error("User not found !");
  }
  return result;
};

exports.getAllUsersService = async (paginationOptions, filters) => {
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);
  const { searchTerm, ...filtersData } = filters;
  let andConditions = [];

  // search on the field
  if (searchTerm) {
    andConditions.push({
      $or: userSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  // filtering on field
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

  // sorting
  let sortConditions = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};
  // output
  const result = await User.find(whereConditions)
    .populate("")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

exports.getSingleUserService = async (id) => {
  const result = await User.findById(id);
  if (!result) {
    throw new Error("User not found !");
  }
  return result;
};

exports.updateUserService = async (_id, payload) => {
  const isExist = await User.findById(_id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found !");
  }

  const { role, id, password, ...userData } = payload;
  const updatedUserData = { ...userData };

  if (password) {
    const dataKey = `password`;
    updatedUserData[dataKey] = await bcrypt.hash(
      password,
      Number(config.bcrypt_slot_round)
    );
  }

  const result = await User.findOneAndUpdate({ _id }, updatedUserData, {
    new: true,
  });

  if (!result) {
    throw new Error("User update failed");
  }

  return result;
};

exports.deleteUserService = async (id) => {
  const isExist = await User.findById(id);
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found !");
  }

  const result = await User.findByIdAndDelete(id);

  if (!result) {
    throw new Error("User delete failed");
  }
  return result;
};

exports.addToWishlistService = async (id, bookId) => {
  const user = await User.findById(id);

  const isExist = user.wishlist.find(
    (id) => id.toString() === bookId.toString()
  );
  if (!isExist) {
    const result = await User.findByIdAndUpdate(
      id,
      {
        $push: { wishlist: bookId },
      },
      { new: true }
    ).populate("wishlist");

    if (!result) {
      throw new Error("Add to wishlist failed");
    }
    return result;
  } else {
    throw new Error("Book already in wishlist");
  }
};

exports.removeFromWishlistService = async (id, bookId) => {
  const user = await User.findById(id);

  const isExist = user.wishlist.find(
    (id) => id.toString() === bookId.toString()
  );

  if (isExist) {
    const result = await User.findByIdAndUpdate(
      id,
      {
        $pull: { wishlist: bookId },
      },
      { new: true }
    ).populate("wishlist");

    if (!result) {
      throw new Error("Remove from wishlist failed");
    }
    return result;
  } else {
    throw new Error("Book not in wishlist");
  }
};

exports.addToReadListService = async (id, payload) => {
  const user = await User.findById(id);

  const isExist = user.readlist.find(
    (book) => book.bookId.toString() === payload.bookId.toString()
  );

  if (!isExist) {
    const result = await User.findByIdAndUpdate(
      id,
      {
        $push: { readlist: payload },
      },
      { new: true }
    ).populate("readlist");

    if (!result) {
      throw new Error("Add to read list failed");
    }
    return result;
  } else {
    throw new Error("Book already in read list");
  }
};

exports.markAsCompletedService = async (id, payload) => {
  const user = await User.findById(id);

  const isExist = user.readlist.find(
    (book) => book.bookId.toString() === payload.bookId.toString()
  );

  if (isExist) {
    const restOfBooks = user.readlist.filter(
      (book) => book.bookId.toString() !== payload.bookId.toString()
    );

    const result = await User.findByIdAndUpdate(
      id,
      {
        readlist: [...restOfBooks, payload],
      },
      { new: true }
    ).populate("readlist");

    if (!result) {
      throw new Error("Mark as completed failed");
    }
    return result;
  } else {
    throw new Error("Book not in read list");
  }
};
