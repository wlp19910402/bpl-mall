# bpl-mall

> '练习vue2.o商城'

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
# bpl-mall



# express服务端：
``` bash
# 全局安装
cnpm install -g express-generator
# 创建express 服务
express server
cnpm i ejs --save
# 管理mongodb
cnpm i mongoose --save
# 自动启动后台
supervisor

安装express-session
```

启动mongodb
终端输入：
```
 cd /usr/local/mongodb/mongodb-macos-x86_64-4.4.1/bin
 sudo ./mongod -f /usr/local/mongodb/etc/mongo.conf
```

pm2线上部署
pm2 stop /server/bin/www
pm2 start /server/bin/www
pm2 list
