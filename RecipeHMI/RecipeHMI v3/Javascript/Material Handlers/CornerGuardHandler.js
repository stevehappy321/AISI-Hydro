// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
function createCornerGuard() {
    if (CornerGuardElements.length < MaxCornerGuard) {
        var face = TcHmi.Controls.get('CornerGuardContainer');

        CornerGuardElements = face.getChildren().slice(2);

        //find available ID between 0 and MaxCornerGuard
        let newId = 0;
        for (let i = 0; i <= MaxCornerGuard; i++) {
            if (CornerGuardIdAvailable[i]) {
                newId = i;
                break;
            }
        }

        let newMaterial = TcHmi.ControlFactory.createEx(
            'TcHmi.Controls.System.TcHmiUserControlHost',
            `CornerGuard_${newId}`,
            { //attributes here
                'data-tchmi-type': 'TcHmi.Controls.System.TcHmiUserControlHost',
                'data-tchmi-height': 25,
                'data-tchmi-height-unit': 'px',
                'data-tchmi-left': 10,
                'data-tchmi-left-unit': 'px',
                'data-tchmi-target-user-control': 'UserControls/CornerGuard.usercontrol',
                'data-tchmi-top': 35 * CornerGuardElements.length + 45,
                'data-tchmi-top-unit': 'px',
                'data-tchmi-width': 330,
                'data-tchmi-width-unit': 'px',
                'data-tchmi-background-image-horizontal-alignment': 'Center',
                'data-tchmi-background-image-vertical-alignment': 'Center'
            },
            TcHmi.Controls.get('CornerGuardContainer')
        );

        TcHmi.EventProvider.register(newMaterial.getId() + '.CornerGuardDelete.onPressed', function (e, data) {
            deleteCornerGuard(newId);
        });

        console.log('added element ID: ' + newMaterial.getId());

        if (face && newMaterial) face.addChild(newMaterial);

        CornerGuardIdAvailable[newId] = false;
        CornerGuardElements.push(newMaterial);

        //bind
        recoverBindings('CornerGuard', CornerGuardElements);
    }
    else {
        console.log('Too many elements for this container')
    }
}

TcHmi.EventProvider.register('AddCornerGuardButton.onMouseClick', function (e, data) {
    createCornerGuard();
});

function deleteCornerGuard(controlNum) {
    let face = TcHmi.Controls.get('CornerGuardContainer');
    let element = TcHmi.Controls.get(`CornerGuard_${controlNum}`);
    let elementIndex = CornerGuardElements.indexOf(element);

    //destroy element
    console.log('deleted element ID: ' + element.getId());
    element.destroy();

    //rewrite server values
    TcHmi.Symbol.writeEx("%s%PLC1.MAIN.launch.removeCornerGuardMaterial%/s%", { i: elementIndex });

    //free up ID
    CornerGuardIdAvailable[controlNum] = true;

    //reposition elements
    CornerGuardElements = face.getChildren().slice();
    CornerGuardElements.splice(0, 2);

    for (let i = 0; i < CornerGuardElements.length; i++) {
        CornerGuardElements[i].setTop(35 * i + 45);
    }

    //bind
    //recoverBindings('CornerGuard', CornerGuardElements);
}
/*
TcHmi.EventProvider.register('CornerGuardContainer.onAttached', function (e, data) {
    //get array from PLC
    TcHmi.Symbol.readEx2('%s%PLC1.StrapWrapRecipe.CornerGuardMaterials%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            let arr = data.value;
            for (let i = data.value.length - 1; i >= 0; i--) {
                if (!arr[i].material) { //remove null materials starting from the back
                    arr.splice(i, 1);
                }
            }
            console.log('refined CornerGuard: ');
            console.log(arr);

            //write back to server to overwrite shifted elements
            let temp = arr.slice();
            for (let i = 0; i < MaxCornerGuard - arr.length; i++) {
                temp.push({ material: '', position: 0 });
            }
            console.log(temp);
            TcHmi.Server.writeSymbol('PLC1.StrapWrapRecipe.CornerGuardMaterials', temp, function (data) {
                if (data.error !== TcHmi.Errors.NONE) {
                    console.log('overwrite failed')
                }
                else {
                    console.log('overwrite ok')
                }
            });

            recoverElements('CornerGuard', arr); //recover elements
        }
        else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('CornerGuard read failed');
        }
    });
});
*/

//TODO: rewrite
function recoverCornerGuardElements(arr) {
    let face = TcHmi.Controls.get('CornerGuardContainer');
    for (let i = 0; i < arr.length; i++) { //recreate material controls
        createCornerGuardMaterial();

        //recover data
        let position = arr[i].position;

        TcHmi.Controls.get(`CornerGuard_${i}.CornerGuardPosition`).setValue(position);
        TcHmi.Controls.get(`CornerGuard_${i}.CornerGuardSelectTop`).setSelectedIndex(dataIndex);
        TcHmi.Controls.get(`CornerGuard_${i}.CornerGuardSelectSides`).setSelectedIndex(dataIndex);
        TcHmi.Controls.get(`CornerGuard_${i}.CornerGuardSelectBottom`).setSelectedIndex(dataIndex);
        TcHmi.Controls.get(`CornerGuard_${i}.CardboardSelectUC`).setSelectedIndex(upperCornerDataIndex);
        TcHmi.Controls.get(`CornerGuard_${i}.CardboardSelectLC`).setSelectedIndex(lowerCornerDataIndex);
    }
}