const express = require('express');

const cors = require('cors');

const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors());

const PORT = 8080;

app.use('/auth', createProxyMiddleware({
    target: 'http://auth-service:3003',
    changeOrigin: true
}));

app.use('/users', createProxyMiddleware({
    target: 'http://users-service:3001',
    changeOrigin: true
}));

app.use('/products', createProxyMiddleware({
    target: 'http://inventory-service:3002',
    changeOrigin: true
}));

app.use(
    '/clients',
    createProxyMiddleware({
        target: 'http://clients-service:3004',
        changeOrigin: true
    })
);

app.use(
    '/sales',
    createProxyMiddleware({
        target: 'http://sales-service:3005',
        changeOrigin: true
    })
);

app.listen(PORT, () => {
    console.log(`API Gateway ejecutándose en puerto ${PORT}`);
});