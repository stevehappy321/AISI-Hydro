// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
function createPaper(face) {
    let container = TcHmi.Controls.get(`${face}PaperContainer`);
    let elements = [];
    let arrID = [];
    switch (face) {
        case 'Top':
            arrID = TopPaperIdAvailable;
            elements = TopPaperElements;
            break;
        case 'Sides':
            arrID = SidesPaperIdAvailable;
            elements = SidesPaperElements;
            break;
        case 'Bottom':
            arrID = BottomPaperIdAvailable;
            elements = BottomPaperElements;
            break;
    }

    if (elements.length < MaxPaper) {
        //find available ID between 0 and MaxElements
        let newId = 0;
        for (let i = 0; i < MaxPaper; i++) {
            if (arrID[i]) {
                newId = i;
                break;
            }
        }

        let newMaterial = TcHmi.ControlFactory.createEx(
            'TcHmi.Controls.System.TcHmiUserControlHost',
            `${face}Paper_${newId}`,
            { //attributes here
                'data-tchmi-type': 'TcHmi.Controls.System.TcHmiUserControlHost',
                'data-tchmi-height': 25,
                'data-tchmi-height-unit': 'px',
                'data-tchmi-left': 10,
                'data-tchmi-left-unit': 'px',
                'data-tchmi-target-user-control': 'UserControls/Paper.usercontrol',
                'data-tchmi-top': 35 * elements.length + 45,
                'data-tchmi-top-unit': 'px',
                'data-tchmi-width': 430,
                'data-tchmi-width-unit': 'px',
                'data-tchmi-background-image-horizontal-alignment': 'Center',
                'data-tchmi-background-image-vertical-alignment': 'Center'
            },
            container
        );

        TcHmi.EventProvider.register(newMaterial.getId() + '.PaperDelete.onPressed', function (e, data) {
            deletePaper(face, newId);
        });

        console.log('added element ID: ' + newMaterial.getId());

        if (container && newMaterial) container.addChild(newMaterial);

        arrID[newId] = false;
        elements.push(newMaterial);

        console.log(elements);
        console.log(arrID);

        //bind
        //recoverBindings('Paper', PaperElements);
    }
    else {
        console.log('Too many elements for this container');
        console.log(elements);
        console.log(arrID);
    }
}

TcHmi.EventProvider.register('AddTopPaperButton.onMouseClick', function (e, data) {
    createPaper('Top');
});
TcHmi.EventProvider.register('AddSidesPaperButton.onMouseClick', function (e, data) {
    createPaper('Sides');
});
TcHmi.EventProvider.register('AddBottomPaperButton.onMouseClick', function (e, data) {
    createPaper('Bottom');
});

function deletePaper(face, controlNum) {
    let arrID = [];
    let elements = [];
    switch (face) {
        case 'Top':
            arrID = TopPaperIdAvailable;
            elements = TopPaperElements;
            break;
        case 'Sides':
            arrID = SidesPaperIdAvailable;
            elements = SidesPaperElements;
            break;
        case 'Bottom':
            arrID = BottomPaperIdAvailable;
            elements = BottomPaperElements;
            break;
    }

    let container = TcHmi.Controls.get(`${face}PaperContainer`);
    let element = TcHmi.Controls.get(`${face}Paper_${controlNum}`);
    let elementIndex = elements.indexOf(element);

    //destroy element
    console.log('deleted element ID: ' + element.getId());
    elements.splice(elementIndex, 1);
    element.destroy();
    
    //rewrite server values
    TcHmi.Symbol.writeEx("%s%PLC1.MAIN.launch.removePaperMaterial%/s%", { i: elementIndex });

    //free up ID
    arrID[controlNum] = true;

    //reposition elements
    elements = container.getChildren().slice(2);

    for (let i = 0; i < elements.length; i++) {
        elements[i].setTop(35 * i + 45);
    }
    console.log(elements);
    console.log(arrID);

    //bind
    //recoverBindings('Paper', PaperElements);
}

//TODO: rewrite, paper is positionStart-positionEnd, not material-position/position-material
TcHmi.EventProvider.register('PaperContainer.onAttached', function (e, data) {
    //get array from PLC
    TcHmi.Symbol.readEx2('%s%PLC1.StrapWrapRecipe.Paper%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            let arr = data.value;
            for (let i = data.value.length - 1; i >= 0; i--) {
                if (!arr[i].material) { //remove null materials starting from the back
                    arr.splice(i, 1);
                }
            }
            console.log('refined Paper: ');
            console.log(arr);

            //write back to server to overwrite shifted elements
            let temp = arr.slice();
            for (let i = 0; i < MaxElements - arr.length; i++) {
                temp.push({ material: '', position: 0 });
            }
            console.log(temp);
            TcHmi.Server.writeSymbol('PLC1.StrapWrapRecipe.Paper', temp, function (data) {
                if (data.error !== TcHmi.Errors.NONE) {
                    console.log('overwrite failed')
                }
                else {
                    console.log('overwrite ok')
                }
            });

            recoverElements('Paper', arr); //recover elements
        }
        else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('Paper read failed');
        }
    });
});

//TODO: rewrite
function recoverPaperElements(arr) {
    let face = TcHmi.Controls.get('PaperContainer');
    for (let i = 0; i < arr.length; i++) { //recreate material controls
        createPaperMaterial();
        //recover data
        let dataIndex = topSrcData.indexOf(arr[i].material);
        let position = arr[i].position;

        TcHmi.Controls.get(`Paper_${i}.PaperStart`).setValue(position);
        TcHmi.Controls.get(`Paper_${i}.PaperEnd`).setValue(dataIndex);

    }
}