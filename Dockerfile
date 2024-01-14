#nginx服务器
FROM nginx
LABEL name="blog-vue3"
LABEL version="latest"
# 新建nginx静态资源目录
RUN mkdir -p /usr/share/nginx/html/blog
#将打包后的文件夹放在nginx静态资源文件夹目录下
COPY  ./dist/ /usr/share/nginx/html/blog
#将前端nginx配置文件放在nginx子配置文件夹目录下
COPY ./nginx/blog-vue3.conf /etc/nginx/conf.d/
COPY ./nginx/gzip.conf /etc/nginx/conf.d/
# 前端项目端口号设置为80
EXPOSE 80