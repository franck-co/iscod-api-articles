const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const usersService = require('../api/users/users.service')

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "not token";
    }
    /** @type {import('../api/users/users.controller').JwtPayload} */
    const decoded = jwt.verify(token, config.secretJwtToken);


    //get all user information
    const user = await usersService.get(decoded.userId)

    if (!user) {
      throw `user ${decoded.userId} was not found`
    }

    req.user = user;

    next();
  } catch (message) {
    next(new UnauthorizedError(message));
  }
};
