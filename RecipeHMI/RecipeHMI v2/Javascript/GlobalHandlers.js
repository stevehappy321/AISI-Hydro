function recoverElements(materialType, arr) {
    for (let i = 0; i < arr.length; i++) { //regenerate material controls
        console.log(arr[i]);
        if (materialType.includes('Wrap')) {
            createWrap(materialType.replace('Wrap'));
        }
        else if (materialType.includes('Paper')) {
            createPaper(materialType.replace('Paper'));
        }
        else if (materialType == 'Cardboard') {
            createCardboard();
        }
        else if (materialType == 'CornerGuard') {
            createCornerGuard();
        }
        else if (materialType == 'Chipboard') {
            createChipboard();
        }
        else if (materialType == 'WoodBunk') {
            createWoodBunk();
        }
    }

    if (materialType.includes('Wrap') || materialType.includes('Paper')) { }
    else if (materialType == 'Cardboard') {
        setData(materialType, CardboardElements, arr);
    }
    else if (materialType == 'CornerGuard') {
        setData(materialType, CornerGuardElements, arr);
    }
    else if (materialType == 'Chipboard') {
        setData(materialType, ChipboardElements, arr);
    }
    else if (materialType == 'WoodBunk') {
        setData(materialType, WoodBunkElements, arr);
    }
}

function recoverBindings(materialType, elementsArr, modeNum) { //1 or 2
    let bindingFrom;
    let bindingTo;
    let arrBindingTo = [];

    for (let i = 0; i < elementsArr.length; i++) {
        if (elementsArr[i]) { //if element exists, bind its elements
            bindingFrom = `PLC1.StrapWrapRecipe.${materialType}[${i}]`;
            bindingTo = elementsArr[i];

            console.log(`binding
                ${bindingFrom}
                to
                ${bindingTo.getId()},
                ${modeNum}-way`);

            if (materialType.includes('Wrap')) {
                bindPositionRotations(materialType, elementsArr[i], i, modeNum);
            }
            else if (materialType.includes('Paper')) {
                bindInterval(materialType, elementsArr[i], i, modeNum);
            }

            //cardboard needs full binding
            else if (materialType == 'Cardboard') {
                bindPosition(materialType, elementsArr[i], i, modeNum);
                bindTop(materialType, elementsArr[i], i, modeNum);
                bindSides(materialType, elementsArr[i], i, modeNum);
                bindBottom(materialType, elementsArr[i], i, modeNum);
                bindCorners(materialType, elementsArr[i], i, modeNum);

                bindWrap(materialType, elementsArr[i], i, modeNum);
            }
            else if (materialType == 'CornerGuard') {
                bindPosition(materialType, elementsArr[i], i, modeNum);
                bindCorners(materialType, elementsArr[i], i, modeNum);

                bindWrap(materialType, elementsArr[i], i, modeNum);
            }
            else if (materialType == 'Chipboard') {
                bindPosition(materialType, elementsArr[i], i, modeNum);
                bindTop(materialType, elementsArr[i], i, modeNum);
                bindBottom(materialType, elementsArr[i], i, modeNum);
            }
            else if (materialType == 'WoodBunk') {
                bindPosition(materialType, elementsArr[i], i);
                bindTop(materialType, elementsArr[i], i, modeNum);
                bindSides(materialType, elementsArr[i], i, modeNum);
                bindBottom(materialType, elementsArr[i], i, modeNum);
            }
        }
    }
}

function recoverData(materialType, elementsArr) {
    TcHmi.Server.readSymbol(`PLC1.StrapWrapRecipe.${materialType}`, function (data) {
        let arr = data.results[0].value;
        if (arr) {
            console.log(`sorted ${materialType}: `)
            console.log(arr);

            setData(materialType, elementsArr, arr);
        }
    });
}

