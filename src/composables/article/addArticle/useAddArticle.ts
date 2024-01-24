//新增/编辑文章页表单提交逻辑
import type { FormInstance } from 'element-plus'
import { useStore } from '@/store'
import { useRouter, useRoute } from 'vue-router'

export default function useAddArticle (submitForm: any, formData: any, isSubmit: any, userName: any, tagList: any, articleList: any, categoryList: any, clearForm: Function) {
  const store = useStore()
  const route = useRoute()
  const router = useRouter()
  //发布文章
  const submitArticle = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        isSubmit.value = 1
        submitForm.title = formData.title
        submitForm.date = +new Date()
        submitForm.content = formData.mdContent
        submitForm.htmlContent = formData.htmlContent
        submitForm.isshow = formData.isshow
        submitForm.author = userName.value
        submitForm.imgList = formData.imgList
        //处理标签id
        let tagListId: number[] = [];
        formData.selectTagList.forEach((item: any) => {
          let tag = tagList.value.filter((items: any) => {
            return items.name === item[0]
          })
          tagListId.push(tag[0].id)
        });
        submitForm.tagId = tagListId.join('、')
        //处理分类id
        submitForm.categoryId = categoryList.value.filter((item: any) => {
          return item.name === formData.selectCategoryList[0]
        })[0].id;
        console.log('校验通过!', formData)
        console.log('提交表单：', submitForm);

        //localStorage存储显示的表单数据，避免文章发布失败(token过期)跳转到登录页再回来后数据丢失的问题
        localStorage.setItem('blogAddArticleFormData', JSON.stringify(formData))

        if (route.query.editArticleId) {
          console.log('编辑文章请求');
          editArticle()

        } else {
          console.log('新增文章请求');
          addNewArticle()
        }

      } else {
        console.log('校验不通过!')
        return false
      }
    })
  }

  //新增文章
  const addNewArticle = () => {
    store.dispatch('articles/addArticleItem', submitForm).then(res => {
      if (res.code === 200) {
        isSubmit.value = 0
        //文章发布成功删除localStorage，表示本次提交没有问题
        localStorage.removeItem('blogAddArticleFormData')

        //文章添加成功将对应的分类文章数加一
        store.commit('categories/addArticleNum', submitForm.categoryId)
        //文章添加成功将对应的标签文章数加一
        let tagIdList = submitForm.tagId?.split('、').map((ids: any) => parseInt(ids))
        store.commit('tags/addArticleNum', tagIdList)
        ElMessage({
          message: res.msg,
          type: 'success'
        })
        //清空表单
        clearForm()
        //本篇文章图片列表记录完毕后清空
        formData.imgList = []
      }
    }).catch(err => {
      isSubmit.value = 0
      console.log(err)
      ElMessage.error('请求出错')
    })
  }

  //编辑文章
  const editArticle = () => {
    let editArticleId = parseInt(route.query.editArticleId as string)
    submitForm.id = editArticleId
    //原始的文章表单
    let oldArticleForm = articleList.value.filter((item: any) => item.id === editArticleId)[0]
    console.log('排查', submitForm, oldArticleForm)
    const cId = typeof oldArticleForm.categoryId === 'number' ? oldArticleForm.categoryId : oldArticleForm.categoryId.id
    const tId = typeof oldArticleForm.tagId === 'string' ? oldArticleForm.tagId.split('、') : oldArticleForm.tagId.map((item: any) => item.id)
    //判断文章分类是否有变化
    if (submitForm.categoryId === cId) {
      submitForm.oldCategoryId = -1
    } else {
      submitForm.oldCategoryId = cId
    }
    //判断文章标签是否有变化
    if (submitForm.tagId === tId) {
      submitForm.addTag = []
      submitForm.minusTag = []
    } else {
      let newList = submitForm.tagId?.split('、')
      let oldList = tId.split('、')
      //找出需要加一的
      newList?.forEach((tag: any) => {
        if (oldList.indexOf(tag) === -1) {
          submitForm.addTag?.push(Number(tag))
        }
      })
      //找出需要减一的
      oldList.forEach((tag: any) => {
        if (newList?.indexOf(tag) === -1) {
          submitForm.minusTag?.push(Number(tag))
        }
      })
    }
    console.log('编辑文章表单：', submitForm);
    store.dispatch('articles/editArticleItem', submitForm).then(res => {
      if (res.code === 200) {
        isSubmit.value = 0
        //文章修改成功删除localStorage，表示本次提交没有问题
        localStorage.removeItem('blogAddArticleFormData')
        //编辑成功
        ElMessage({
          message: res.msg,
          type: 'success'
        })
        //对应分类数量加一/减一
        if (submitForm.oldCategoryId != -1) {
          //加一
          store.commit('categories/addArticleNum', submitForm.categoryId)
          //减一
          store.commit('categories/minusArticleNum', submitForm.oldCategoryId)
        }
        //对应标签数量加一/减一
        //加一
        if ((submitForm.addTag as number[]).length > 0) {
          store.commit('tags/addArticleNum', submitForm.addTag)
        }
        //减一
        if ((submitForm.minusTag as number[]).length > 0) {
          store.commit('tags/minusArticleNum', submitForm.minusTag)
        }
        router.replace({
          path: '/articleList'
        })
        //清空表单
        clearForm()
        //本篇文章图片列表记录完毕后清空
        formData.imgList = []
        //编辑文章成功后将标签加减数组清空
        submitForm.addTag = []
        submitForm.minusTag = []
      }
    }).catch(err => {
      isSubmit.value = 0
      console.log(err)
      ElMessage.error('请求出错')
    })

  }

  return {
    submitArticle
  }
}