const { validationRules } = require("../utils/validation/validationRules");
const { validateFields } = require("../utils/validation/validate");
const { VerifiedToken } = require("../utils/authHelpers");
const { getTokenFromHeaders } = require("../utils/jwt/getToken");
const logger = require("../utils/logger");
const { sendError } = require("../utils/response");

// Create board
async function validateCreateBoard(req, res, next) {
  const token = await getTokenFromHeaders(req);
  const checkToken = await VerifiedToken(token);
  if (!checkToken) {
    sendError(res, 401, "Invalid token", "");
  }
  const boardCreateData = req.body;
  const rules = validationRules["createBoard"];
  const result = await validateFields(boardCreateData, rules);
  if (result.valid == true) {
    req.body.user_id = checkToken.id;
    logger.info("Successfull checking data to create board");
    next();
  } else {
    logger.info(`Error checking data ${result.error}`);
    sendError(res, 400, `Error checking data ${result.error}`);
  }
}

// Get board
async function validateGetBoard(req, res, next) {
  const token = await getTokenFromHeaders(req);
  const checkToken = await VerifiedToken(token);
  if (!checkToken) {
    sendError(res, 401, "Invalid token", "");
  }
  const boardGetData = req.body;
  const rules = validationRules["getBoard"];
  const result = await validateFields(boardGetData, rules);
  if (result.valid == true) {
    req.body.user_id = checkToken.id;
    logger.info("Successfull checking data to create board");
    next();
  } else {
    logger.info(`Error checking data ${result.error}`);
    sendError(res, 400, `Error checking data ${result.error}`);
  }
}

module.exports = { validateCreateBoard, validateGetBoard };