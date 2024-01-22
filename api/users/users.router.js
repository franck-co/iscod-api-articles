const express = require("express");
const usersController = require("./users.controller");
const router = express.Router();

router.get("/", usersController.getAll);
router.get("/me", usersController.me);
router.get("/:id", usersController.getById);
router.post("/", usersController.create);
router.put("/:id", usersController.update);
router.delete("/:id", usersController.delete);


module.exports = router;
