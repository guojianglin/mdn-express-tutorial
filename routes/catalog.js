const express = require('express')
const router = express.Router()

// 导入控制器模块
const book_controller = require('../controllers/bookController');
const author_controller = require('../controllers/authorController');
const genre_controller = require('../controllers/genreController');
const book_instance_controller = require('../controllers/bookinstanceController');

/// 藏书路由 ///

// GET 获取藏书编目主页
router.get('/', book_controller.index);

// GET 请求添加新的藏书。注意此项必须位于显示藏书的路由（使用了 id）之前。
router.get('/book/create', book_controller.book_create_get);

// POST 请求添加新的藏书
router.post('/book/create', book_controller.book_create_post);

// GET 请求删除藏书
router.get('/book/:id/delete', book_controller.book_delete_get);

// POST 请求删除藏书
router.post('/book/:id/delete', book_controller.book_delete_post);

// GET 请求更新藏书
router.get('/book/:id/update', book_controller.book_update_get);

// POST 请求更新藏书
router.post('/book/:id/update', book_controller.book_update_post);

// GET 请求藏书
router.get('/book/:id', book_controller.book_detail);

// GET 请求完整藏书列表
router.get('/books', book_controller.book_list);

/// 藏书副本、藏书种类、作者的路由与藏书路由结构基本一致，只是无需获取主页 ///
// ==============================================
// GET 请求添加新的author。注意此项必须位于显示author的路由（使用了 id）之前。
router.get('/author/create', author_controller.author_create_get);

// POST 请求添加新的author
router.post('/author/create', author_controller.author_create_post);

// GET 请求删除author
router.get('/author/:id/delete', author_controller.author_delete_get);

// POST 请求删除author
router.post('/author/:id/delete', author_controller.author_delete_post);

// GET 请求更新author
router.get('/author/:id/update', author_controller.author_update_get);

// POST 请求更新author
router.post('/author/:id/update', author_controller.author_update_post);

// GET 请求author
router.get('/author/:id', author_controller.author_detail);

// GET 请求完整author列表
router.get('/authors', author_controller.author_list);
// ===============================================
// GET 请求添加新的genre。注意此项必须位于显示genre的路由（使用了 id）之前。
router.get('/genre/create', genre_controller.genre_create_get);

// POST 请求添加新的genre
router.post('/genre/create', genre_controller.genre_create_post);

// GET 请求删除genre
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST 请求删除genre
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET 请求更新genre
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST 请求更新genre
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET 请求genre
router.get('/genre/:id', genre_controller.genre_detail);

// GET 请求完整genre列表
router.get('/genres', genre_controller.genre_list);

// ====================================================
// GET 请求添加新的藏书bookinstance。注意此项必须位于显示藏书bookinstance的路由（使用了 id）之前。
router.get('/bookinstance/create', book_instance_controller.bookinstance_create_get);

// POST 请求添加新的藏书bookinstance
router.post('/bookinstance/create', book_instance_controller.bookinstance_create_post);

// GET 请求删除藏书bookinstance
router.get('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_get);

// POST 请求删除藏书bookinstance
router.post('/bookinstance/:id/delete', book_instance_controller.bookinstance_delete_post);

// GET 请求更新藏书bookinstance
router.get('/bookinstance/:id/update', book_instance_controller.bookinstance_update_get);

// POST 请求更新藏书bookinstance
router.post('/bookinstance/:id/update', book_instance_controller.bookinstance_update_post);

// GET 请求藏书bookinstance
router.get('/bookinstance/:id', book_instance_controller.bookinstance_detail);

// GET 请求完整藏书bookinstance列表
router.get('/bookinstances', book_instance_controller.bookinstance_list);

module.exports = router;