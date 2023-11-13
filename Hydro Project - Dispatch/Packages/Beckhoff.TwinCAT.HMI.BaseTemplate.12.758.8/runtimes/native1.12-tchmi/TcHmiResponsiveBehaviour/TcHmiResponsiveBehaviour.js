var TcHmi;!function(TcHmi){!function(Functions){!function(BaseTemplate){function ResponsiveBehaviour(mediaQueries,affectedControls){let width=document.documentElement.clientWidth;void 0===ResponsiveBehaviour.currentMediaQuery&&(ResponsiveBehaviour.currentMediaQuery="0");let newMediaQuery=null,currentMediaQuery=ResponsiveBehaviour.currentMediaQuery,returnName=currentMediaQuery.name;if(mediaQueries&&mediaQueries.length&&mediaQueries.length>0)for(let media of mediaQueries){if(media.minWidth<=width&&media.maxWidth>width){newMediaQuery=media;break}(null===newMediaQuery||newMediaQuery.maxWidth<media.maxWidth)&&(newMediaQuery=media)}return newMediaQuery&&newMediaQuery.name!==currentMediaQuery.name&&(resetMediaQuery(currentMediaQuery,affectedControls),runMediaQuery(newMediaQuery,affectedControls),ResponsiveBehaviour.currentMediaQuery=newMediaQuery,returnName=newMediaQuery.name),returnName}BaseTemplate.ResponsiveBehaviour=ResponsiveBehaviour,ResponsiveBehaviour.currentMediaQuery=new Object;let runMediaQuery=function(mediaQuery,affectedList){if(null==mediaQuery?void 0:mediaQuery.controlBehaviourList)for(let control of mediaQuery.controlBehaviourList){let controlInstance=TcHmi.Controls.get(control.controlID);if(controlInstance)switch(control.displayOption){case"full":break;case"icons":controlInstance.setWidth(65);break;case"burger_top":case"burger_bottom":activateBurgerMenu(control,affectedList)}}},resetMediaQuery=function(mediaQuery,affectedList){if(null==mediaQuery?void 0:mediaQuery.controlBehaviourList)for(let control of mediaQuery.controlBehaviourList){let controlInstance=TcHmi.Controls.get(control.controlID);if(controlInstance)switch(control.displayOption){case"full":break;case"icons":let affectedControlInstance=findControlById(affectedList,null==control?void 0:control.controlID);""===(null==affectedControlInstance?void 0:affectedControlInstance.defaultWidth)?controlInstance.setWidth(null):controlInstance.setWidth(null==affectedControlInstance?void 0:affectedControlInstance.defaultWidth);break;case"burger_top":case"burger_bottom":deactivateBurgerMenu(control,affectedList)}}},getAffectedControls=function(originControl,affectedList){let newList=[],foundOriginControl=!1;for(let i=0;i<affectedList.length;i++)if(foundOriginControl)switch(originControl.position){case"Top":case"Bottom":"Center"!==affectedList[i].position&&"Right"!==affectedList[i].position&&"Left"!==affectedList[i].position||newList.push(affectedList[i]);break;case"Left":case"Right":"Center"!==affectedList[i].position&&"Top"!==affectedList[i].position&&"Bottom"!==affectedList[i].position||newList.push(affectedList[i])}else affectedList[i].controlID===originControl.controlID&&(foundOriginControl=!0);return newList.length>0?newList:null},findControlById=function(affectedList,controlID){for(let i=0;i<affectedList.length;i++)if(affectedList[i].controlID===controlID)return affectedList[i];return null},findControlByPosition=function(affectedList,position){for(let i=0;i<affectedList.length;i++)if(affectedList[i].position===position)return affectedList[i];return null},activateBurgerMenu=function(controlBehaviour,affectedList){let burgerControlContainer,burgerControl,targetControl=findControlById(affectedList,controlBehaviour.controlID);if(!targetControl)return;let targetControlInstance=TcHmi.Controls.get(targetControl.controlID);if(!targetControlInstance)return;if(void 0===TcHmi.Controls.get(targetControl.controlID+"_burgerMenuContainer"))burgerControlContainer=TcHmi.ControlFactory.create("TcHmi.Controls.System.TcHmiContainer",targetControl.controlID+"_burgerMenuContainer",targetControlInstance.getParent()),burgerControlContainer&&(burgerControlContainer.setWidth(80),burgerControlContainer.setHeight(80),burgerControlContainer.setClassNames(["divider"]));else{burgerControlContainer=TcHmi.Controls.get(targetControl.controlID+"_burgerMenuContainer"),targetControlInstance.getParent().getElement()[0].appendChild(burgerControlContainer.getElement()[0])}if(!burgerControlContainer)return;if(void 0===TcHmi.Controls.get(targetControl.controlID+"_burgerMenuButton")?(burgerControl=TcHmi.ControlFactory.create("TcHmi.Controls.BaseTemplate.TcHmiBurgerMenu",targetControl.controlID+"_burgerMenuButton",burgerControlContainer),burgerControl&&(burgerControl.setWidth(48),burgerControl.setHeight(48),burgerControl.setLeft(16),burgerControl.setTop(16))):burgerControl=TcHmi.Controls.get(targetControl.controlID+"_burgerMenuButton"),!burgerControl)return;burgerControl.setTargetControl(targetControlInstance),burgerControlContainer.setVisibility("Visible");let otherControls=getAffectedControls(targetControl,affectedList);switch(targetControl.position){case"Left":if(otherControls)for(let control of otherControls){let controlInstance=TcHmi.Controls.get(control.controlID);controlInstance&&(TcHmi.Binding.exists("Left",controlInstance)&&TcHmi.Binding.removeEx2("","Left",controlInstance),controlInstance.setLeft(0))}switch(burgerControlContainer.setLeft(0),controlBehaviour.displayOption){case"burger_bottom":burgerControlContainer.setBottom(0),burgerControlContainer.setTop(null),burgerControlContainer.setClassNames(["divider","divider-bottom"]);let bottomControl=findControlByPosition(affectedList,"Bottom");if(bottomControl){let bottomControlInstance=TcHmi.Controls.get(bottomControl.controlID);bottomControlInstance&&(TcHmi.Binding.exists("Left",bottomControlInstance)&&TcHmi.Binding.removeEx2("","Left",bottomControlInstance),bottomControlInstance.setLeft(80))}break;case"burger_top":burgerControlContainer.setTop(0),burgerControlContainer.setClassNames(["divider","divider-top"]);let topControl=findControlByPosition(affectedList,"Top");if(topControl){let topControlInstance=TcHmi.Controls.get(topControl.controlID);topControlInstance&&(TcHmi.Binding.exists("Right",topControlInstance)&&TcHmi.Binding.removeEx2("","Right",topControlInstance),topControlInstance.setLeft(80))}}break;case"Right":if(otherControls)for(let control of otherControls){let controlInstance=TcHmi.Controls.get(control.controlID);controlInstance&&(TcHmi.Binding.exists("Right",controlInstance)&&TcHmi.Binding.removeEx2("","Right",controlInstance),controlInstance.setRight(0))}switch(burgerControlContainer.setRight(0),controlBehaviour.displayOption){case"burger_bottom":burgerControlContainer.setBottom(0),burgerControlContainer.setTop(null),burgerControlContainer.setClassNames(["divider","divider-bottom"]);let bottomControl=findControlByPosition(affectedList,"Bottom");if(bottomControl){let bottomControlInstance=TcHmi.Controls.get(bottomControl.controlID);bottomControlInstance&&(TcHmi.Binding.exists("Right",bottomControlInstance)&&TcHmi.Binding.removeEx2("","Right",bottomControlInstance),bottomControlInstance.setRight(80))}break;case"burger_top":burgerControlContainer.setTop(0),burgerControlContainer.setClassNames(["divider","divider-top"]);let topControl=findControlByPosition(affectedList,"Top");if(topControl){let topControlInstance=TcHmi.Controls.get(topControl.controlID);topControlInstance&&(TcHmi.Binding.exists("Right",topControlInstance)&&TcHmi.Binding.removeEx2("","Right",topControlInstance),topControlInstance.setRight(80))}}}},deactivateBurgerMenu=function(controlBehaviour,affectedList){let targetControl=findControlById(affectedList,controlBehaviour.controlID);if(!targetControl)return;if(!TcHmi.Controls.get(targetControl.controlID))return;let burgerControl=TcHmi.Controls.get(targetControl.controlID+"_burgerMenuButton");if(!burgerControl)return;let burgerControlContainer=TcHmi.Controls.get(targetControl.controlID+"_burgerMenuContainer");if(!burgerControlContainer)return;let targetControlParent=burgerControlContainer.getElement()[0].parentElement;if(!targetControlParent)return;burgerControl.setTargetControl(null),targetControlParent.removeChild(burgerControlContainer.getElement()[0]);let otherControls=getAffectedControls(targetControl,affectedList);if(otherControls)switch(targetControl.position){case"Left":if(otherControls)for(let control of otherControls){let controlInstance=TcHmi.Controls.get(control.controlID);controlInstance&&(TcHmi.Binding.exists("Left",controlInstance)&&TcHmi.Binding.removeEx2("","Left",controlInstance),TcHmi.Symbol.isSymbolExpression(control.defaultLeft)?TcHmi.Binding.createEx(control.defaultLeft,"setLeft",controlInstance):""===control.defaultLeft?controlInstance.setLeft(null):controlInstance.setLeft(control.defaultLeft))}switch(controlBehaviour.displayOption){case"burger_bottom":let bottomControl=findControlByPosition(affectedList,"Bottom");if(bottomControl){let bottomControlInstance=TcHmi.Controls.get(bottomControl.controlID);bottomControlInstance&&(TcHmi.Binding.exists("Left",bottomControlInstance)&&TcHmi.Binding.removeEx2("","Left",bottomControlInstance),TcHmi.Symbol.isSymbolExpression(bottomControl.defaultLeft)?TcHmi.Binding.createEx(bottomControl.defaultLeft,"setLeft",bottomControlInstance):""===bottomControl.defaultLeft?bottomControlInstance.setLeft(null):bottomControlInstance.setLeft(bottomControl.defaultLeft))}break;case"burger_top":let topControl=findControlByPosition(affectedList,"Top");if(topControl){let topControlInstance=TcHmi.Controls.get(topControl.controlID);topControlInstance&&(TcHmi.Binding.exists("Left",topControlInstance)&&TcHmi.Binding.removeEx2("","Left",topControlInstance),TcHmi.Symbol.isSymbolExpression(topControl.defaultLeft)?TcHmi.Binding.createEx(topControl.defaultLeft,"setLeft",topControlInstance):""===topControl.defaultLeft?topControlInstance.setLeft(null):topControlInstance.setLeft(topControl.defaultLeft))}}break;case"Right":if(otherControls)for(let control of otherControls){let controlInstance=TcHmi.Controls.get(control.controlID);controlInstance&&(TcHmi.Binding.exists("Right",controlInstance)&&TcHmi.Binding.removeEx2("","Right",controlInstance),TcHmi.Symbol.isSymbolExpression(control.defaultRight)?TcHmi.Binding.createEx(control.defaultRight,"setRight",controlInstance):""===control.defaultRight?controlInstance.setRight(null):controlInstance.setRight(control.defaultRight))}switch(controlBehaviour.displayOption){case"burger_bottom":let bottomControl=findControlByPosition(affectedList,"Bottom");if(bottomControl){let bottomControlInstance=TcHmi.Controls.get(bottomControl.controlID);bottomControlInstance&&(TcHmi.Binding.exists("Right",bottomControlInstance)&&TcHmi.Binding.removeEx2("","Right",bottomControlInstance),TcHmi.Symbol.isSymbolExpression(bottomControl.defaultRight)?TcHmi.Binding.createEx(bottomControl.defaultRight,"setRight",bottomControlInstance):""===bottomControl.defaultRight?bottomControlInstance.setRight(null):bottomControlInstance.setRight(bottomControl.defaultRight))}break;case"burger_top":let topControl=findControlByPosition(affectedList,"Top");if(topControl){let topControlInstance=TcHmi.Controls.get(topControl.controlID);topControlInstance&&(TcHmi.Binding.exists("Right",topControlInstance)&&TcHmi.Binding.removeEx2("","Right",topControlInstance),TcHmi.Symbol.isSymbolExpression(topControl.defaultRight)?TcHmi.Binding.createEx(topControl.defaultRight,"setRight",topControlInstance):""===topControl.defaultRight?topControlInstance.setRight(null):topControlInstance.setRight(topControl.defaultRight))}}}}}(Functions.BaseTemplate||(Functions.BaseTemplate={}))}(TcHmi.Functions||(TcHmi.Functions={}))}(TcHmi||(TcHmi={})),TcHmi.Functions.registerFunctionEx("TcHmiResponsiveBehaviour","TcHmi.Functions.BaseTemplate",TcHmi.Functions.BaseTemplate.ResponsiveBehaviour);