const { validationRules } = require("../utils/validation/validationRules");
const { validateFields } = require("../utils/validation/validate");
const { VerifiedToken } = require("../utils/authHelpers");
const { getTokenFromHeaders } = require("../utils/jwt/getToken");
const logger = require("../utils/logger");
const { sendError } = require("../utils/response");

// get user profile
async function validateGetUserProfile(req, res, next) {
  const token = await getTokenFromHeaders(req);
  const checkToken = await VerifiedToken(token);
  if (!checkToken) {
    return res.status(401).json({ error: "Invalid token" });
  }
  req.body.user_id = checkToken.id;
  const userRequestGetProfile = req.body;
  const rules = validationRules["getUserProfile"];
  const resultCheckingData = await validateFields(userRequestGetProfile, rules);
  if (resultCheckingData.valid == true) {
    logger.info("Successfull checking data user for changing password");
    next();
  } else {
    logger.info(
      `Error checking data user for changing password: ${resultCheckingData.error}`
    );
    sendError(res, 400, "Error checking data", {
      Error: resultCheckingData.error,
    });
  }
}

module.exports = { validateGetUserProfile };
