// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
function createChipboard() {
    if (ChipboardElements.length < MaxChipboard) {
        var face = TcHmi.Controls.get('ChipboardContainer');

        ChipboardElements = face.getChildren().slice(2);

        //find available ID between 0 and MaxChipboard
        let newId = 0;
        for (let i = 0; i <= MaxChipboard; i++) {
            if (ChipboardIdAvailable[i]) {
                newId = i;
                break;
            }
        }

        let newMaterial = TcHmi.ControlFactory.createEx(
            'TcHmi.Controls.System.TcHmiUserControlHost',
            `Chipboard_${newId}`,
            { //attributes here
                'data-tchmi-type': 'TcHmi.Controls.System.TcHmiUserControlHost',
                'data-tchmi-height': 25,
                'data-tchmi-height-unit': 'px',
                'data-tchmi-left': 10,
                'data-tchmi-left-unit': 'px',
                'data-tchmi-target-user-control': 'UserControls/Chipboard.usercontrol',
                'data-tchmi-top': 35 * ChipboardElements.length + 45,
                'data-tchmi-top-unit': 'px',
                'data-tchmi-width': 430,
                'data-tchmi-width-unit': 'px',
                'data-tchmi-background-image-horizontal-alignment': 'Center',
                'data-tchmi-background-image-vertical-alignment': 'Center'
            },
            TcHmi.Controls.get('ChipboardContainer')
        );

        TcHmi.EventProvider.register(newMaterial.getId() + '.ChipboardDelete.onPressed', function (e, data) {
            deleteChipboard(newId);
        });

        console.log('added element ID: ' + newMaterial.getId());

        if (face && newMaterial) face.addChild(newMaterial);

        ChipboardIdAvailable[newId] = false;
        ChipboardElements.push(newMaterial);

        //bind
        recoverBindings('Chipboard', ChipboardElements);
    }
    else {
        console.log('Too many elements for this container')
    }
}

TcHmi.EventProvider.register('AddChipboardButton.onMouseClick', function (e, data) {
    createChipboard();
});

function deleteChipboard(controlNum) {
    let face = TcHmi.Controls.get('ChipboardContainer');
    let element = TcHmi.Controls.get(`Chipboard_${controlNum}`);
    let elementIndex = ChipboardElements.indexOf(element);

    //destroy element
    console.log('deleted element ID: ' + element.getId());
    element.destroy();

    //rewrite server values
    TcHmi.Server.writeSymbol(
        `PLC1.StrapWrapRecipe.Chipboard[${elementIndex}]`,
        { position: 0, top: '', sides: '', bottom: '', upperCorner: '', lowerCorner: '' });

    //free up ID
    ChipboardIdAvailable[controlNum] = true;

    //reposition elements
    ChipboardElements = face.getChildren().slice(2);

    for (let i = 0; i < ChipboardElements.length; i++) {
        ChipboardElements[i].setTop(35 * i + 45);
    }

    //bind
    recoverBindings('Chipboard', ChipboardElements);
}

TcHmi.EventProvider.register('ChipboardContainer.onAttached', function (e, data) {
    //get array from PLC
    TcHmi.Symbol.readEx2('%s%PLC1.StrapWrapRecipe.Chipboard%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            let arr = data.value.slice();
            for (let i = data.value.length - 1; i >= 0; i--) { //remove null materials starting from the back
                if (!arr[i].top && !arr[i].sides && !arr[i].bottom) {
                    arr.splice(i, 1);
                }
            }
            console.log('refined Chipboard: ');
            console.log(arr);

            //write back to server to overwrite shifted elements
            let temp = arr.slice();
            for (let i = 0; i < MaxChipboard - arr.length; i++) {
                temp.push({ position: -1, top: '', sides: '', bottom: '', upperCorner: '', lowerCorner: '' });
            }
            console.log(temp);
            TcHmi.Server.writeSymbol('PLC1.StrapWrapRecipe.Chipboard', temp, function (data) {
                if (data.error !== TcHmi.Errors.NONE) {
                    console.log('Chipboard overwrite failed');
                }
                else {
                    console.log('Chipboard overwrite ok');
                }
            });
            //recoverElements('Chipboard', arr); //recover elements
            recoverChipboardElements(arr); //recover elements
            
        }
        else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('Chipboard read failed');
        }
    });
});

function recoverChipboardElements(arr) {
    let face = TcHmi.Controls.get('ChipboardContainer');
    for (let i = 0; i < arr.length; i++) { //recreate material controls
        createChipboard();
        //recover data
        let position = arr[i].position;
        let topDataIndex = ChipboardSrcData[0].indexOf(arr[i].top);
        let sidesDataIndex = ChipboardSrcData[1].indexOf(arr[i].sides);
        let bottomDataIndex = ChipboardSrcData[2].indexOf(arr[i].bottom);

        console.log(position, topDataIndex, sidesDataIndex, bottomDataIndex);

        TcHmi.Controls.get(`Chipboard_${i}.ChipboardPosition`).setValue(position);
        TcHmi.Controls.get(`Chipboard_${i}.ChipboardSelectTop`).setSelectedIndex(topDataIndex);
        TcHmi.Controls.get(`Chipboard_${i}.ChipboardSelectSides`).setSelectedIndex(sidesDataIndex);
        TcHmi.Controls.get(`Chipboard_${i}.ChipboardSelectBottom`).setSelectedIndex(bottomDataIndex);
        console.log('data recovered');
    }
}