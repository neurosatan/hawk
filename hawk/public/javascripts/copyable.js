/**
 * Copyable module allows you to add text to copy buffer by click
 * Just add 'js-copyable' name to element and call init method
 *
 * @usage
 * <span name='js-copyable'>Click to copy</span>
 *
 * You can pass callback function to init method. Callback will fire when something has copied
 *
 * @type {{init}}
 */
module.exports = function () {
  const NAMES = {
    copyable: 'js-copyable'
  };

  /**
   * Take element by name and pass it to prepareElement function
   *
   * @param {Function} copiedCallback - fires when something has copied
   */
  let init = function (copiedCallback) {
    let elems = document.getElementsByName(NAMES.copyable);

    if (!elems) {
      console.log('There are no copyable elements');
      return;
    }

    for (let i = 0; i < elems.length; i++) {
      prepareElement(elems[i], copiedCallback);
    }

    console.log('Copyable module initialized');
  };

  /**
   * Add click and copied listeners to copyable element
   *
   * @param element
   * @param copiedCallback
   */
  let prepareElement = function (element, copiedCallback) {
    element.addEventListener('click', elementClicked);
    element.addEventListener('copied', copiedCallback);
  };

  /**
   * Click handler
   * Create new range, select copyable element and add range to selection. Then exec 'copy' command
   */
  let elementClicked = function () {
    let selection = window.getSelection(),
      range     = document.createRange();

    range.selectNodeContents(this);
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand('copy');
    selection.removeAllRanges();

    /**
     * We create new CustomEvent and dispatch it on copyable element
     * Consist copied text in detail property
     */
    let CopiedEvent = new CustomEvent('copied', {
      bubbles: false,
      cancelable: false,
      detail: range.toString()
    });

    this.dispatchEvent(CopiedEvent);
  };

  return {
    init: init
  };
}();