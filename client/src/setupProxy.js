const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        ["/data","/case","/graph","/timeline"],
    createProxyMiddleware({
        target: 'http://172.25.0.6:5000',
        changeOrigin: true,
    })
    );
    app.use(
    '/tools',
    createProxyMiddleware({
        target: 'http://172.25.0.3:5000',
        changeOrigin: true,
    })
    );
};