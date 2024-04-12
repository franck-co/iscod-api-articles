const express = require("express");
const authMiddleware = require("../../middlewares/auth")
const usersController = require("./users.controller");

const router = express.Router();

router.get("/", authMiddleware, usersController.getAll);
router.get("/me", authMiddleware, usersController.me);
router.get("/:id", authMiddleware, usersController.getById);
router.post("/", authMiddleware, usersController.create);
router.put("/:id", authMiddleware, usersController.update);
router.delete("/:id", authMiddleware, usersController.delete);

//public endpoint
router.get('/:id/articles', usersController.getArticles)


module.exports = router;
