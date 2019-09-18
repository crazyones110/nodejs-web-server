const loginCheck = (username, password) => {
  if (username === "fan" && password === "123") {
    return true
  } else {
    return false
  }
}

module.exports = {
  loginCheck
}