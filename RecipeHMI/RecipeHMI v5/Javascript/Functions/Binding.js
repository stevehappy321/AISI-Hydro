// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
function bindPositionRotations(materialType, element, i, modeNum) {
    console.log(materialType);
    let position = TcHmi.Controls.get(element.getId() + `.WrapPosition`);
    let rotations = TcHmi.Controls.get(element.getId() + `.WrapRotations`);

    let positionSymbol = `PLC1.StrapWrapRecipe.${materialType}[${i}]::position`;
    let rotationsSymbol = `PLC1.StrapWrapRecipe.${materialType}[${i}]::rotations`;

    if (modeNum = 2) {
        positionSymbol += `|BindingMode=TwoWay`;
        rotationsSymbol += `|BindingMode=TwoWay`;
    }
    TcHmi.Binding.createEx2(
        `%s%` + positionSymbol + `%/s%`,
        'Value',
        position);
    TcHmi.Binding.createEx2(
         `%s%` + rotationsSymbol + `%/s%`,
        'Value',
        rotations);
    console.log('bind position-rotations ok');
}

function bindWrap(materialType, element, i, modeNum) {
    let numWrapPoints = TcHmi.Controls.get(element.getId() + `.${materialType}NumWrapPoints`);
    let numWrapRotations = TcHmi.Controls.get(element.getId() + `.${materialType}NumWrapRotations`);

    let numWrapPointsSymbol = `PLC1.StrapWrapRecipe.${materialType}[${i}]::numWrapPoints`;
    let numWrapRotationsSymbol = `PLC1.StrapWrapRecipe.${materialType}[${i}]::numWrapRotations`;
    
    if (modeNum = 2) {
        numWrapPointsSymbol += `|BindingMode=TwoWay`;
        numWrapRotationsSymbol += `|BindingMode=TwoWay`;
    }

    TcHmi.Binding.createEx2(
        `%s%` + numWrapPointsSymbol + `%/s%`,
        'Value',
        numWrapPoints);
    TcHmi.Binding.createEx2(
         `%s%` + numWrapRotationsSymbol + `%/s%`,
        'Value',
        numWrapRotations);
    console.log('bind wrap ok');
}

function bindInterval(materialType, element, i, modeNum) {
    let startPos = TcHmi.Controls.get(element.getId() + `.PaperStart`);
    let endPos = TcHmi.Controls.get(element.getId() + `.PaperEnd`);

    let startSymbol = `PLC1.StrapWrapRecipe.${materialType}[${i}]::start`;
    let endSymbol = `PLC1.StrapWrapRecipe.${materialType}[${i}]::end`;

    if (modeNum = 2) {
        startSymbol += `|BindingMode=TwoWay`;
        endSymbol += `|BindingMode=TwoWay`;
    }

    TcHmi.Binding.createEx2(
        `%s%` + startSymbol + `%/s%`,
        'Value',
        startPos);
    TcHmi.Binding.createEx2(
         `%s%` + endSymbol + `%/s%`,
        'Value',
        endPos);
    console.log('bind interval ok');
}

function bindPosition(materialType, element, i, modeNum) {
    let subElement = TcHmi.Controls.get(element.getId() + `.${materialType}Position`);
    let symbol = `PLC1.StrapWrapRecipe.${materialType}[${i}]::position`;
    if (modeNum = 2) symbol += `|BindingMode=TwoWay`;

    TcHmi.Binding.createEx2(
        `%s%` + symbol + `%/s%`,
        'Value',
        subElement);
}

function bindTop(materialType, element, i, modeNum) {
    let subElement = TcHmi.Controls.get(element.getId() + `.${materialType}Top`);
    let symbol = `PLC1.StrapWrapRecipe.${materialType}[${i}]::top`;
    if (modeNum = 2) symbol += `|BindingMode=TwoWay`;
    console.log(element.getId())
    TcHmi.Binding.createEx2(
        `%s%` + symbol + `%/s%`,
        'Text',
        subElement);
}
function bindSides(materialType, element, i) { //bind left and right
    let subElementLeft = TcHmi.Controls.get(element.getId() + `.${materialType}Left`);
    let symbolLeft = `PLC1.StrapWrapRecipe.${materialType}[${i}]::left`;

    let subElementRight = TcHmi.Controls.get(element.getId() + `.${materialType}Right`);
    let symbolRight = `PLC1.StrapWrapRecipe.${materialType}[${i}]::right`;

    if (modeNum = 2) {
        symbolLeft += `|BindingMode=TwoWay`;
        symbolRight += `|BindingMode=TwoWay`;
    }

    TcHmi.Binding.createEx2(
        `%s%` + symbolLeft + `%/s%`,
        'Text',
        subElementLeft);

    TcHmi.Binding.createEx2(
        `%s%` + symbolRight + `%/s%`,
        'Text',
        subElementRight);
}
function bindBottom(materialType, element, i, modeNum) {
    let subElement = TcHmi.Controls.get(element.getId() + `.${materialType}Bottom`);
    let symbol = `PLC1.StrapWrapRecipe.${materialType}[${i}]::bottom`;
    if (modeNum = 2) symbol += `|BindingMode=TwoWay`;

    TcHmi.Binding.createEx2(
        `%s%` + symbol + `%/s%`,
        'Text',
        subElement);
}

