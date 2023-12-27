// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../../RecipeHMI/RecipeHMI/Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function recoverBindings(materialType, elementsArr) {
    let bindingFrom;
    let bindingTo;
    let arrBindingTo = [];
    /*
    switch (materialType) { //switch is placed in loop to check validity of each array item
        case 'TopPaper':
            arrBindingTo = TopPaperElements;
            break;
        case 'SidesPaper':
            arrBindingTo = SidesPaperElements;
            break;
        case 'BottomPaper':
            arrBindingTo = BottomPaperElements;
            break;

        case 'Cardboard':
            arrBindingTo = CardboardElements;
            break;
        case 'CornerGuard':
            arrBindingTo = CornerGuardElements;
            break;
        case 'Chipboard':
            arrBindingTo = ChipboardElements;
            break;
        case 'WoodBunk':
            arrBindingTo = WoodBunkElements;
            break;
    }
    */

    for (let i = 0; i < elementsArr.length; i++) { //iterate through array of elements
        if (elementsArr[i]) { //if element exists, bind its elements
            bindingFrom = `PLC1.StrapWrapRecipe.${materialType}[${i}]`;
            bindingTo = elementsArr[i];

            console.log(`binding
                ${bindingFrom}
                to
                ${bindingTo.getId()}`);

            if (materialType.includes('Paper')) {
                //bind paper intervals
            }

            //cardboard needs full binding
            else if (materialType == 'Cardboard') {
                bindPosition(materialType, elementsArr[i], i);

                bindTop(materialType, elementsArr[i], i);
                bindSides(materialType, elementsArr[i], i);
                bindBottom(materialType, elementsArr[i], i);
                bindUC(materialType, elementsArr[i], i);
                bindLC(materialType, elementsArr[i], i);
            }

            else if (materialType == 'CornerGuard') {
                bindUC(materialType, elementsArr[i], i);
                bindLC(materialType, elementsArr[i], i);
            }

            else if (materialType == 'Chipboard' || materialType == 'WoodBunk') {
                bindPosition(materialType, elementsArr[i], i);

                bindTop(materialType, elementsArr[i], i);
                bindSides(materialType, elementsArr[i], i);
                bindBottom(materialType, elementsArr[i], i);
            }
        }
    }
}

function bindPosition(materialType, element, i) {
    let subElement = TcHmi.Controls.get(element.getId() + `.${materialType}Position`);
    TcHmi.Binding.createEx2(
        `%s%PLC1.StrapWrapRecipe.${materialType}[${i}]::position|BindingMode=TwoWay%/s%`,
        'Value',
        subElement);
    console.log('bind position ok')
}
function bindTop(materialType, element, i) {
    let subElement = TcHmi.Controls.get(element.getId() + `.${materialType}SelectTop`);
    TcHmi.Binding.createEx2(
        `%s%PLC1.StrapWrapRecipe.${materialType}[${i}]::top|BindingMode=TwoWay%/s%`,
        'Text',
        subElement);
    console.log('bind top ok')
}
function bindSides(materialType, element, i) {
    let subElement = TcHmi.Controls.get(element.getId() + `.${materialType}SelectSides`);
    TcHmi.Binding.createEx2(
        `%s%PLC1.StrapWrapRecipe.${materialType}[${i}]::sides|BindingMode=TwoWay%/s%`,
        'Text',
        subElement);
    console.log('bind sides ok')
}
function bindBottom(materialType, element, i) {
    let subElement = TcHmi.Controls.get(element.getId() + `.${materialType}SelectBottom`);
    TcHmi.Binding.createEx2(
        `%s%PLC1.StrapWrapRecipe.${materialType}[${i}]::bottom|BindingMode=TwoWay%/s%`,
        'Text',
        subElement);
    console.log('bind bottom ok')
}
function bindUC(materialType, element, i) {
    let subElement = TcHmi.Controls.get(element.getId() + `.${materialType}SelectUC`);
    TcHmi.Binding.createEx2(
        `%s%PLC1.StrapWrapRecipe.${materialType}[${i}]::upperCorner|BindingMode=TwoWay%/s%`,
        'Text',
        subElement);
    console.log('bind upper corner ok')
}
function bindLC(materialType, element, i) {
    let subElement = TcHmi.Controls.get(element.getId() + `.${materialType}SelectLC`);
    TcHmi.Binding.createEx2(
        `%s%PLC1.StrapWrapRecipe.${materialType}[${i}]::lowerCorner|BindingMode=TwoWay%/s%`,
        'Text',
        subElement);
    console.log('bind lower corner ok')
}