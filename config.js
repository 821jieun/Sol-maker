'use strict';
exports.MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/a-little-sol';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-a-little-sol';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'one_small_potato_please';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
