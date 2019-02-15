class KeepMyScrollPosition {
  constructor(target) {
    this.target = target;
    this.windowHeight = document.documentElement.scrollHeight;
    this.scrollPos = document.documentElement.scrollTop || 0;

    this.onScroll = this.onScroll.bind(this);
    this.onDOMChange = this.onDOMChange.bind(this);
    this.observer = new MutationObserver(this.onDOMChange);

    this.addEventListeners();
  }

  addEventListeners() {
    window.addEventListener('scroll', this.onScroll);
  }

  removeEventListeners() {
    window.removeEventListener('scroll', this.onScroll);
  }

  onScroll() {
    this.scrollPos = document.documentElement.scrollTop;
  }

  onDOMChange() {
    const prevWindowHeight = this.windowHeight;
    const newWindowHeight = document.documentElement.scrollHeight;
    const differenceInWindowHeight = newWindowHeight - prevWindowHeight;
    const newScrollPos = this.scrollPos + differenceInWindowHeight;

    document.documentElement.scrollTop = newScrollPos;
  }

  observe() {
    this.observer.observe(this.target, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });
  }
}

module.exports = KeepMyScrollPosition;
