// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
function createWoodBunk() {
    if (WoodBunkElements.length < MaxWoodBunk) {
        var face = TcHmi.Controls.get('WoodBunkContainer');

        WoodBunkElements = face.getChildren().slice(2);

        //find available ID between 0 and MaxWoodBunk
        let newId = 0;
        for (let i = 0; i <= MaxWoodBunk; i++) {
            if (WoodBunkIdAvailable[i]) {
                newId = i;
                break;
            }
        }

        let newMaterial = TcHmi.ControlFactory.createEx(
            'TcHmi.Controls.System.TcHmiUserControlHost',
            `WoodBunk_${newId}`,
            { //attributes here
                'data-tchmi-type': 'TcHmi.Controls.System.TcHmiUserControlHost',
                'data-tchmi-height': 25,
                'data-tchmi-height-unit': 'px',
                'data-tchmi-left': 10,
                'data-tchmi-left-unit': 'px',
                'data-tchmi-target-user-control': 'UserControls/WoodBunk.usercontrol',
                'data-tchmi-top': 35 * WoodBunkElements.length + 45,
                'data-tchmi-top-unit': 'px',
                'data-tchmi-width': 430,
                'data-tchmi-width-unit': 'px',
                'data-tchmi-background-image-horizontal-alignment': 'Center',
                'data-tchmi-background-image-vertical-alignment': 'Center'
            },
            TcHmi.Controls.get('WoodBunkContainer')
        );

        TcHmi.EventProvider.register(newMaterial.getId() + '.WoodBunkDelete.onPressed', function (e, data) {
            deleteWoodBunk(newId);
        });

        console.log('added element ID: ' + newMaterial.getId());

        if (face && newMaterial) face.addChild(newMaterial);

        WoodBunkIdAvailable[newId] = false;
        WoodBunkElements.push(newMaterial);

        //bind
        //recoverBindings('WoodBunk', WoodBunkElements);
    }
    else {
        console.log('Too many elements for this container')
    }
}

TcHmi.EventProvider.register('AddWoodBunkButton.onMouseClick', function (e, data) {
    createWoodBunk();
});

function deleteWoodBunk(controlNum) {
    let face = TcHmi.Controls.get('WoodBunkContainer');
    let element = TcHmi.Controls.get(`WoodBunk_${controlNum}`);
    let elementIndex = WoodBunkElements.indexOf(element);

    //destroy element
    console.log('deleted element ID: ' + element.getId());
    element.destroy();

    //rewrite server values
    TcHmi.Symbol.writeEx("%s%PLC1.MAIN.launch.removeWoodBunkMaterial%/s%", { i: elementIndex });

    //free up ID
    WoodBunkIdAvailable[controlNum] = true;

    //reposition elements
    WoodBunkElements = face.getChildren().slice();
    WoodBunkElements.splice(0, 2);

    for (let i = 0; i < WoodBunkElements.length; i++) {
        WoodBunkElements[i].setTop(35 * i + 45);
    }

    //bind
    //recoverBindings('WoodBunk', WoodBunkElements);
}
/*
TcHmi.EventProvider.register('WoodBunkContainer.onAttached', function (e, data) {
    //get array from PLC
    TcHmi.Symbol.readEx2('%s%PLC1.StrapWrapRecipe.WoodBunkMaterials%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            let arr = data.value;
            for (let i = data.value.length - 1; i >= 0; i--) {
                if (!arr[i].material) { //remove null materials starting from the back
                    arr.splice(i, 1);
                }
            }
            console.log('refined WoodBunk: ');
            console.log(arr);

            //write back to server to overwrite shifted elements
            let temp = arr.slice();
            for (let i = 0; i < MaxWoodBunk - arr.length; i++) {
                temp.push({ material: '', position: 0 });
            }
            console.log(temp);
            TcHmi.Server.writeSymbol('PLC1.StrapWrapRecipe.WoodBunkMaterials', temp, function (data) {
                if (data.error !== TcHmi.Errors.NONE) {
                    console.log('overwrite failed')
                }
                else {
                    console.log('overwrite ok')
                }
            });

            recoverElements('WoodBunk', arr); //recover elements
        }
        else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('WoodBunk read failed');
        }
    });
});
*/

//TODO: rewrite
function recoverWoodBunkElements(arr) {
    let face = TcHmi.Controls.get('WoodBunkContainer');
    for (let i = 0; i < arr.length; i++) { //recreate material controls
        createWoodBunkMaterial();
        //recover data
        let position = arr[i].position;
        let topDataIndex = WoodBunSrcData[0].indexOf(arr[i].top);
        let sidesDataIndex = WoodBunSrcData[1].indexOf(arr[i].sides);
        let bottomDataIndex = WoodBunSrcData[2].indexOf(arr[i].bottom);

        TcHmi.Controls.get(`WoodBunk_${i}.WoodBunkPosition`).setValue(position);
        TcHmi.Controls.get(`WoodBunk_${i}.WoodBunkSelectTop`).setSelectedIndex(dataIndex);
        TcHmi.Controls.get(`WoodBunk_${i}.WoodBunkSelectSides`).setSelectedIndex(dataIndex);
        TcHmi.Controls.get(`WoodBunk_${i}.WoodBunkSelectBottom`).setSelectedIndex(dataIndex);

    }
}