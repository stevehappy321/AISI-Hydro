// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
let newCornerGuardId = 0;

function createCornerGuard() {
    if (CornerGuardElements.length < MaxElements) {
        var container = TcHmi.Controls.get('CornerGuardGrid');

        let newMaterial = TcHmi.ControlFactory.createEx(
            'TcHmi.Controls.System.TcHmiUserControlHost',
            `CornerGuard_${newCornerGuardId}`,
            { //attributes here
                'data-tchmi-type': 'TcHmi.Controls.System.TcHmiUserControlHost',
                'data-tchmi-grid-row-index': 1,
                'data-tchmi-grid-column-index': 0,
                'data-tchmi-height': 25,
                'data-tchmi-height-unit': 'px',
                'data-tchmi-left': 10,
                'data-tchmi-left-unit': 'px',
                'data-tchmi-target-user-control': 'UserControls/CornerGuard.usercontrol',
                'data-tchmi-top': 35 * CornerGuardElements.length,
                'data-tchmi-top-unit': 'px',
                'data-tchmi-width': 1580,
                'data-tchmi-width-unit': 'px',
                'data-tchmi-background-image-horizontal-alignment': 'Center',
                'data-tchmi-background-image-vertical-alignment': 'Center'
            }
        );

        TcHmi.EventProvider.register(newMaterial.getId() + '.CornerGuardDelete.onPressed', function (e, data) {
            deleteCornerGuard(newMaterial.getId());
        });

        console.log('added element ID: ' + newMaterial.getId());

        if (container && newMaterial) container.addChild(newMaterial);

        CornerGuardElements.push(newMaterial);
        newCornerGuardId++;

        //bind
        recoverBindings('CornerGuard', CornerGuardElements, 2);
    }
    else {
        console.log('Too many elements for this container')
    }
}

TcHmi.EventProvider.register('AddCornerGuard.onMouseClick', function (e, data) {
    createCornerGuard();
});

function deleteCornerGuard(id) {
    let elementsArr = CornerGuardElements;

    let container = TcHmi.Controls.get('CornerGuardGrid');
    let element = TcHmi.Controls.get(id);
    let elementIndex = elementsArr.indexOf(element);

    //destroy element
    console.log('deleted element ID: ' + id + ' at index: ' + elementIndex);
    elementsArr.splice(elementIndex, 1);
    element.destroy();

    //rewrite server values
    TcHmi.Server.writeSymbol(`PLC1.MAIN.arrayHelpers::removeCornerGuard`, { i: elementIndex });

    //reposition elements
    for (let i = 0; i < elementsArr.length; i++) {
        elementsArr[i].setTop(35 * i);
    }

    //bind
    recoverBindings('CornerGuard', elementsArr, 2);
}

TcHmi.EventProvider.register('CornerGuardGrid.onAttached', function (e, data) {
    CornerGuardElements = [];
    newCornerGuardId = 0;
    //get array from PLC
    TcHmi.Symbol.readEx2('%s%PLC1.StrapWrapRecipe.CornerGuard%/s%', function (data) {
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
            console.log('refined CornerGuard: ');
            console.log(arr);

            //write back to server to overwrite shifted elements
            let temp = arr.slice();
            for (let i = 0; i < MaxElements - arr.length; i++) {
                temp.push(
                    {
                        position: 0,
                        top: '', left: '', right: '', bottom: '',
                        topLeft: '', topLeftFold: 0, topRight: '', topRightFold: 0,
                        bottomLeft: '', bottomLeftFold: 0, bottomRight: '', bottomRightFold: 0
                    });
            }
            console.log('writing padded CornerGuard back to server: ');
            console.log(temp);
            TcHmi.Server.writeSymbol('PLC1.StrapWrapRecipe.CornerGuard', temp);

            recoverElements('CornerGuard', arr);
        }
        else {
            console.log('CornerGuard read failed');
            console.log(data.error);
            console.log(TcHmi.Errors);
        }
    });
});


function recoverCornerGuardElements(arr) {
    for (let i = 0; i < arr.length; i++) { //recreate material controls
        createCornerGuard();
        console.log(arr[i]);
    }
}