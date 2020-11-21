const BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
const { body, validationResult, sanitizeBody } = require('express-validator');
var async = require('async');

// 显示完整的书本实例列表
exports.bookinstance_list = (req, res, next) => { 
  BookInstance.find()
  .populate('book')
  .exec(function (err, list_bookinstances) {
    if (err) { return next(err); }
    // Successful, so render
    res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
  });
};

// 为每位书本实例显示详细信息的页面
exports.bookinstance_detail = (req, res, next) => { 
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
      if (err) { return next(err); }
      if (bookinstance == null) { // No results.
        var err = new Error('Book copy not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('bookinstance_detail', { title: 'Book:', bookinstance: bookinstance });
    })
};

// 由 GET 显示创建书本实例的表单
exports.bookinstance_create_get = (req, res, next) => { 
  Book.find({},'title')
  .exec(function (err, books) {
    if (err) { return next(err); }
    // Successful, so render.
    res.render('bookinstance_form', {title: 'Create BookInstance', book_list:books});
  });
};

// 由 POST 处理书本实例创建操作
exports.bookinstance_create_post = [

  // Validate fields.
  body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
  body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
  body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

  // Sanitize fields.
  sanitizeBody('book').trim().escape(),
  sanitizeBody('imprint').trim().escape(),
  sanitizeBody('status').trim().escape(),
  sanitizeBody('due_back').toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data.
    var bookinstance = new BookInstance(
      {
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back
      });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values and error messages.
      Book.find({}, 'title')
        .exec(function (err, books) {
          if (err) { return next(err); }
          // Successful, so render.
          res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id, errors: errors.array(), bookinstance: bookinstance });
        });
      return;
    }
    else {
      // Data from form is valid.
      bookinstance.save(function (err) {
        if (err) { return next(err); }
        // Successful - redirect to new record.
        res.redirect(bookinstance.url);
      });
    }
  }
];

// 由 GET 显示删除书本实例的表单
exports.bookinstance_delete_get = (req, res, next) => { 
  BookInstance.findById(req.params.id)
  .populate('book')
  .exec(function (err, bookinstance) {
    if (err) { return next(err); }
    if (bookinstance == null) { // No results.
      res.redirect('/catalog/bookinstances');
    }
    // Successful, so render
    res.render('bookinstance_delete', { title: 'Delete Book Instance', bookinstance });
  });
};

// 由 POST 处理书本实例删除操作
exports.bookinstance_delete_post = (req, res, next) => { 
  BookInstance.findByIdAndRemove(req.body.bookinstanceid, function deleteBookInstance(err) {
    if (err) { return next(err); }
    // Success - go to author list
    res.redirect('/catalog/bookinstances')
  })
};

// 由 GET 显示更新书本实例的表单
exports.bookinstance_update_get = (req, res) => { 
  async.parallel({
    bookinstance: function (callback) {
      BookInstance.findById(req.params.id).populate('book').exec(callback);
    },
    books: function (callback) {
      Book.find(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }
    if (results.bookinstance == null) { // No results.
      var err = new Error('Book not found');
      err.status = 404;
      return next(err);
    }
    // Success.
    res.render('bookinstance_form', { title: 'Update Book Instance', book_list: results.books, bookinstance: results.bookinstance });
  });
};

// 由 POST 处理书本实例更新操作
exports.bookinstance_update_post = [

  // Validate fields.
  body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
  body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
  body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

  // Sanitize fields.
  sanitizeBody('book').trim().escape(),
  sanitizeBody('imprint').trim().escape(),
  sanitizeBody('status').trim().escape(),
  sanitizeBody('due_back').toDate(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a BookInstance object with escaped and trimmed data.
    var bookinstance = new BookInstance(
      {
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back,
        _id: req.params.id
      });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values and error messages.
      async.parallel({
        bookinstance: function (callback) {
          BookInstance.findById(req.params.id).populate('book').exec(callback);
        },
        books: function (callback) {
          Book.find(callback);
        },
      }, function (err, results) {
        if (err) { return next(err); }
        if (results.bookinstance == null) { // No results.
          var err = new Error('Book not found');
          err.status = 404;
          return next(err);
        }
        // Success.
        res.render('bookinstance_form', { title: 'Update Book Instance', book_list: results.books, bookinstance: results.bookinstance, errors: errors.array() });
      });
      return;
    }
    else {
      // Data from form is valid.
      BookInstance.findByIdAndUpdate(req.params.id, bookinstance, function (err, theInstance) {
        if (err) { return next(err); }
        // Successful - redirect to new record.
        res.redirect(theInstance.url);
      });
    }
  }
];