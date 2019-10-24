let tableView = {
  tbody: document.getElementById('tableWrapper').querySelector('tbody'),
}
let tableModel = {
  html: '', // 将要更新的视图html
  loopCount: 1, // 合并行单元格时做判断用
}
let tableController = {
  triggerUpdate() { // 第5步，根据本地列表筛选item并生成html，
    sourceData.forEach(item => chainSelectBoth.passRequest(item)) // 内嵌了generateDOM函数
    return tableController.updateDOM()
  },
  generateDOM(item) { // 传入筛选后的item，并生成html
    let saleHTML = '',
      html = tableModel.html;
    item.sale.forEach(s => saleHTML += `<td>${s}</td>`)
    html = chainRegionListOne.passRequest({
      regionLength: checkboxModel.regionList.length,
      productLength: checkboxModel.productList.length,
      html, item, saleHTML
    })
    return tableModel.html = html;
  },
  handleMerge(l, html, item, saleHTML, name, bothOnlyOne) {
    let firstTdDOM = ''
    checkboxModel.loopCount === 1 && (firstTdDOM = `<td rowspan=${l}>${item[name]}</td>`);
    bothOnlyOne && (firstTdDOM = `<td>${item.product}</td>`);
    html += `
      <tr class="tr">
        ${firstTdDOM}
        <td>${item[`${name === 'region' ? 'product' : 'region'}`]}</td>
        ${saleHTML}
      </tr>
    `;
    checkboxModel.loopCount++;
    return html;
  },
  updateDOM() { // 最后一步，更新视图
    tableView.tbody.innerHTML = tableModel.html;
    checkboxModel.loopCount = 1;
    return tableModel.html = ''; // 更新后还原checkboxModel.html
  },
}
// table职责链节点函数
let chainMergeTrFn = {
  regionListOne({ regionLength, productLength, html, item, saleHTML }) {
    if (regionLength === 1 && productLength > 1) {
      return tableController.handleMerge(productLength, html, item, saleHTML, 'region')
    }
    return false;
  },
  productListOne({ regionLength, productLength, html, item, saleHTML }) {
    if (productLength === 1 && regionLength > 1) {
      return tableController.handleMerge(regionLength, html, item, saleHTML, 'product')
    }
    return false;
  },
  bothGreaterThanOne({ regionLength, productLength, html, item, saleHTML }) {
    if (regionLength > 1 && productLength > 1) {
      let l = regionLength;
      if (l < checkboxModel.loopCount) checkboxModel.loopCount = 1;
      return tableController.handleMerge(l, html, item, saleHTML, 'product')
    }
    return false;
  },
  bothOne({ regionLength, productLength, html, item, saleHTML }) {
    if (regionLength === 1 && productLength === 1) {
      return tableController.handleMerge(0, html, item, saleHTML, 'product', true)
    }
    return false;
  },
  nothingSelected() {
    return ''
  }
}
// table生成职责链
let chainRegionListOne = new Chain(chainMergeTrFn.regionListOne),
  chainProductListOne = new Chain(chainMergeTrFn.productListOne),
  chainBothGreaterThanOne = new Chain(chainMergeTrFn.bothGreaterThanOne),
  chainBothOne = new Chain(chainMergeTrFn.bothOne),
  chainNothingSelected = new Chain(chainMergeTrFn.nothingSelected);

chainRegionListOne
  .setNextSuccessor(chainProductListOne)
  .setNextSuccessor(chainBothGreaterThanOne)
  .setNextSuccessor(chainBothOne)
  .setNextSuccessor(chainNothingSelected);