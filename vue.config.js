module.exports = {
    baseUrl: './',
    productionSourceMap: false,
    devServer: {
        host:'story-mapping-tool',
        proxy: {
            '/api':{
                target:'http://jsonplaceholder.typicode.com',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            },
            '/ms':{
                target: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
                changeOrigin: true
            },
            '/aop':{
                target:"http://120.79.21.168:8080",
                changeOrigin:true,
                pathRewrite: {
                    '^/aop': ''
                  }
            }
        }
    }
}