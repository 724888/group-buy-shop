Group-Buy-Shop
=========

摘要
---------
本项目类型为团购类的商城项目，对某个商品来说，在规定时间内购买人数达到足够的个数就可算拼团成功
。

从开发的角度来讲，本仓库为该项目的后端代码库，所用的技术栈为Nodejs + MongoDB，语言为TypeScript。具体采用的
框架是Koa2，ODM框架是Mongoose。

项目的前端是一个微信小程序，所以本项目就自然的介入了微信支付。

与本项目相关联的包含一个此商城的后台管理系统，采用的技术栈为Vue


分层解释
--------
本项目使用TypeScript开发，与MVC架构类似。

控制器Controller对应着本项目的controller文件夹，其与路由一一对应，负责处理请求，调用相关的服务Service执行逻辑以及返回响应Response

中间件Middleware对应着本项目的middleware文件夹，参考Koa的中间件设计思想，具有日志记录，异常捕捉等等作用

服务Service对应着本项目的service文件夹，是建立与对象关系层DAO的上层，负责业务逻辑的处理，并直接与模型层打交道

模型层Model对应着本项目的model文件夹，包含了本项目的依赖模型，ORM用


前端项目
--------
[后台管理系统](https://github.com/Lurance/group-buy-shop-ms)






