const { role } = require("./user.constant");
const { z } = require("zod");

exports.updateUserZod = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
  }),
});
