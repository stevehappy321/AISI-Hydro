// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
function createCardboard() {
    if (CardboardElements.length < MaxCardboard) {
        var face = TcHmi.Controls.get('CardboardContainer');

        CardboardElements = face.getChildren().slice(2);

        //find available ID between 0 and MaxCardboard
        let newId = 0;
        for (let i = 0; i <= MaxCardboard; i++) {
            if (CardboardIdAvailable[i]) {
                newId = i;
                break;
            }
        }

        let newMaterial = TcHmi.ControlFactory.createEx(
            'TcHmi.Controls.System.TcHmiUserControlHost',
            `Cardboard_${newId}`,
            { //attributes here
                'data-tchmi-type': 'TcHmi.Controls.System.TcHmiUserControlHost',
                'data-tchmi-height': 25,
                'data-tchmi-height-unit': 'px',
                'data-tchmi-left': 10,
                'data-tchmi-left-unit': 'px',
                'data-tchmi-target-user-control': 'UserControls/Cardboard.usercontrol',
                'data-tchmi-top': 35 * CardboardElements.length + 45,
                'data-tchmi-top-unit': 'px',
                'data-tchmi-width': 630,
                'data-tchmi-width-unit': 'px',
                'data-tchmi-background-image-horizontal-alignment': 'Center',
                'data-tchmi-background-image-vertical-alignment': 'Center'
            },
            TcHmi.Controls.get('CardboardContainer')
        );

        TcHmi.EventProvider.register(newMaterial.getId() + '.CardboardDelete.onPressed', function (e, data) {
            deleteCardboard(newId);
        });

        console.log('added element ID: ' + newMaterial.getId());

        if (face && newMaterial) face.addChild(newMaterial);

        CardboardIdAvailable[newId] = false;
        CardboardElements.push(newMaterial);

        //bind
        recoverBindings('Cardboard', CardboardElements);
    }
    else {
        console.log('Too many elements for this container')
    }
}

TcHmi.EventProvider.register('AddCardboardButton.onMouseClick', function (e, data) {
    createCardboard();
});

function deleteCardboard(controlNum) {
    let face = TcHmi.Controls.get('CardboardContainer');
    let element = TcHmi.Controls.get(`Cardboard_${controlNum}`);
    let elementIndex = CardboardElements.indexOf(element);

    //destroy element
    console.log('deleted element ID: ' + element.getId());
    element.destroy();

    //rewrite server values
    TcHmi.Server.writeSymbol(
        `PLC1.StrapWrapRecipe.Cardboard[${elementIndex}]`,
        { position: 0, top: '', sides: '', bottom: '', upperCorner: '', lowerCorner: '' });

    //free up ID
    CardboardIdAvailable[controlNum] = true;

    //reposition elements
    CardboardElements = face.getChildren().slice();
    CardboardElements.splice(0, 2);

    for (let i = 0; i < CardboardElements.length; i++) {
        CardboardElements[i].setTop(35 * i + 45);
    }

    //bind
    recoverBindings('Cardboard', CardboardElements);
}

TcHmi.EventProvider.register('CardboardContainer.onAttached', function (e, data) {
    //get array from PLC
    TcHmi.Symbol.readEx2('%s%PLC1.StrapWrapRecipe.Cardboard%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            let arr = data.value.slice();
            for (let i = data.value.length - 1; i >= 0; i--) { //remove null materials starting from the back
                if (!arr[i].top && !arr[i].sides && !arr[i].bottom && !arr[i].upperCorner && !arr[i].lowerCorner) {
                    arr.splice(i, 1);
                }
            }
            console.log('refined Cardboard: ');
            console.log(arr);

            //write back to server to overwrite shifted elements
            let temp = arr.slice();
            for (let i = 0; i < MaxCardboard - arr.length; i++) {
                temp.push({ position: -1, top: '', sides: '', bottom: '', upperCorner: '', lowerCorner: '' });
            }
            console.log(temp);
            TcHmi.Server.writeSymbol('PLC1.StrapWrapRecipe.Cardboard', temp, function (data) {
                if (data.error !== TcHmi.Errors.NONE) {
                    console.log('Cardboard overwrite failed')
                }
                else {
                    console.log('Cardboard overwrite ok')
                }
            });

            //recoverElements('Cardboard', arr); //recover elements
            recoverCardboardElements(arr);
        }
        else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('Cardboard read failed');
        }
    });
});


function recoverCardboardElements(arr) {
    let face = TcHmi.Controls.get('CardboardContainer');
    for (let i = 0; i < arr.length; i++) { //recreate material controls
        createCardboard();
        //recover data
        let position = arr[i].position;
        let topDataIndex = CardboardSrcData[0].indexOf(arr[i].top);
        let sidesDataIndex = CardboardSrcData[1].indexOf(arr[i].sides);
        let bottomDataIndex = CardboardSrcData[2].indexOf(arr[i].bottom);
        let upperCornerDataIndex = CardboardSrcData[3].indexOf(arr[i].upperCorner);
        let lowerCornerDataIndex = CardboardSrcData[4].indexOf(arr[i].lowerCorner);

        console.log(position, topDataIndex, sidesDataIndex, bottomDataIndex, upperCornerDataIndex, lowerCornerDataIndex);

        TcHmi.Controls.get(`Cardboard_${i}.CardboardPosition`).setValue(position);
        TcHmi.Controls.get(`Cardboard_${i}.CardboardSelectTop`).setSelectedIndex(topDataIndex);
        TcHmi.Controls.get(`Cardboard_${i}.CardboardSelectSides`).setSelectedIndex(sidesDataIndex);
        TcHmi.Controls.get(`Cardboard_${i}.CardboardSelectBottom`).setSelectedIndex(bottomDataIndex);
        TcHmi.Controls.get(`Cardboard_${i}.CardboardSelectUC`).setSelectedIndex(upperCornerDataIndex);
        TcHmi.Controls.get(`Cardboard_${i}.CardboardSelectLC`).setSelectedIndex(lowerCornerDataIndex);

        console.log('data recovered');
    }
}