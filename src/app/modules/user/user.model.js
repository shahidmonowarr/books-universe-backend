const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("../../../config");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    readlist: [
      {
        bookId: {
          type: Schema.Types.ObjectId,
          ref: "Book",
        },
        status: {
          type: String,
          enum: ["Reading", "Completed"],
          default: "Reading",
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

// Check if email is exist
userSchema.statics.isExist = async function (email) {
  return await User.findOne({ email }, { email: 1, password: 1, _id: 1 });
};

// Check if password is matched
userSchema.statics.isPasswordMatched = async function (
  givenPassword,
  savedPassword
) {
  return await bcrypt.compare(givenPassword, savedPassword);
};

// Check if password is changed after token issued
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_slot_round)
  );
  next();
});

const User = model("User", userSchema);

module.exports = User;
