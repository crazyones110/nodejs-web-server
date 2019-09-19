const { SuccessModel, ErrorModel } = require("../model/resModel")
const { 
    getList, 
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require("../controller/blog")

// 统一的登陆验证函数
const loginCheck = req => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel("尚未登录")
        )
    }
}

const handleBlogRouter = (req, res) => {
    const { method, url } = req
    const path = url.split("?")[0]

    //获取博客列表
    if (method === "GET" && path === "/api/blog/list") {
        let { author, keyword } = req.query
        author = author || ""
        keyword = keyword || ""
        // const listData = getList(author || "", keyword || "")
        // return new SuccessModel(listData)
        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }

    // 获取博客内容
    if (method === "GET" && path === "/api/blog/detail") {
        const { id } = req.query
        const detailResult = getDetail(id)
        return detailResult.then(detailData => {
            return new SuccessModel(detailData)
        })
    }

    // 新建一篇博客
    if (method === "POST" && path === "/api/blog/new") {
        // const data = newBlog(req.body)
        // return new SuccessModel(data)
        const loginState = loginCheck(req)
        if (loginState) {
            // 未登录
            return loginCheck
        }

        req.body.author = req.session.username
        const result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
    }

    // 更新一篇博客
    if (method === "POST" && path === "/api/blog/update") {
        const loginState = loginCheck(req)
        if (loginState) {
            // 未登录
            return loginCheck
        }
        const result = updateBlog(req.query.id, req.body)
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel("更新博客失败")
            }
        })      
    }

    // 删除一篇博客
    if (method === "POST" && path === "/api/blog/del") {
        const loginState = loginCheck(req)
        if (loginState) {
            // 未登录
            return loginCheck
        }
        const author = req.session.username
        const result = delBlog(req.query.id, author)
        return result.then(val => {
            if (val) {
                return new SuccessModel()
            } else {
                return new ErrorModel("删除博客失败")
            }
        })
    }
}

module.exports = handleBlogRouter
