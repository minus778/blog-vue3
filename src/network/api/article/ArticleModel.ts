//新增/编辑文章参数
export type addArticle = {
    id?: number,
    title: string,
    date: number,
    //编辑文章若分类有变化则categoryId为变化后的（加一），oldCategoryId为变化前的（减一）
    categoryId: number,
    //编辑文章若分类没有变化则oldCategoryId=-1
    oldCategoryId?: number,
    //编辑文章若标签没有变化则addTag和minusTag都为空
    tagId?: string,
    //编辑文章需要数量加一的标签
    addTag?: number[],
    //编辑文章需要数量减一的标签
    minusTag?: number[],
    content: string,
    htmlContent: string,
    isshow: string,
    author: string,
    imgList: string[]
}