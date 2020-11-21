# 这是 MDN 上面的 [node 框架express 的教程](https://developer.mozilla.org/zh-CN/docs/learn/Server-side/Express_Nodejs)，实现一个本地图书馆管理项目。
> 课程采用了服务端渲染，渲染模板引擎是pug, 数据库是mongoDB, 实现了增删改查。

## 这个教程的编写是2016年，我练习时间是2020年，以下记录我在跟着教程走时遇到的问题

- 课程在[Express 教程 5: 呈现图书馆数据 > 使用 async 进行非同步流控制](https://developer.mozilla.org/zh-CN/docs/Learn/Server-side/Express_Nodejs/Displaying_data/flow_control_using_async)使用 async 进行非同步流控制用处理异步事件的时候，用的是[async](https://caolan.github.io/async/v3/),但是现在基本可以使用原生的promise + async 了， 方便后面继续跟着教程走，就不做修改了。

- 课程在[Express 教程 6: 使用表单](https://developer.mozilla.org/zh-CN/docs/Learn/Server-side/Express_Nodejs/forms) 使用 express-validator 的时候，用的引入方式被废弃了，不建议使用。

课程引入方式如下：
```js
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
```
根据提示，现在建议使用的引入方式如下：
```js
const { body,validationResult, sanitizeBody } = require("express-validator")
```

- 旧的版本 express-validator 不支持在验证的时候转义请求的body数据，但是现在可以了，不用再分开 body 和 sannitizeBody 两部分走了 

- 在 [Express 教程 6: 使用表单 > 创建书本表单](https://developer.mozilla.org/zh-CN/docs/Learn/Server-side/Express_Nodejs/forms/Create_book_form) 这一节中，代码并没有处理 “用户不选择书本种类的情况”，导致写入数据库报错。(更新书本表单也是)

原教程代码如下（/controllers/bookController.js）：
```js
exports.book_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),
  
    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),
    sanitizeBody('genre.*').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var book = new Book(
          { title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('book_form', { title: 'Create Book',authors:results.authors, genres:results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            book.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.redirect(book.url);
                });
        }
    }
];
```

添加了无选择 书本种类 情况的容错后代码如下（[express-validador 自定义验证](https://express-validator.github.io/docs/custom-validators-sanitizers.html)）
```js
  
  // Validate fields.
  body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
  body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
  body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),
  // 在这一部分添加多一个自定义验证
  body('genre').custom(value => {
    if (!value.length) {
      return Promise.reject('Must select a genre')
    } 
    return true
  }),
```