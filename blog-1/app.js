const querystring = require("querystring")
const handleBlogRouter = require("./src/router/blog")
const handleUserRouter = require("./src/router/user")

// session 数据
let SESSION_DATA = {}

const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    console.log("d.toGMTString() is  ", d.toGMTString())
    return d.toGMTString()
}

// 用于处理 postData
const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== "POST") {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ""
        req.on("data", chunk => {
            postData += chunk.toString()
        })
        req.on("end", () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(JSON.parse(postData))
        })
    })
}

const serverHandle = (req, res) => {
    // 设置返回格式 JSON
    res.setHeader('content-type', "application/json")

    // 解析 query
    req.query = querystring.parse(req.url.split("?")[1])

    // 解析 cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ""
    cookieStr.split(";").forEach(el => {
        if (!el) {
            return
        }
        const arr = el.split("=")
        req.cookie[arr[0].trim()] = arr[1] // 这里之所以要 trim 是因为前端传过来的cookie有空格
    })

    // 解析 session
    let needSetCookie = false
    let userId = req.cookie.userid
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}
        }
    } else {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        SESSION_DATA[userId] = {} 
        // 这里有个问题，cookie 到期后之前的那个随机的 userId 还会一直在SESSION_DATA中呀
    }
    req.session = SESSION_DATA[userId]
    console.log("SESSION_DATA: ", SESSION_DATA)


    getPostData(req)
        .then(postData => {
            req.body = postData
            // 处理 blog 路由
            // const blogData = handleBlogRouter(req, res)
            // if (blogData) {
            //     res.end(
            //         JSON.stringify(blogData)
            //     )
            //     return
            // }

            // 处理 blog 路由
            const blogResult = handleBlogRouter(req, res)
            if (blogResult) {
                blogResult.then(blogData => {
                    if (needSetCookie) {
                        res.setHeader("Set-Cookie", `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
                        // setTimeout(() => {
                        //     delete SESSION_DATA[userId]
                        // },24h)//可以用来提醒用户不要重复登录
                    }
                    res.end(
                        JSON.stringify(blogData)
                    )
                })
                return
            }

            // 处理 user 路由
            // const userData = handleUserRouter(req, res)
            // if (userData) {
            //     res.end(
            //         JSON.stringify(userData)
            //     )
            //     return
            // }
            const userResult = handleUserRouter(req, res)
            if (userResult) {
                userResult.then(userData => {
                    if (needSetCookie) {
                        res.setHeader("Set-Cookie", `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
                    }
                    res.end(
                        JSON.stringify(userData)
                    )
                })
                return
            }


            // 未命中路由，返回 404
            res.writeHead(404, { "content-type": "text/plain" })
            res.write("404 Not Found\n")
            res.end()
        })

}

module.exports = serverHandle

// process.env.NODE_ENV
