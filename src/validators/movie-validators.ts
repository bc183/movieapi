import { body, ValidationChain } from "express-validator";

export const movieSchemaValidators: ValidationChain[] = [
    body("name")
        .notEmpty()
        .withMessage("Movie Name should not be empty")
        .isString()
        .withMessage("Movie Name should be a string"),
    body("rating")
        .notEmpty()
        .withMessage("Movie rating should not be empty")
        .isFloat({ min: 1, max: 10 })
        .withMessage("Movie rating should be a Number between 1 and 10"),
    body("genre")
        .notEmpty()
        .withMessage("Movie genre should not be empty")
        .isString()
        .withMessage("Movie genre should be a string"),
    body("releaseDate")
        .notEmpty()
        .withMessage("Release Date should not be empty")
        .isDate()
        .withMessage("Release Date should be a Date"),
    body("cast")
        .notEmpty()
        .withMessage("Cast should not be empty")
        .isArray({ min: 1 })
        .withMessage("Cast should be an Array with atleast 1 element"),
];
