const express = require('express');

const checkAuth = require("../middleware/check-auth");

const fileStorage = require("../middleware/file");

const PostsController = require("../controllers/posts");

const router = express.Router();

router.post("", checkAuth, fileStorage, PostsController.createPost);

router.put("/:id", checkAuth, fileStorage, PostsController.updatePost);

router.get('', PostsController.getAllPosts);

router.get("/:id", PostsController.getPostById);

router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;