class Chain {
  constructor(fn) {
    this.fn = fn;
  }
  setNextSuccessor(nextSuccessor) {
    return this.nextSuccessor = nextSuccessor;
  }
  passRequest() {
    let ret = this.fn.apply(this, arguments)
    if (ret === false) return this.nextSuccessor && this.nextSuccessor.passRequest.apply(this.nextSuccessor, arguments);
    return ret;
  }
}