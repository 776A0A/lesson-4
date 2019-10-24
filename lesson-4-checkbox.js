let checkboxView = {
  regionCheckboxWrapper: document.getElementById('regionCheckbox'),
  productCheckboxWrapper: document.getElementById('productCheckbox'),
  regionDOMLists: [...document.querySelectorAll('#regionCheckbox input')],
  productDOMLists: [...document.querySelectorAll('#productCheckbox input')],
  regionAllSelect: document.getElementById('regionAllSelect'),
  productAllSelect: document.getElementById('productAllSelect')
}
let checkboxModel = {
  regionList: ['华东'], // 已选的地区
  productList: [], // 已选的商品
  getLowercaseName(elem) {
    let regExp = new RegExp(/(.*)[A-Z]/);
    return regExp.exec(elem.name)[1];
  },
}
let checkboxController = {
  bindEvent({ dom, callback, type = 'click' }, ...rest) { // 第1步，绑定事件
    dom.addEventListener(type, e => callback.call(e.target, e, ...rest))
  },
  handleCheckboxClickEvent(e) { // 第2步，根据不同name传入不同的参数
    let elem = e.target;
    if (elem.tagName.toLowerCase() !== 'input') return; // 会先点到label上，是label就返回
    let name = checkboxModel.getLowercaseName(elem);
    let params = {
      value: elem.value,
      list_1: `${name}List`,
      list_2: `${name === 'region' ? 'product' : 'region'}List`,
    }
    if (!checkboxController.checkValidate.call(elem, e, params)) return; // 检测是否只选择了一个
    checkboxModel[`${name}List`] = checkboxController.updateSelectedList(checkboxView[`${name}DOMLists`]); // 更新本地选择列表
    checkboxController.allSelect(checkboxView[`${name}DOMLists`], checkboxView[`${name}AllSelect`]) // 处理全选
    tableController.triggerUpdate()
  },
  checkValidate(e, { value, list_1, list_2 }) { // 第3步，检测是否能够更新列表，如果两个列表中只有一个数据，则阻止默认事件
    if (checkboxModel[list_1].length === 1 && checkboxModel[list_1].includes(value) && checkboxModel[list_2].length === 0) {
      return e.preventDefault()
    }
    return true;
  },
  updateSelectedList(dom) { // 第4步，更新本地被选列表
    let arr = dom.filter(item => item.checked);
    return arr.map(item => item.value)
  },
  allSelect(dom, allSelectDom) {
    let a = dom.every(item => item.checked);
    allSelectDom.checked = a ? true : false;
  },
  handleAllSelectClicked(e) {
    let elem = e.target;
    if (!elem.checked) return elem.checked = true;
    let name = checkboxModel.getLowercaseName(elem)
    let unclickedInputList = checkboxView[`${name}DOMLists`].filter(item => !item.checked); // 获取未选的checkbox列表
    unclickedInputList.length !== 0 && unclickedInputList.forEach(item => item.click()) // 点击未选checkbox
  },
}
// checkbox职责链节点函数
let chainSelectCheckboxFn = {
  bothSelect(item) {
    if (checkboxModel.regionList.includes(item.region) && checkboxModel.productList.includes(item.product)) return tableModel.html = tableController.generateDOM(item);
    return false;
  },
  selectRegion(item) {
    if (checkboxModel.regionList.includes(item.region) && !checkboxModel.productList.length) return tableModel.html = tableController.generateDOM(item);
    return false;
  },
  selectProduct(item) {
    if (checkboxModel.productList.includes(item.product) && !checkboxModel.regionList.length) return tableModel.html = tableController.generateDOM(item);
    return false;
  }
}
// checkbox生成职责链
let chainSelectBoth = new Chain(chainSelectCheckboxFn.bothSelect),
  chainSelectRegion = new Chain(chainSelectCheckboxFn.selectRegion),
  chainSelectProduct = new Chain(chainSelectCheckboxFn.selectProduct);
chainSelectBoth
  .setNextSuccessor(chainSelectRegion)
  .setNextSuccessor(chainSelectProduct);