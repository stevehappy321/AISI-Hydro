// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
function deleteBindings(materialType, elementsArr) {
    for (let i = 0; i < elementsArr.length; i++) {
        if (elementsArr[i]) {
            console.log(`unbinding ` + elementsArr[i].getId());

            //unbind everything regardless of type
            unbindPositionRotations(materialType, elementsArr[i]);
            unbindInterval(materialType, elementsArr[i]);
            unbindInterval(materialType, elementsArr[i]);

            unbindPosition(materialType, elementsArr[i]);
            unbindTop(materialType, elementsArr[i]);
            unbindSides(materialType, elementsArr[i]);
            unbindCorners(materialType, elementsArr[i]);

            unbindWrap(materialType, elementsArr[i]);
        }
    }
}

function unbindWrap(materialType, element) {
    TcHmi.Binding.removeEx2('Value', TcHmi.Controls.get(element.getId() + `.${materialType}NumWrapPoints`));
    TcHmi.Binding.removeEx2('Value', TcHmi.Controls.get(element.getId() + `.${materialType}NumWrapRotations`));
}

function unbindPositionRotations(materialType, element) {
    TcHmi.Binding.removeEx2('Value', TcHmi.Controls.get(element.getId() + `.${materialType}Position`));
    TcHmi.Binding.removeEx2('Value', TcHmi.Controls.get(element.getId() + `.${materialType}Rotations`));
}
function unbindInterval(materialType, element) {
    TcHmi.Binding.removeEx2('Value', TcHmi.Controls.get(element.getId() + `.PaperStart`));
    TcHmi.Binding.removeEx2('Value', TcHmi.Controls.get(element.getId() + `.PaperEnd`));
}
function unbindPosition(materialType, element) {
    TcHmi.Binding.removeEx2('Value', TcHmi.Controls.get(element.getId() + `.${materialType}Position`));
}
function unbindTop(materialType, element) {
    TcHmi.Binding.removeEx2('Text', TcHmi.Controls.get(element.getId() + `.${materialType}Top`));
}
function unbindSides(materialType, element) {
    TcHmi.Binding.removeEx2('Text', TcHmi.Controls.get(element.getId() + `.${materialType}Left`));
    TcHmi.Binding.removeEx2('Text', TcHmi.Controls.get(element.getId() + `.${materialType}Right`));
}
function unbindBottom(materialType, element) {
    TcHmi.Binding.removeEx2('Text', TcHmi.Controls.get(element.getId() + `.${materialType}Bottom`));
}
function unbindCorners(materialType, element) {
    TcHmi.Binding.removeEx2('Text', TcHmi.Controls.get(element.getId() + `.${materialType}TopLeft`));
    TcHmi.Binding.removeEx2('Value', TcHmi.Controls.get(element.getId() + `.${materialType}TopLeftFold`));

    TcHmi.Binding.removeEx2('Text', TcHmi.Controls.get(element.getId() + `.${materialType}TopRight`));
    TcHmi.Binding.removeEx2('Value', TcHmi.Controls.get(element.getId() + `.${materialType}TopRightFold`));

    TcHmi.Binding.removeEx2('Text', TcHmi.Controls.get(element.getId() + `.${materialType}BottomLeft`));
    TcHmi.Binding.removeEx2('Value', TcHmi.Controls.get(element.getId() + `.${materialType}BottomLeftFold`));

    TcHmi.Binding.removeEx2('Text', TcHmi.Controls.get(element.getId() + `.${materialType}BottomRight`));
    TcHmi.Binding.removeEx2('Value', TcHmi.Controls.get(element.getId() + `.${materialType}BottomRightFold`));
}