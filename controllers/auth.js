const User = require("../models/User.js");
const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async.js");

// @desc      Register user
// @route     POST /api/auth/register
// @access    Public

/**
 * @swagger
 * components:
 *  schemas:
 *    Register:
 *       type: object
 *       properties:
 *          name:
 *            type: string
 *            description: user name
 *          email:
 *            type: string
 *            description: email address
 *          password:
 *            type: string
 *            description: user password
 *       required:
 *         - name
 *         - email
 *         - password
 *       example:
 *         name: Kamil
 *         email: kamil@mail.ru
 *         password: '123456'
 */

/**
 * @swagger
 * /api/auth/register:
 *  post:
 *    tags: [User]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Register'
 *    responses:
 *      201:
 *        description: create new user
 *      400:
 *        description: Duplicate field value entered
 */
const register = asyncHandler(async (request, response, next) => {
  const { name, email, password } = request.body;

  // Create user
  const user = await User.create({ name, email, password });

  // Create token
  const token = await user.getSignedJwtToken();

  response.status(201).send({
    success: true,
    data: { name: user.name, email: user.email },
    token: token,
  });
});

// @desc      Login user
// @route     POST /api/auth/login
// @access    Public

/**
 * @swagger
 * components:
 *  schemas:
 *    Login:
 *       type: object
 *       properties:
 *          email:
 *            type: string
 *            description: email address
 *          password:
 *            type: string
 *            description: user password
 *       required:
 *         - email
 *         - password
 *       example:
 *         email: kamil@mail.ru
 *         password: '123456'
 */

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    tags: [User]
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Login'
 *    responses:
 *      200:
 *        description: login user
 *      400:
 *        description: Please provide an email and a password
 *      401:
 *        description: Invalid credentials
 */
const login = asyncHandler(async (request, response, next) => {
  const { email, password } = request.body;

  // Validate emil & password
  if (!email || !password) {
    return next(
      new ErrorResponse(`Please provide an email and a password`, 400)
    );
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }

  // // Create token
  const token = await user.getSignedJwtToken();

  response.status(200).send({ success: true, token });
});

module.exports = { register, login };
