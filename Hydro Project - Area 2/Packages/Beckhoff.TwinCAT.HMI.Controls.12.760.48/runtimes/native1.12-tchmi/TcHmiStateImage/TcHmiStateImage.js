var TcHmi,__classPrivateFieldGet=this&&this.__classPrivateFieldGet||function(receiver,state,kind,f){if("a"===kind&&!f)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof state?receiver!==state||!f:!state.has(receiver))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===kind?f:"a"===kind?f.call(receiver):f?f.value:state.get(receiver)};!function(TcHmi){!function(Controls){!function(Beckhoff){var _a,_TcHmiStateImage_tchmiFQN;class TcHmiStateImage extends TcHmi.Controls.System.TcHmiControl{constructor(element,pcElement,attrs){super(element,pcElement,attrs),this.__onResolverForStateListWatchCallback=data=>{!1===this.__isAttached&&this.__suspendObjectResolver("stateList"),data.error===TcHmi.Errors.NONE?tchmi_equal(data.value,this.__stateList)||(this.__stateList=data.value,TcHmi.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"StateList"}),this.__processStateList()):TCHMI_CONSOLE_LOG_LEVEL>=1&&TcHmi.Log.errorEx("[Source=Control, Module="+this.__type+(__classPrivateFieldGet(TcHmiStateImage,_a,"f",_TcHmiStateImage_tchmiFQN)!==this.__type?", Origin="+__classPrivateFieldGet(TcHmiStateImage,_a,"f",_TcHmiStateImage_tchmiFQN):"")+", Id="+this.getId()+", Attribute=StateList] Resolving symbols from object failed with error: "+TcHmi.Log.buildMessage(data.details))}}__previnit(){if(super.__previnit(),this.__elementImage=this.__element[0].getElementsByClassName("TcHmi_Controls_Beckhoff_TcHmiStateImage-image")[0],!this.__elementImage)throw new Error("Invalid Template.html")}__init(){super.__init()}__attach(){super.__attach(),this.__handleState()}__detach(){super.__detach()}destroy(){this.__keepAlive||super.destroy()}__displayCurrentState(iconpath){this.__elementImage.style.visibility=""===iconpath?"hidden":"visible",this.__elementImage.src=tchmi_path(iconpath)}__handleState(){if(this.__stateList)for(let v of this.__stateList){if(tchmi_equal(v.state,this.__state))return this.__displayCurrentState(v.stateIcon),void(TCHMI_DESIGNER&&null===this.__elementImage.parentElement&&(this.__element[0].innerHTML="",this.__element[0].append(this.__elementImage)));this.__fallbackImage?(this.__displayCurrentState(this.__fallbackImage),TCHMI_DESIGNER&&null===this.__elementImage.parentElement&&(this.__element[0].innerHTML="",this.__element[0].append(this.__elementImage))):(this.__displayCurrentState(""),TCHMI_DESIGNER&&(null!==this.__elementImage.parentElement&&this.__elementImage.remove(),this.__element[0].innerHTML="No configured fallbackImage.<br>Please add a fallback image for the case the current state is not defined in the state list."))}else this.__displayCurrentState(""),TCHMI_DESIGNER&&(null!==this.__elementImage.parentElement&&this.__elementImage.remove(),this.__element[0].innerHTML="No configured StateList.<br>Please add definitions for states.")}setStateList(valueNew){let convertedValue=TcHmi.ValueConverter.toObject(valueNew);null===convertedValue&&(convertedValue=this.getAttributeDefaultValueInternal("StateList"));let resolverInfo=this.__objectResolvers.get("stateList");resolverInfo&&(resolverInfo.watchDestroyer&&resolverInfo.watchDestroyer(),resolverInfo.resolver.destroy());let resolver=new TcHmi.Symbol.ObjectResolver(convertedValue,this);this.__objectResolvers.set("stateList",{resolver:resolver,watchCallback:this.__onResolverForStateListWatchCallback,watchDestroyer:resolver.watch(this.__onResolverForStateListWatchCallback)})}getStateList(){return this.__stateList}__processStateList(){this.__isAttached&&this.__handleState()}setState(valueNew){null===valueNew&&(valueNew=this.getAttributeDefaultValueInternal("State")),valueNew!==this.__state&&(this.__state=valueNew,TcHmi.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"State"}),this.__processState())}getState(){return this.__state}__processState(){this.__isAttached&&this.__handleState()}setFallbackImage(valueNew){let convertedValue=TcHmi.ValueConverter.toString(valueNew);null===convertedValue&&(convertedValue=this.getAttributeDefaultValueInternal("FallbackImage")),convertedValue!==this.__fallbackImage&&(this.__fallbackImage=convertedValue,TcHmi.EventProvider.raise(this.__id+".onPropertyChanged",{propertyName:"FallbackImage"}),this.__processFallbackImage())}getFallbackImage(){return this.__fallbackImage}__processFallbackImage(){this.__isAttached&&this.__handleState()}}_TcHmiStateImage_tchmiFQN={value:"TcHmi.Controls.Beckhoff."+(_a=TcHmiStateImage).name},Beckhoff.TcHmiStateImage=TcHmiStateImage}(Controls.Beckhoff||(Controls.Beckhoff={}))}(TcHmi.Controls||(TcHmi.Controls={}))}(TcHmi||(TcHmi={})),TcHmi.Controls.registerEx("TcHmiStateImage","TcHmi.Controls.Beckhoff",TcHmi.Controls.Beckhoff.TcHmiStateImage);