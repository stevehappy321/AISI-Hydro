// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
let newWoodBunkId = 0;

function createWoodBunk() {
    if (WoodBunkElements.length < MaxElements) {
        var container = TcHmi.Controls.get('WoodBunkGrid');

        let newMaterial = TcHmi.ControlFactory.createEx(
            'TcHmi.Controls.System.TcHmiUserControlHost',
            `WoodBunk_${newWoodBunkId}`,
            { //attributes here
                'data-tchmi-type': 'TcHmi.Controls.System.TcHmiUserControlHost',
                'data-tchmi-grid-row-index': 1,
                'data-tchmi-grid-column-index': 0,
                'data-tchmi-height': 25,
                'data-tchmi-height-unit': 'px',
                'data-tchmi-left': 10,
                'data-tchmi-left-unit': 'px',
                'data-tchmi-target-user-control': 'UserControls/WoodBunk.usercontrol',
                'data-tchmi-top': 35 * WoodBunkElements.length,
                'data-tchmi-top-unit': 'px',
                'data-tchmi-width': 1580,
                'data-tchmi-width-unit': 'px',
                'data-tchmi-background-image-horizontal-alignment': 'Center',
                'data-tchmi-background-image-vertical-alignment': 'Center'
            }
        );

        TcHmi.EventProvider.register(newMaterial.getId() + '.WoodBunkDelete.onPressed', function (e, data) {
            deleteWoodBunk(newMaterial.getId());
        });

        console.log('added element ID: ' + newMaterial.getId());

        if (container && newMaterial) container.addChild(newMaterial);

        WoodBunkElements.push(newMaterial);
        newWoodBunkId++;

        //bind
        recoverBindings('WoodBunk', WoodBunkElements, 2);
    }
    else {
        console.log('Too many elements for this container')
    }
}

TcHmi.EventProvider.register('AddWoodBunk.onMouseClick', function (e, data) {
    createWoodBunk();
});

function deleteWoodBunk(id) {
    let elementsArr = WoodBunkElements;

    let container = TcHmi.Controls.get('WoodBunkGrid');
    let element = TcHmi.Controls.get(id);
    let elementIndex = elementsArr.indexOf(element);

    //destroy element
    console.log('deleted element ID: ' + id + ' at index: ' + elementIndex);
    elementsArr.splice(elementIndex, 1);
    element.destroy();

    //rewrite server values
    TcHmi.Server.writeSymbol(`PLC1.MAIN.arrayHelpers::removeWoodBunk`, { i: elementIndex });

    //reposition elements
    for (let i = 0; i < elementsArr.length; i++) {
        elementsArr[i].setTop(35 * i);
    }

    //bind
    recoverBindings('WoodBunk', elementsArr, 2);
}

TcHmi.EventProvider.register('WoodBunkGrid.onAttached', function (e, data) {
    WoodBunkElements = [];
    newWoodBunkId = 0;
    //get array from PLC
    TcHmi.Symbol.readEx2('%s%PLC1.StrapWrapRecipe.WoodBunk%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            let arr = data.value.slice();
            for (let i = data.value.length - 1; i >= 0; i--) { //remove null materials starting from the back
                if (!arr[i].top && !arr[i].sides && !arr[i].bottom && !arr[i].upperCorner && !arr[i].lowerCorner) {
                    arr.splice(i, 1);
                }
            }
            console.log('refined WoodBunk: ');
            console.log(arr);

            //write back to server to overwrite shifted elements
            let temp = arr.slice();
            for (let i = 0; i < MaxWoodBunk - arr.length; i++) {
                temp.push({ position: 0, top: '', sides: '', bottom: '', upperCorner: '', lowerCorner: '' });
            }
            console.log('writing padded WoodBunk back to server: ');
            console.log(temp);
            TcHmi.Server.writeSymbol('PLC1.StrapWrapRecipe.WoodBunk', temp);

            recoverElements('WoodBunk', arr);
        }
        else {
            console.log('WoodBunk read failed');
            console.log(data.error);
            console.log(TcHmi.Errors);
        }
    });
});

function recoverWoodBunkElements(arr) {
    for (let i = 0; i < arr.length; i++) { //recreate material controls
        createWoodBunk();
        console.log(arr[i]);
    }
}