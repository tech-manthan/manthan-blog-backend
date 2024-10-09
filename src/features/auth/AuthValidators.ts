import { checkSchema } from "express-validator";

export const loginValidator = checkSchema({
  email: {
    errorMessage: "Email Is Required",
    notEmpty: true,
    trim: true,
    isEmail: true,
  },
  password: {
    errorMessage: "password Is Required",
    notEmpty: true,
    trim: true,
  },
});

export const registerValidator = checkSchema({
  email: {
    errorMessage: "Email Is Required",
    notEmpty: true,
    trim: true,
    isEmail: true,
  },
  fullname: {
    errorMessage: "Full Name Is Required",
    notEmpty: true,
    trim: true,
  },
  role: {
    errorMessage: "Role Is Required",
    notEmpty: true,
    trim: true,
  },
  password: {
    errorMessage: "password Is Required",
    notEmpty: true,
    trim: true,
    isLength: {
      options: { min: 8 },
      errorMessage: "Password Lenght Should be 8 character ",
    },
  },
});
