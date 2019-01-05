const express = require('express')
const artTemplate = require('express-art-template')
const path = require('path')
const app = express()
const logger = require('morgan')
const favicon = require('express-favicon')
const createError = require('http-errors')
const Youch = require('youch')
const middleware = require('./middleware')
const routers = require('./routers')

app.listen(3000, () => {
    console.log("server running")
})
// 打印日志
app.use(logger('dev'))
// 处理静态页面
app.use('/', express.static(path.join(__dirname, 'public')))
// 请求体解析
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// 配置模板引擎
app.engine('art', artTemplate);
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
});

// 网站小图标
app.use(favicon(__dirname + '/public/favicon.ico'))
//会话处理
// 配置公用的中间件，自定义,这里为什么可以放在路由上面？因为实际是app.use(path,function)这种形式，
// 如果不指定path,则默认是/，会匹配该路径及其下所有路径;
// 这里用app.use(里面必须是带有req,res,..这种形式的函数)
app.use(middleware.base)
// 处理路由
app.use(routers)

// 全局错误处理
// 此处err对象不会传进来，说明请求本身没有错误，404页面是客户端在浏览网页时，
// 服务器无法正常提供信息，或是服务器无法回应，且不知道原因所返回的页面
app.use((req, res, next) => {
    next(createError(404, 'Not Found'))
})
app.use((err, req, res, next) => {
    // app.get(name)获得设置名为name的值，此处为name是app settings table中各属性的一个
    const env = req.app.get('env')
    console.log(env)
    // 开发环境错误处理
    if (env === 'development') {
        const youch = new Youch(err, req)
        return youch.toHTML().then((html) => {
            res.send(html)
        })
    }
    // 生产环境错误处理
    
    res.status(err.status || 500)
    // res.locals和app.locals几乎没有区别，都是express中的两个对象，都用来渲染模板，区别：app.locals上通常挂载常量信息
    // （如博客名，描述，作者信息）；res.locals通常挂载变量信息即每次请求可能得值不一样
    res.locals.status = err.status === 404 ? 404 : 500
    res.render('error.art')
})