function setData(materialType, elementsArr, arr) { //combobox data only, numerical data can bind without this
    for (let i = 0; i < elementsArr.length; i++) {
        let topDataIndex;
        let leftDataIndex;
        let rightDataIndex;
        let bottomDataIndex;

        let topLeftDataIndex;
        let topRightDataIndex;
        let bottomLeftDataIndex;
        let bottomRightDataIndex;

        if (arr[i]) {
            if (materialType.includes('Paper') || materialType.includes('Wrap')) { }

            else if (materialType == 'Cardboard') {
                topDataIndex = CardboardSurfacesSrcData.indexOf(arr[i].top);
                leftDataIndex = CardboardSurfacesSrcData.indexOf(arr[i].left);
                rightDataIndex = CardboardSurfacesSrcData.indexOf(arr[i].right);
                bottomDataIndex = CardboardSurfacesSrcData.indexOf(arr[i].bottom);

                topLeftDataIndex = CardboardCornersSrcData.indexOf(arr[i].topLeft);
                topRightDataIndex = CardboardCornersSrcData.indexOf(arr[i].topRight);
                bottomLeftDataIndex = CardboardCornersSrcData.indexOf(arr[i].bottomLeft);
                bottomRightDataIndex = CardboardCornersSrcData.indexOf(arr[i].bottomRight);

                TcHmi.Controls.get(elementsArr[i].getId() + `.${materialType}Top`).setSelectedIndex(topDataIndex);
                TcHmi.Controls.get(elementsArr[i].getId() + `.${materialType}Left`).setSelectedIndex(leftDataIndex);
                TcHmi.Controls.get(elementsArr[i].getId() + `.${materialType}Right`).setSelectedIndex(rightDataIndex);
                TcHmi.Controls.get(elementsArr[i].getId() + `.${materialType}Bottom`).setSelectedIndex(bottomDataIndex);

                TcHmi.Controls.get(elementsArr[i].getId() + `.${materialType}TopLeft`).setSelectedIndex(topLeftDataIndex);
                TcHmi.Controls.get(elementsArr[i].getId() + `.${materialType}TopRight`).setSelectedIndex(topRightDataIndex);
                TcHmi.Controls.get(elementsArr[i].getId() + `.${materialType}BottomLeft`).setSelectedIndex(bottomLeftDataIndex);
                TcHmi.Controls.get(elementsArr[i].getId() + `.${materialType}BottomRight`).setSelectedIndex(bottomRightDataIndex);
            }

            else if (materialType == 'CornerGuard') {
                topLeftDataIndex = CornerGuardSrcData.indexOf(arr[i].topLeft);
                topRightDataIndex = CornerGuardSrcData.indexOf(arr[i].topRight);
                bottomLeftDataIndex = CornerGuardSrcData.indexOf(arr[i].bottomLeft);
                bottomRightDataIndex = CornerGuardSrcData.indexOf(arr[i].bottomRight);

                TcHmi.Controls.get(elementsArr[i].getId() + `.${materialType}TopLeft`).setSelectedIndex(topLeftDataIndex);
                TcHmi.Controls.get(elementsArr[i].getId() + `.${materialType}TopRight`).setSelectedIndex(topRightDataIndex);
                TcHmi.Controls.get(elementsArr[i].getId() + `.${materialType}BottomLeft`).setSelectedIndex(bottomLeftDataIndex);
                TcHmi.Controls.get(elementsArr[i].getId() + `.${materialType}BottomRight`).setSelectedIndex(bottomRightDataIndex);
            }

            else if (materialType == 'Chipboard') {
                topDataIndex = ChipboardSrcData.indexOf(arr[i].top);
                bottomDataIndex = ChipboardSrcData.indexOf(arr[i].bottom);

                TcHmi.Controls.get(elementsArr[i].getId() + `.${materialType}Top`).setSelectedIndex(topDataIndex);
                TcHmi.Controls.get(elementsArr[i].getId() + `.${materialType}Bottom`).setSelectedIndex(bottomDataIndex);
            }
            else if (materialType == 'WoodBunk') {
                topDataIndex = WoodBunkTopSrcData.indexOf(arr[i].top);
                leftDataIndex = WoodBunkSidesSrcData.indexOf(arr[i].left);
                rightDataIndex = WoodBunkSidesSrcData.indexOf(arr[i].right);
                bottomDataIndex = WoodBunkBottomSrcData.indexOf(arr[i].bottom);

                TcHmi.Controls.get(elementsArr[i].getId() + `.${materialType}Top`).setSelectedIndex(topDataIndex);
                TcHmi.Controls.get(elementsArr[i].getId() + `.${materialType}Left`).setSelectedIndex(leftDataIndex);
                TcHmi.Controls.get(elementsArr[i].getId() + `.${materialType}Right`).setSelectedIndex(rightDataIndex);
                TcHmi.Controls.get(elementsArr[i].getId() + `.${materialType}Bottom`).setSelectedIndex(bottomDataIndex);
            }
        }
    }
}