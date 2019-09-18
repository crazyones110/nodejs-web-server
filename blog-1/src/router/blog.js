const { SuccessModel, ErrorModel } = require("../model/resModel")
const { 
    getList, 
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require("../controller/blog")

const handleBlogRouter = (req, res) => {
    const { method, url } = req
    const path = url.split("?")[0]

    //获取博客列表
    if (method === "GET" && path === "/api/blog/list") {
        const { author, keyword } = req.query
        const listData = getList(author || "", keyword || "")
        return new SuccessModel(listData)
    }

    // 获取博客内容
    if (method === "GET" && path === "/api/blog/detail") {
        const { id } = req.query
        const detailData = getDetail(id)
        return new SuccessModel(detailData)
    }

    // 新建一篇博客
    if (method === "POST" && path === "/api/blog/new") {
        const data = newBlog(req.body)
        return new SuccessModel(data)
    }

    // 更新一篇博客
    if (method === "POST" && path === "/api/blog/update") {
        const result = updateBlog(req.query.id, req.body)
        if (result) {
            return new SuccessModel()
        } else {
            return new ErrorModel("更新博客失败")
        }
    }

    // 删除一篇博客
    if (method === "POST" && path === "/api/blog/del") {
        const result = delBlog(req.query.id)
        if (result) {
            return new SuccessModel()
        } else {
            return new ErrorModel("删除博客失败")
        }
    }
}

module.exports = handleBlogRouter
