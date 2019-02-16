class ScrollPositionObserver {
  constructor(target) {
    this._target = target;
    this._scrollPos = document.documentElement.scrollTop || 0;

    this._onScroll = this._onScroll.bind(this);
    this._onDOMChange = this._onDOMChange.bind(this);

    this._observer = new MutationObserver(this._onDOMChange);
  }

  _addEventListeners() {
    window.addEventListener('scroll', this._onScroll);
  }

  _removeEventListeners() {
    window.removeEventListener('scroll', this._onScroll);
  }

  _onScroll() {
    this._scrollPos = document.documentElement.scrollTop;
  }

  _disconnect() {
    this._observer.disconnect();
  }

  _onDOMChange(mutations) {
    mutations.forEach(mutation => {
      const [addedNode] = mutation.addedNodes;
      const prevScrollPos = this._scrollPos;

      let newScrollPos;
      const {
        offsetHeight: heightOfAddedNode,
        offsetTop: offsetOfAddedNode,
      } = addedNode;

      const wasAboveScrollPos =
        offsetOfAddedNode - heightOfAddedNode < this._scrollPos;

      if (wasAboveScrollPos) {
        /*
          If we haven't scrolled yet and there is an offset
          we need to also add the offset to avoid a jump.
          
          The offset is the space between the top of the page
          and the element
          
          _______________________
          |       Offset        |
          |  __________________ |
          | |                 | |
          | |                 | |
        */

        if (prevScrollPos === 0 && offsetOfAddedNode) {
          newScrollPos =
            this._scrollPos + heightOfAddedNode + offsetOfAddedNode;
        } else {
          newScrollPos = this._scrollPos + heightOfAddedNode;
        }

        this._scrollPos = newScrollPos;
      }

      if (prevScrollPos !== newScrollPos) {
        document.documentElement.scrollTop = this._scrollPos;
      }
    });
  }

  _observe() {
    this._observer.observe(this._target, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
  }

  start() {
    this._addEventListeners();
    this._observe();
  }

  stop() {
    this._removeEventListeners();
    this._disconnect();
  }
}

module.exports = ScrollPositionObserver;
