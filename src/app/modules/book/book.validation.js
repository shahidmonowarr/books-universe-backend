const { z } = require("zod");

exports.createBookZod = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    author: z.string({
      required_error: "Author is required",
    }),
    genre: z.string({
      required_error: "Genre is required",
    }),
    publishedDate: z.string({
      required_error: "Published Date is required",
    }),
    image_url: z.string({
      required_error: "Image URL is required",
    }),
  }),
});
