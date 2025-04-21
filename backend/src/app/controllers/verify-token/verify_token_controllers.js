/* 
  1 - Verify Token Controller
    2 - This controller is responsible for verifying the token
    3 - It checks if the token is valid and returns the user information
    4 - If the token is invalid, it returns an error message
    
*/

const jwt = require("jsonwebtoken");

const verifytoken = (request, response) => {
  const bearer = request.headers["authorization"];
  if (!String(bearer).includes("Bearer")) {
    return response.status(401).json({
      message: "Ups",
      error: "Sorry, you need authorizations",
    });
  }
  const token = String(bearer).split("Bearer ")[1].trim();
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return response.status(401).json({
        message: "Ups parece que el token no es valido",
        error: error.message,
        success: false,
      });
    }
    return response.status(200).json({
      message: "Token is valid",
      success: true
    });
  });
};
module.exports = {verifytoken};
