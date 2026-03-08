import { checkSchema } from "express-validator";

export default checkSchema({
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
  role: {
    in: ["body"],
    errorMessage: "Role is required",
    trim: true,
    notEmpty: true,
  },
});

// export default [
//     body('email').notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email format"),
//     body('password').notEmpty().withMessage("Password is required"),
//     body('firstName').notEmpty().withMessage("First name is required"),
//     body('lastName').notEmpty().withMessage("Last name is required"),
// ];
