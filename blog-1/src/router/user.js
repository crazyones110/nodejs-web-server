const { loginCheck } = require("../controller/user")
const { SuccessModel, ErrorModel } = require("../model/resModel")

const handleUserRouter = (req, res) => {
    const {method, url} = req
    const path = url.split("?")[0]

    if(method === "POST" && path === "/api/user/login") {
        const { username, password } = req.body
        const result = loginCheck(username, password)
        if (result) {
            return new SuccessModel()
        } else {
            return new ErrorModel("登陆失败")
        }
    }
}

module.exports = handleUserRouter