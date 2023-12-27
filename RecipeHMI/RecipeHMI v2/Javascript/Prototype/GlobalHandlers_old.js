// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
/*
function deleteMaterial(face, controlNum) {
    let element = TcHmi.Controls.get(`${face}Materials_${controlNum}`);
    let elementIndex = sidesElements.indexOf(element);
    switch (face) {
        case 'Top':
            if (topElements[i]) bindingTo = topElements[i].getId();
            break;
        case 'Sides':
            if (sidesElements[i]) bindingTo = sidesElements[i].getId();
            break;
        case 'Bottom':
            if (bottomElements[i]) bindingTo = bottomElements[i].getId();
            break;
        case 'UC':
            if (upperCornerElements[i]) bindingTo = upperCornerElements[i].getId();
            break;
        case 'LC':
            if (lowerCornerElements[i]) bindingTo = lowerCornerElements[i].getId();
            break;
    }
    

    //destroy element
    console.log('deleted element ID: ' + element.getId());
    element.destroy();

    //rewrite server values
    TcHmi.Symbol.writeEx(`%s%PLC1.MAIN.launch.remove${face}Material%/s%`, { i: elementIndex });

    //free up ID
    sidesIdAvailable[controlNum] = true;

    //reposition elements
    sidesElements = TcHmi.Controls.get(`${face}Container`).getChildren().slice();
    sidesElements.splice(0, 2);

    for (let i = 0; i < sidesElements.length; i++) {
        sidesElements[i].setTop(35 * i + 45);
    }

    //bind
    recoverBindings('Sides', sidesElements);
}
*/
/*
function recoverBindings(face, elementsArr) {
    let bindingFrom;
    let bindingTo;
    for (let i = 0; i < elementsArr.length; i++) { //iterate through array of elements
        switch (face) {
            case 'Top':
                if (topElements[i]) bindingTo = topElements[i].getId();
                break;
            case 'Sides':
                if (sidesElements[i]) bindingTo = sidesElements[i].getId();
                break;
            case 'Bottom':
                if (bottomElements[i]) bindingTo = bottomElements[i].getId();
                break;
            case 'UC':
                if (upperCornerElements[i]) bindingTo = upperCornerElements[i].getId();
                break;
            case 'LC':
                if (lowerCornerElements[i]) bindingTo = lowerCornerElements[i].getId();
                break;
        }
        bindingFrom = `PLC1.StrapWrapRecipe.${face}Materials[${i}]`;
        console.log(`binding
            ${bindingFrom}
            to
            ${bindingTo}`);

        let elemSelect = TcHmi.Controls.get(elementsArr[i].getId() + `.${face}Select`);
        let elemPosition = TcHmi.Controls.get(elementsArr[i].getId() + `.${face}Position`);

        TcHmi.Binding.createEx2(
            `%s%PLC1.StrapWrapRecipe.${face}Materials[${i}]::material|BindingMode=TwoWay%/s%`,
            'Text',
            elemSelect);

        TcHmi.Binding.createEx2(
            `%s%PLC1.StrapWrapRecipe.${face}Materials[${i}]::position|BindingMode=TwoWay%/s%`,
            'Value',
            elemPosition);
    }
}
*/

//does not work
/*
function recoverElements(face, serverEntries) {
    let dataIndex;
    let position;
    let localSrcData;
    switch (face) {
        case 'Top':
            localSrcData = topSrcData;
            break;
        case 'Sides':
            localSrcData = sidesSrcData;
            break;
        case 'Bottom':
            localSrcData = bottomSrcData;
            break;
        case 'UC':
            localSrcData = upperCornerSrcData;
            break;
        case 'LC':
            localSrcData = lowerCornerSrcData;
            break;
    }

    for (let i = 0; i < serverEntries.length; i++) { //recreate material controls
        switch (face) {
            case 'Top':
                createTopMaterial();
                break;
            case 'Sides':
                createSidesMaterial();
                break;
            case 'Bottom':
                createBottomMaterial();
                break;
            case 'UC':
                createUCMaterial();
                break;
            case 'LC':
                createLCMaterial();
                break;
        }
        dataIndex = localSrcData.indexOf(serverEntries[i].material);
        position = serverEntries[i].position;

        TcHmi.Controls.get(`${face}Materials_${i}.${face}Select`).setSelectedIndex(dataIndex);
        TcHmi.Controls.get(`${face}Materials_${i}.${face}Position`).setValue(position);
    }
}
*/