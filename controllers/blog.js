const path = require("path");
const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");
const Blog = require("../models/Blog.js");

// @desc      Create new blog
// @route     POST /api/blogs
// @access    Private

/**
 * @swagger
 * components:
 *  schemas:
 *    Create Blog:
 *       type: object
 *       properties:
 *          text:
 *            type: string
 *            description: text for blog
 *       required:
 *         - text
 *       example:
 *         text: My first blog-text
 */

/**
 * @swagger
 * /api/blogs:
 *  post:
 *    tags: [Blog]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Create Blog'
 *    responses:
 *      201:
 *        description: create new blog
 *      401:
 *        description: User is not authorize to create this blog
 *      400:
 *        description: Duplicate field value entered
 */
const createBlog = asyncHandler(async (request, response, next) => {
  // Add user to request body
  request.body.user = request.user.id;

  const blog = await Blog.create(request.body);

  // Make sure user is blog owner
  if (blog.user.toString() !== request.user.id) {
    return next(
      new ErrorResponse(
        `User ${request.params.id} is not authorize to create this blog `,
        401
      )
    );
  }

  response.status(201).json({ success: true, data: blog });
});

// @desc      Get all blogs
// @route     GET /api/blogs
// @access    Public

/**
 * @swagger
 * components:
 *  schemas:
 *    Show all Blogs:
 *       type: object
 */

/**
 * @swagger
 * /api/blogs:
 *  get:
 *    tags: [Blog]
 *    responses:
 *      200:
 *        description: show all blogs
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Show all Blogs'
 */
const getBlogs = asyncHandler(async (request, response, next) => {
  const blogs = await Blog.find().sort({ text: 1 });

  response
    .status(200)
    .send({ success: true, count: blogs.length, data: blogs });
});

// @desc      Get single blog
// @route     GET /api/blogs/:id
// @access    Public

/**
 * @swagger
 * components:
 *  schemas:
 *    Show a Blog:
 *       type: object
 */

/**
 * @swagger
 * /api/blogs/{id}:
 *  get:
 *    tags: [Blog]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the blog id
 *    responses:
 *      200:
 *        description: show a blog
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Show a Blog'
 *    404:
 *      description: the blog not found
 */
const getBlog = asyncHandler(async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${request.params.id}`, 404)
    );
  }

  response.status(200).json({ success: true, data: blog });
});

// @desc      Update blog
// @route     PUT /api/blogs/:id
// @access    Private

/**
 * @swagger
 * components:
 *  schemas:
 *    Update Blog:
 *       type: object
 *       properties:
 *          text:
 *            type: string
 *            description: text for blog
 *       required:
 *         - text
 *       example:
 *         text: My first blog-text
 */

/**
 * @swagger
 * /api/blogs/{id}:
 *  put:
 *    tags: [Blog]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the blog id
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Update Blog'
 *    responses:
 *      200:
 *        description: update the blog
 *      404:
 *        description: blog not found
 *      401:
 *        description: User is not authorize to update this blog
 */
const updateBlog = asyncHandler(async (request, response, next) => {
  let blog = await Blog.findById(request.params.id);

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${request.params.id}`, 404)
    );
  }

  // Make sure user is blog owner
  if (blog.user.toString() !== request.user.id) {
    return next(
      new ErrorResponse(
        `User ${request.params.id} is not authorize to update this blog `,
        401
      )
    );
  }

  blog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
    runValidators: true,
  });

  response.status(200).json({ success: true, data: blog });
});

// @desc      Delete blog
// @route     DELETE /api/blogs/:id
// @access    Private

/**
 * @swagger
 * components:
 *  schemas:
 *    Delete Blog:
 *       type: object
 */

/**
 * @swagger
 * /api/blogs/{id}:
 *  delete:
 *    tags: [Blog]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the blog id
 *    responses:
 *      200:
 *        description: delete the blog
 *      404:
 *        description: blog not found
 *      401:
 *        description: User is not authorize to delete this blog
 */
const deleteBlog = asyncHandler(async (request, response, next) => {
  let blog = await Blog.findById(request.params.id);

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${request.params.id}`, 404)
    );
  }

  // Make sure user is blog owner
  if (blog.user.toString() !== request.user.id) {
    return next(
      new ErrorResponse(
        `User ${request.params.id} is not authorize to delete this blog `,
        401
      )
    );
  }

  blog = await Blog.findByIdAndDelete(request.params.id);

  response.status(200).json({ success: true, data: blog });
});

// @desc      Upload photo for blog
// @route     PUT /api/blogs/:id/photo
// @access    Private

/**
 * @swagger
 * components:
 *  schemas:
 *    Upload Photo:
 *       type: object
 */

/**
 * @swagger
 * /api/blogs/{id}/photo:
 *  put:
 *    tags: [Blog]
 *    consumes:
 *      - multipart/form-data
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the blog id
 *      - in: formData
 *        name: file
 *        schema:
 *          type: file
 *        required: true
 *        description: File Upload
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Upload Photo'
 *    responses:
 *      200:
 *        description: file uploaded successfully
 *      404:
 *        description: blog not found
 *      401:
 *        description: User is not authorize to upload photo
 *      400:
 *        description: Please upload a file
 *      500:
 *        description: Problem with file upload
 */
const blogPhotoUpload = asyncHandler(async (request, response, next) => {
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return next(
      new ErrorResponse(`Blog not found with id of ${request.params.id}`, 404)
    );
  }

  // Make sure user is blog owner
  if (blog.user.toString() !== request.user.id) {
    return next(
      new ErrorResponse(
        `User ${request.params.id} is not authorize to upload photo `,
        401
      )
    );
  }

  if (!request.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = request.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${blog._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATHS}/${file.name}`, async (error) => {
    if (error) {
      console.error(error);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Blog.findByIdAndUpdate(request.params.id, { photo: file.name });

    response.status(200).json({ success: true, data: file.name });
  });
});

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  blogPhotoUpload,
};
