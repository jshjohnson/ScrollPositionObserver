class ScrollPositionObserver {
  constructor(target) {
    this._target = target;
    this._scrollPos = document.documentElement.scrollTop || 0;

    this._onScroll = this._onScroll.bind(this);
    this._onLoad = this._onLoad.bind(this);
    this._onDOMChange = this._onDOMChange.bind(this);

    this._observer = new MutationObserver(this._onDOMChange);
  }

  _addEventListeners() {
    window.addEventListener('scroll', this._onScroll);
    window.addEventListener('load', this._onLoad);
  }

  _removeEventListeners() {
    window.removeEventListener('scroll', this._onScroll);
    window.removeEventListener('load', this._onLoad);
  }

  _onLoad() {
    this._scrollPos = document.documentElement.scrollTop;
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
      const clientRect = addedNode.getBoundingClientRect();
      const distanceFromTop = this._scrollPos + clientRect.top;
      const wasAboveScrollPos =
        distanceFromTop <= this._scrollPos + clientRect.height;

      if (wasAboveScrollPos) {
        document.documentElement.scrollTop =
          this._scrollPos + clientRect.height + clientRect.x;
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
