let http = require('http')
let url = require('url')
let util = require('util')
let fs = require('fs')
let Server = http.createServer((req, res) => {
  // res.statusCode = 200
  // res.setHeader('Content-Type', 'text/plain;charset=utf-8')
  // res.end(`hello xiaoming ${util.inspect(url.parse(req.url))}`)
  let pathname = url.parse(req.url).pathname
  fs.readFile(pathname.substring(1), (err, data) => {
    if (err) {
      res.writeHead(404, {
        'Content-Type': 'text/html'
      });
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      console.log(data.toString())
      res.write(data.toString());
    }
    res.end()
  })
})
Server.listen('8083', '127.0.0.1', () => {
  console.log('服务器已经运行，请打开浏览器，输入 http://127.0.0.1:8083/   进行访问')
})
