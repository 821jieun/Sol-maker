'use strict';
exports.MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/Sol-maker';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-Sol-maker';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'one_small_potato_please';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
