const { role } = require("./user.constant");
const { z } = require("zod");

exports.updateUserZod = z.object({
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(8).optional(),
  }),
});
