const { login } = require("../controller/user")
const { SuccessModel, ErrorModel } = require("../model/resModel")


const handleUserRouter = (req, res) => {
    const {method, url} = req
    const path = url.split("?")[0]

    if(method === "GET" && path === "/api/user/login") {
        // const { username, password } = req.body
        const { username, password } = req.query
        const loginResult = login(username, password)
        return loginResult.then(user => {
            if (user.username) {
                // 设置 session
                // 其实这一步有点多余，如果session里已经有了，就不需要赋值了
                // 但好像不多余啊，因为再次访问登陆页面，只会退出登录了，然后cookie就被删除了
                if (!req.session.username) {
                    req.session.username = user.username
                }
                if (!req.session.realname) {
                    req.session.realname = user.realname
                }
                // 因为已经 req.session = SESSION_DATA[userId],
                // 所以更改 req.session 就是在更改 SESSION_DATA
                
                console.log("req.session  ", req.session)

                return new SuccessModel({
                    msg: "登录成功"
                })
            } else {
                return new ErrorModel("登陆失败")
            }
        })
    }

    if (method === "GET" && path === "/api/user/logintest") {
        if (req.session.username) {
            return Promise.resolve(new SuccessModel({
                session: req.session
            }))
        } else {
            return Promise.resolve(new ErrorModel("尚未登录"))
        }
    }
}

module.exports = handleUserRouter
