const getList = (author, keyword) => {
  // 先返回假数据（格式是正确的）
  return [
    {
      id: 1,
      header: "标题A",
      content: "内容A",
      author: "zhangsan",
      createTime: 1568552371917
    },
    {
      id: 2,
      header: "标题B",
      content: "内容B",
      author: "zhangsan",
      createTime: 1568552387547
    }
  ]
}

const getDetail = id => {
  return {
    id: 1,
    header: "标题A",
    content: "内容A",
    author: "zhangsan",
    createTime: 1568552371917
  }
}

const newBlog = (blogData = {}) => {
  // blogData 是一个博客对象， 包含 title content 属性
  return {
    id: 3 // 表示新建博客。插入到数据表里面的 id
  }
}

const updateBlog = (id, blogData = {}) => {
  // id 就是要更新博客的 id
  // blogData 是一个博客对象， 包含 title content 属性
  console.log('update blog', id, blogData)
  return true
}

const delBlog = id =>{
  // id 就是要删除博客的 id
  console.log("id...", id)
  return true
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}