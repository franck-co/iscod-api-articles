const jwt = require("jsonwebtoken");
const config = require("../../config");
const articlesService = require("./articles.service");
const { UserRole } = require("../users/users.schema");
const ForbiddenError = require("../../errors/forbidden");

class ArticlesController {

  /**
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   * @param {import('express').NextFunction} next 
   */
  async create(req, res, next) {
    try {
      const article = await articlesService.create({...req.body, user:req.user._id});
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }
  /**
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   * @param {import('express').NextFunction} next 
   */
  async update(req, res, next) {
    try {
      if (req.user.role !== UserRole.admin) throw new ForbiddenError()

      const id = req.params.id;
      const data = req.body;
      const articleModified = await articlesService.update(id, data);
      req.io.emit("article:update", articleModified);
      res.json(articleModified);
    } catch (err) {
      next(err);
    }
  }
  /**
   * 
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   * @param {import('express').NextFunction} next 
   */
  async delete(req, res, next) {
    try {
      if(req.user.role !== UserRole.admin) throw new ForbiddenError()

      const id = req.params.id;
      await articlesService.delete(id);
      req.io.emit("article:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
