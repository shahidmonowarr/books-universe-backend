const { z } = require("zod");

exports.signUpZod = z.object({
  body: z.object({
    firstName: z.string({
      required_error: "First Name is required",
    }),
    lastName: z.string({
      required_error: "Last Name is required",
    }),
    email: z.string({
      required_error: "Email is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

exports.loginZod = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

exports.refreshTokenZod = z.object({
  body: z.object({
    refreshToken: z.string({
      required_error: "Refresh Token is required",
    }),
  }),
});
