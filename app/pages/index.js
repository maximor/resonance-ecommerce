module.exports = function (app) {
    require('./home/home') (app);
    require('./product/product') (app);
    require('./login-register/login-register') (app);
    require('./cart/cart') (app);
    require('./shop/shop') (app);
    require('./my-orders/my-orders') (app);
}