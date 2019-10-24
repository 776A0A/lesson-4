// 绑定事件
checkboxController.bindEvent({ dom: checkboxView.regionCheckboxWrapper, callback: checkboxController.handleCheckboxClickEvent })
checkboxController.bindEvent({ dom: checkboxView.productCheckboxWrapper, callback: checkboxController.handleCheckboxClickEvent })
checkboxController.bindEvent({ dom: checkboxView.regionAllSelect, callback: checkboxController.handleAllSelectClicked })
checkboxController.bindEvent({ dom: checkboxView.productAllSelect, callback: checkboxController.handleAllSelectClicked })
