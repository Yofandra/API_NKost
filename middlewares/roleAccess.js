const roleAccess = (userRole, endpoint, method) => {
  if (userRole === "admin" && method !== "GET" && endpoint === "/room") {
    return false;
  } else if (userRole !== "user" && endpoint === "/doQuiz") {
    return false
  } else {
    return true
  }
};

export default roleAccess;
