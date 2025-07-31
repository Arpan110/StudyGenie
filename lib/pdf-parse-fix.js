// Custom wrapper for pdf-parse to prevent test file access during build
const Pdf = require('pdf-parse/lib/pdf-parse.js');

module.exports = Pdf;