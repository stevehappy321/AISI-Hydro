// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
let newCardboardId = 0;

function createCardboard(surface) {
    if (CardboardElements.length < MaxElements) {
        var container = TcHmi.Controls.get('CardboardGrid');

        let newMaterial = TcHmi.ControlFactory.createEx(
            'TcHmi.Controls.System.TcHmiUserControlHost',
            `Cardboard_${newCardboardId}`,
            { //attributes here
                'data-tchmi-type': 'TcHmi.Controls.System.TcHmiUserControlHost',
                'data-tchmi-grid-row-index': 1,
                'data-tchmi-grid-column-index': 0,
                'data-tchmi-height': 25,
                'data-tchmi-height-unit': 'px',
                'data-tchmi-left': 10,
                'data-tchmi-left-unit': 'px',
                'data-tchmi-target-user-control': 'UserControls/Cardboard.usercontrol',
                'data-tchmi-top': 35 * CardboardElements.length,
                'data-tchmi-top-unit': 'px',
                'data-tchmi-width': 1600,
                'data-tchmi-width-unit': 'px',
                'data-tchmi-background-image-horizontal-alignment': 'Center',
                'data-tchmi-background-image-vertical-alignment': 'Center'
            });

        TcHmi.EventProvider.register(newMaterial.getId() + '.CardboardDelete.onPressed', function (e, data) {
            deleteCardboard(newMaterial.getId());
        });

        console.log('added element ID: ' + newMaterial.getId());

        if (container && newMaterial) container.addChild(newMaterial);

        CardboardElements.push(newMaterial);
        newCardboardId++;

        //UPDATE - binding deleted
        //recoverBindings('Cardboard', CardboardElements, 2);
        //set data from material array
        cardboard.push({ position: 0, top: '', sides: '', bottom: '', topCorners: '', bottomCorners: '' });

    }
    else {
        console.log('Too many elements for this container')
    }
}

TcHmi.EventProvider.register('AddCardboard.onMouseClick', function (e, data) {
    createCardboard();
});

function deleteCardboard(id) {
    let elementsArr = CardboardElements;
    let recipeArr = cardboard;

    let container = TcHmi.Controls.get('CardboardGrid');
    let element = TcHmi.Controls.get(id);
    let index = elementsArr.indexOf(element);

    //destroy element
    console.log('deleted element ID: ' + id + ' at index: ' + index);
    elementsArr.splice(index, 1);
    recipeArr.splice(index, 1);
    element.destroy();

    //REMOVED - rewrite server values
    //TcHmi.Server.writeSymbol(`PLC1.MAIN.arrayHelpers::removeCardboard`, { i: elementIndex });

    //reposition elements
    for (let i = 0; i < elementsArr.length; i++) {
        elementsArr[i].setTop(35 * i);
    }

    //REMOVED - bind
    //recoverBindings('Cardboard', elementsArr, 2);
}

TcHmi.EventProvider.register('CardboardGrid.onAttached', function (e, data) {
    CardboardElements = [];
    newCardboardId = 0;

    //regenerate controls using cardboard recipe array
    let recipeArr = cardboard;
    recoverElements('Cardboard', recipeArr);


    //get array from PLC
    /*
    TcHmi.Symbol.readEx2('%s%PLC1.StrapWrapRecipe.Cardboard%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            let arr = data.value.slice();
            for (let i = data.value.length - 1; i >= 0; i--) { //remove null materials starting from the back
                if (
                    !arr[i].top && !arr[i].left && !arr[i].right && !arr[i].bottom &&
                    !arr[i].topLeft && !arr[i].topRight && !arr[i].bottomLeft && !arr[i].bottomRight
                    ) {
                    arr.splice(i, 1);
                }
            }
            console.log('refined Cardboard: ');
            console.log(arr);

            //REMOVED - write back to server to overwrite shifted elements
            let temp = arr.slice();
            for (let i = 0; i < MaxElements - arr.length; i++) {
                temp.push(
                    {
                        position: 0,
                        top: '', left: '', right: '', bottom: '',
                        topLeft: '', topLeftFold: 0, topRight: '', topRightFold: 0,
                        bottomLeft: '', bottomLeftFold: 0, bottomRight: '', bottomRightFold: 0,
                        numWrapPoints: 0, numWrapRotations: 0
                    });
            }
            console.log('writing padded Cardboard back to server: ');
            console.log(temp);
            TcHmi.Server.writeSymbol('PLC1.StrapWrapRecipe.Cardboard', temp);

            recoverElements('Cardboard', arr);
        }
        else {
            console.log('Cardboard read failed');
            console.log(data.error);
            console.log(TcHmi.Errors);
        }
    });
    */
});