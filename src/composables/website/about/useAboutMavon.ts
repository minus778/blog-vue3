//关于页编辑器部分
import { uploadImg, deleteImg } from '@/network/api/article/article'
import { ref, computed } from 'vue'
import { useStore } from '@/store'
export default function useAboutMavon(mdContent: any, htmlContent: any, uploadImgList: any) {
    //mavon编辑器dom
    const md = ref(null)

    const store = useStore()

    //获取后端url
    const websiteUrl = computed(() => {
        return store.getters['user/getWebsiteUrl']
    })
    //转换编辑器内容
    const getMdHtml = (mdcontent: string, htmlcontent: string) => {
        // console.log('mdcontent', mdcontent)
        // console.log('htmlcontent', htmlcontent)
        mdContent.value = mdcontent;
        htmlContent.value = htmlcontent;
    }

    //点击编辑器的上传图片 (图片位置编号, File对象)
    const uploadContentImg = async (pos: any, file: any) => {
        console.log("上传内容图片", file);
        //第一步.将图片上传到服务器
        var fd = new FormData();
        fd.append("file", file);
        let res = await uploadImg(fd)
        if (res.code === 200) {
            //添加一张图片
            uploadImgList.value.push(res.data.pathUrl);
            // 第二步.将返回的url替换到文本原位置! [...](0) -> ![...](url)
            (md.value as any).$img2Url(pos, websiteUrl.value + res.data.pathUrl);
        }
    }

    //点击编辑器的删除图片
    const delContentImg = async (urlAndFileArr: any) => {
        const fileUrl = urlAndFileArr[0]; // 文件URL
        const file = urlAndFileArr[1]; // File对象
        //处理一下图片url
        let delFileUrl = '/imgs' + fileUrl.split('/imgs')[1]
        console.log("正确的图片url:", delFileUrl);
        let res = await deleteImg(delFileUrl);
        if (res.code === 200) {
            console.log(res.msg);
            //去掉删除的图片
            uploadImgList.value = uploadImgList.value.filter((item: any) => {
                return item != delFileUrl
            })
        }
    }

    return {
        md,
        getMdHtml,
        uploadContentImg,
        delContentImg
    }
}