const { login } = require("../controller/user")
const { SuccessModel, ErrorModel } = require("../model/resModel")
const { set } = require("../db/redis")

const handleUserRouter = (req, res) => {
    const {method, url} = req
    const path = url.split("?")[0]

    if(method === "POST" && path === "/api/user/login") {
        const { username, password } = req.body
        // const { username, password } = req.query
        const loginResult = login(username, password)
        return loginResult.then(user => {
            if (user.username) {
                // 设置 session
                // 其实这一步有点多余，如果session里已经有了，就不需要赋值了
                // 但好像不多余啊，因为再次访问登陆页面，只会退出登录了，然后cookie就被删除了
                // 其实不多余，因为有可能用户改用户名了啥的，所以这一步赋值是必须要有的
                req.session.username = user.username
                req.session.realname = user.realname
                // 同步到 redis 中
                set(req.sessionId, req.session)
                console.log(3)

                return new SuccessModel({
                    msg: "登录成功"
                })
            } else {
                return new ErrorModel("登陆失败")
            }
        })
    }

    // if (method === "GET" && path === "/api/user/logintest") {
    //     console.log("user.js中的req.session: ", req.session)
    //     if (req.session.username) {
    //         return Promise.resolve(new SuccessModel({
    //             session: req.session
    //         }))
    //     } else {
    //         return Promise.resolve(new ErrorModel("尚未登录"))
    //     }
    // }
}

module.exports = handleUserRouter
