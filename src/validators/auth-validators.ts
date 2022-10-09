import { body } from "express-validator";

export const userSchemaValidators = [
    body("email")
        .notEmpty()
        .withMessage("Email should not be empty")
        .isEmail()
        .withMessage("Email is not valid"),
    body("username")
        .notEmpty()
        .withMessage("Username should not be empty")
        .isString()
        .withMessage("Username should be a string"),
    body("password")
        .notEmpty()
        .withMessage("Password should not be empty")
        .isString()
        .withMessage("Password should be a string"),
];

export const loginSchemaValidators = [
    body("email")
        .notEmpty()
        .withMessage("Email should not be empty")
        .isEmail()
        .withMessage("Email is not valid"),
    body("password")
        .notEmpty()
        .withMessage("Password should not be empty")
        .isString()
        .withMessage("Password should be a string"),
];
