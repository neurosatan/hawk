/**
 * Twig extensions
 * @type {*}
 */

let twig = require('twig'),
  fs = require('fs');


module.exports = function () {
  /**
   * Function for include svg on page
   *
   * @usage svg('path/from/root/dir)
   *
   * @param path - path from project root dir
   *
   * TODO: location independence
   *
   * @returns {String} - svg code
   *
   */
  twig.extendFunction('svg', function (path) {
    return fs.readFileSync(__dirname + '/..' + path, 'utf-8');
  });


  /**
   * Function for getting
   *
   * @usage svg('path/from/root/dir)
   *
   * @param path - path from project root dir
   *
   * TODO: location independence
   *
   * @returns {String} - svg code
   *
   */
  twig.extendFilter('event-type', function (eventTag) {
    switch (eventTag) {
      case 'fatal':
        return 'Fatal Error';
        break;
      case 'warnings':
        return 'Warning';
        break;
      case 'notice':
        return 'Notice';
        break;
      case 'javascript':
        return 'JavaScript Error';
        break;
    }
  });
}();
