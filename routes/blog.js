const protect = require("../middleware/auth.js");
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  blogPhotoUpload,
} = require("../controllers/blog.js");
const express = require("express");
const router = express.Router();

router.post("/", protect, createBlog);

/**
 * @swagger
 * components:
 *  schemas:
 *    Blog:
 *      type: object
 *      properties:
 *        text:
 *          type: string
 *          description: the blog text
 *        photo:
 *          type: string
 *          description: the blog photo
 *        createdAt:
 *          type: date
 *          description: the blog created in this date
 *      required:
 *        - text
 *      example:
 *        text: My first blog-text
 *        photo: photo_6274e97cca30699ccca43dc5.jpg
 *        createdAt: 2022-05-06T09:25:16.792+00:00
 */

/**
 * @swagger
 * /api/blogs:
 *  get:
 *   description: show all blogs
 *   tags: [Blog]
 *   requestBody:
 *      required: true
 *      application/json:
 *         schema:
 *           type: object
 *           $ref: "#components/schemas/Blog"
 *   response:
 *     200:
 *       description: show all blogs!
 *
 */
router.get("/", getBlogs);
router.get("/:id", getBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);
router.put("/:id/photo", protect, blogPhotoUpload);

module.exports = router;
