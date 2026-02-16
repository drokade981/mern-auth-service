import { checkSchema } from "express-validator";

export default checkSchema({
  email: {
    in: ["body"],
    errorMessage: "Email is required",
    trim: true,
    isEmail: {
      errorMessage: "Invalid email format",
    },
    notEmpty: true,
  },
  firstName: {
    in: ["body"],
    errorMessage: "First name is required",
    trim: true,
    notEmpty: true,
  },
  lastName: {
    in: ["body"],
    errorMessage: "Last name is required",
    trim: true,
    notEmpty: true,
  },
  password: {
    isLength: {
      options: { min: 8 },
      errorMessage: "Password should be at least 8 chars",
    },
    in: ["body"],
    errorMessage: "Password is required",
    notEmpty: true,
  },
});

// export default [
//     body('email').notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
//     body('password').notEmpty().withMessage("Password is required"),
//     body('firstName').notEmpty().withMessage("First name is required"),
//     body('lastName').notEmpty().withMessage("Last name is required"),
// ];
