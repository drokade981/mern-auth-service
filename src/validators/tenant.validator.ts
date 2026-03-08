import { checkSchema } from "express-validator";

export default checkSchema({
  name: {
    in: ["body"],
    errorMessage: "Tenant name is required",
    trim: true,
    notEmpty: true,
  },
  address: {
    in: ["body"],
    errorMessage: "Address is required",
    trim: true,
    notEmpty: true,
  },
});
