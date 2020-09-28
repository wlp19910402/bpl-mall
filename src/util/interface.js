
//   let serverUrl = {
//   dev: 'http://jsxf-gateway-dev.devlb.jsxfedu.net',//开发环境
//   build: 'http://39.105.50.203:8082/dumall/api/',//正式环境
// }
export default process.env.NODE_ENV === 'production' ? 'http://39.105.50.203:8082/dumall/api/' : '/'
