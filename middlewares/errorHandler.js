const errorHandler = (err, req, res) => {
  let statusCode;
  let message;

  switch (err.message) {
    case "Missing_Token":
      statusCode = 401;
      message = "Missing access token";
      break;
    case "Unauthorized":
      statusCode = 401;
      message = "Unauthorized";
      break;
    case "Invalid_Password":
      statusCode = 401;
      message = "Invalid Password";
      break;
    case "Invalid_Token":
      statusCode = 403;
      message = "Invalid Token";
      break;
    case "Not_Req_Permission":
      statusCode = 403;
      message = "This quiz does not require permission";
      break;
    case "Not_Found":
      statusCode = 404;
      message = "Not Found";
      break;
    case "User_not_Registered":
      statusCode = 404;
      message = "User Not Registered";
      break;
    case "Already_Exist":
      statusCode = 409;
      message = "Username Already Exist";
      break;
    case "Name_Exist":
      statusCode = 409;
      message = "Room Name Already Exist";
      break;
    case "Data_Exist":
      statusCode = 409;
      message = "Data Already Exist";
      break;
    case "Score_Exist":
      statusCode = 409;
      message = "Quiz Already Taken";
      break;
    default:
      statusCode = 500;
      message = "Internal server error";
      break;
  }
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
