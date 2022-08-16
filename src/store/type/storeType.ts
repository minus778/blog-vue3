//定义接口约束仓库中tab选项卡存储数据的类型
export interface ITab {
    title: string,
    path: string
}
//定义tag标签
export interface ITag {
    id?: number,
    name: string,
    num?: number,
    date: number | string,
    color: string
}
//定义category分类
export interface ICategory {
    id?: number,
    name: string,
    num?: number,
    date: number | string,
    color: string
}
//定义文章
export interface IArticle {
    id?: number,
    title: string,
    author: string,
    date: number | string,
    categoryId: number,
    tagId: string,
    readNum: number,
    content: string,
    likes: number,
    isshow: string,
    imgList: string | string[]
}
//定义comment评论
export interface IComment {
    id?: number,
    tos?: string,
    froms: string,
    email?: string,
    content: string,
    date: number | string,
    articleId?: number,
    parentId?: number,
    toId?: number,
    read?: boolean,
    parentDelete?: boolean,
    isdelArticle?: boolean
}

//某条评论已读传递参数
export interface CommentRead {
    id: number,
    type: string
}

//网站信息
export interface BlogMes {
    name: string,
    password: string,
    avatar: string,
    introduce: string,
    desc: string,
    github: string,
    gitee: string,
    recode: string,
    websiteAddress: string
}