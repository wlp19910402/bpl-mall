let http = require('http')
let url = require('url')
let util = require('util')
let server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader("Content-Type", "text/plain;charset=utf-8");
  console.log(url.parse(req.url))
  res.end(`hello node.js   ,url: ${url.parse(req.url)},  util :${util.inspect(url.parse(req.url))}`)
})


server.listen(3009, '127.0.0.1', () => {
  console.log('服务器已经运行，请打开浏览器，输入 http://127.0.0.1:3009/   进行访问')
})
