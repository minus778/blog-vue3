//网站信息模块逻辑代码
import { useStore } from '@/store'
import type { FormInstance } from 'element-plus'
import { deleteImg } from '@/network/api/user/user'
export default function useMes (formData: any, blogMes: any, delAvatar: Function) {
  const store = useStore()
  //上传头像成功
  const uploadImg = (res: any) => {
    console.log('上传文件成功：', res);
    //上传头像就删除服务器上一张头像
    delAvatar()
    //更新头像
    if (res.code === 200) {
      formData.value.avatar = res.data.pathUrl
    } else {
      ElMessage.error('图片上传出现错误')
    }
  }

  //头像上传失败
  const uploadFail = (err: any) => {
    ElMessage.error('图片上传出现错误', err)
  }

  //提交表单
  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        //记录最初的头像url
        let oldAvatar = blogMes.value.avatar
        console.log('校验通过!', blogMes.value)
        console.log('提交表单：', formData.value);
        //将即将提交的表单数据保存到localStorage里
        //(避免在提交请求token失效跳转到登录页再跳转回来时页面刷新从而丢失上一次的表单数据，从而上一次保存的头像还未提交也就是对应还未删除一张图片，导致后端图片增加一张无用的)
        localStorage.setItem('blogWebsiteFormData', JSON.stringify(formData.value))
        store.dispatch('user/changeWebsiteMes', formData.value).then(async (res) => {
          if (res.code === 200) {
            //删除localStorage(在提交之前保存表单数据为了避免提交失败，如果提交成功就相当于避免了这个问题，就删除localStorage)
            localStorage.removeItem('blogWebsiteFormData')
            ElMessage({
              message: '修改成功',
              type: 'success'
            })
            //网站修改成功
            //更新表单数据(深拷贝)
            formData.value = JSON.parse(JSON.stringify(blogMes.value))
            //删除最初的头像(如果最初的头像和现在的头像一样说明头像没变，就不删除，不一样说明有改变，需要删除最初的头像)
            if (oldAvatar != formData.value.avatar) {
              //删除最初头像
              let delres = await deleteImg(oldAvatar)
              if (delres.code === 200) {
                console.log(delres.msg);
              } else {
                ElMessage.error('删除图片出现错误')
              }
            }
          }
        })

      } else {
        console.log('校验不通过!')
        return false
      }
    })
  }

  return {
    uploadImg,
    uploadFail,
    submitForm
  }
}