function bindCorners(materialType, element, i, modeNum) { //bind all corners
    let symbolTopLeft = `PLC1.StrapWrapRecipe.${materialType}[${i}]::topLeft`;
    let subElementTopLeft = TcHmi.Controls.get(element.getId() + `.${materialType}TopLeft`);

    let symbolTopLeftFold = `PLC1.StrapWrapRecipe.${materialType}[${i}]::topLeftFold`;
    let subElementTopLeftFold = TcHmi.Controls.get(element.getId() + `.${materialType}TopLeftFold`);

    let symbolTopRight = `PLC1.StrapWrapRecipe.${materialType}[${i}]::topRight`;
    let subElementTopRight = TcHmi.Controls.get(element.getId() + `.${materialType}TopRight`);

    let symbolTopRightFold = `PLC1.StrapWrapRecipe.${materialType}[${i}]::topRightFold`;
    let subElementTopRightFold = TcHmi.Controls.get(element.getId() + `.${materialType}TopRightFold`);

    let symbolBottomLeft = `PLC1.StrapWrapRecipe.${materialType}[${i}]::bottomLeft`;
    let subElementBottomLeft = TcHmi.Controls.get(element.getId() + `.${materialType}BottomLeft`);

    let symbolBottomLeftFold = `PLC1.StrapWrapRecipe.${materialType}[${i}]::bottomLeftFold`;
    let subElementBottomLeftFold = TcHmi.Controls.get(element.getId() + `.${materialType}BottomLeftFold`);

    let symbolBottomRight = `PLC1.StrapWrapRecipe.${materialType}[${i}]::bottomRight`;
    let subElementBottomRight = TcHmi.Controls.get(element.getId() + `.${materialType}BottomRight`);

    let symbolBottomRightFold = `PLC1.StrapWrapRecipe.${materialType}[${i}]::bottomRightFold`;
    let subElementBottomRightFold = TcHmi.Controls.get(element.getId() + `.${materialType}BottomRightFold`);

    if (modeNum = 2) {
        symbolTopLeft += `|BindingMode=TwoWay`;
        symbolTopLeftFold += `|BindingMode=TwoWay`;

        symbolTopRight += `|BindingMode=TwoWay`;
        symbolTopRightFold += `|BindingMode=TwoWay`;

        symbolBottomLeft += `|BindingMode=TwoWay`;
        symbolBottomLeftFold += `|BindingMode=TwoWay`;

        symbolBottomRight += `|BindingMode=TwoWay`;
        symbolBottomRightFold += `|BindingMode=TwoWay`;
    }

    TcHmi.Binding.createEx2(
        `%s%` + symbolTopLeft + `%/s%`,
        'Text',
        subElementTopLeft);
    try {
        TcHmi.Binding.createEx2(
            `%s%` + symbolTopLeftFold + `%/s%`,
            'Value',
            subElementTopLeftFold);
    } catch (e) { }
    //----------------
    TcHmi.Binding.createEx2(
        `%s%` + symbolTopRight + `%/s%`,
        'Text',
        subElementTopRight);
    try {
        TcHmi.Binding.createEx2(
            `%s%` + symbolTopRightFold + `%/s%`,
            'Value',
            subElementTopRightFold);
    } catch (e) { }
    //----------------
    TcHmi.Binding.createEx2(
        `%s%` + symbolBottomLeft + `%/s%`,
        'Text',
        subElementBottomLeft);
    try {
        TcHmi.Binding.createEx2(
        `%s%` + symbolBottomLeftFold + `%/s%`,
        'Value',
        subElementBottomLeftFold);
    } catch (e) { }
    //----------------
    TcHmi.Binding.createEx2(
        `%s%` + symbolBottomRight + `%/s%`,
        'Text',
        subElementBottomRight);
    try {
        TcHmi.Binding.createEx2(
        `%s%` + symbolBottomRightFold + `%/s%`,
        'Value',
        subElementBottomRightFold);
    } catch (e) { }
}