// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
let newPaperId = 0;

function createPaper(face) {
    let container = TcHmi.Controls.get(`${face}PaperGrid`);
    let arrID = [];
    switch (face) {
        case 'Top':
            elements =PaperElements[Surfaces.TOP];
            break;
        case 'Left':
            elements = PaperElements[Surfaces.LEFT];
            break;
        case 'Right':
             elements = PaperElements[Surfaces.RIGHT];
            break;
        case 'Bottom':
            elements = PaperElements[Surfaces.BOTTOM];
            break;
    }

    if (elements.length < MaxElements) {
        let newMaterial = TcHmi.ControlFactory.createEx(
            'TcHmi.Controls.System.TcHmiUserControlHost',
            `${face}Paper_${newPaperId}`,
            { //attributes here
                'data-tchmi-type': 'TcHmi.Controls.System.TcHmiUserControlHost',
                'data-tchmi-grid-row-index': 1,
                'data-tchmi-grid-column-index': 0,
                'data-tchmi-height': 25,
                'data-tchmi-height-unit': 'px',
                'data-tchmi-left': 10,
                'data-tchmi-left-unit': 'px',
                'data-tchmi-target-user-control': 'UserControls/Paper.usercontrol',
                'data-tchmi-top': 35 * elements.length,
                'data-tchmi-top-unit': 'px',
                'data-tchmi-width': 270,
                'data-tchmi-width-unit': 'px',
                'data-tchmi-background-image-horizontal-alignment': 'Center',
                'data-tchmi-background-image-vertical-alignment': 'Center'
            }
        );

        TcHmi.EventProvider.register(newMaterial.getId() + '.PaperDelete.onPressed', function (e, data) {
            deletePaper(face, newPaperId);
        });

        console.log('added element ID: ' + newMaterial.getId());

        if (container && newMaterial) container.addChild(newMaterial);

        elements.push(newMaterial);
        newPaperId++;

        //bind
        recoverBindings(`${face}Paper`, elements, 2);
    }
    else {
        console.log('Too many elements for this container');
        console.log(elements);
    }
}

TcHmi.EventProvider.register('AddTopPaper.onMouseClick', function (e, data) {
    createPaper('Top');
});
TcHmi.EventProvider.register('AddLeftPaper.onMouseClick', function (e, data) {
    createPaper('Left');
});
TcHmi.EventProvider.register('AddRightPaper.onMouseClick', function (e, data) {
    createPaper('Right');
});
TcHmi.EventProvider.register('AddBottomPaper.onMouseClick', function (e, data) {
    createPaper('Bottom');
});

function deletePaper(face, controlNum) {
    let arrID = [];
    let elements = [];
    switch (face) {
        case 'Top':
            elements = PaperElements[Surfaces.TOP];
            break;
        case 'Left':
            elements = PaperElements[Surfaces.LEFT];
            break;
        case 'Right':
            elements = PaperElements[Surfaces.RIGHT];
            break;
        case 'Bottom':
            elements = PaperElements[Surfaces.BOTTOM];
            break;
    }

    let container = TcHmi.Controls.get(`${face}PaperGrid`);
    let element = TcHmi.Controls.get(`${face}Paper_${controlNum}`);
    let elementIndex = elements.indexOf(element);

    //destroy element
    console.log('deleted element ID: ' + id + ' at index: ' + elementIndex);
    elementsArr.splice(elementIndex, 1);
    element.destroy();
    
    //rewrite server values
    TcHmi.Server.writeSymbol(`PLC1.MAIN.arrayHelpers::removePaper`, { face: face, i: elementIndex });

    //reposition elements
    for (let i = 0; i < elements.length; i++) {
        elements[i].setTop(35 * i + 45);
    }

    //bind
    recoverBindings(`${face}Paper`, elements);
}

TcHmi.EventProvider.register('PaperRecipe.onAttached', function (e, data) {
    newPaperId = 0;
    PaperElements[Surfaces.TOP] = [];
    PaperElements[Surfaces.LEFT] = [];
    PaperElements[Surfaces.RIGHT] = [];
    PaperElements[Surfaces.TOP] = [];
});

TcHmi.EventProvider.register('TopPaperGrid.onAttached', function (e, data) {
    //get array from PLC
    recoverPaperData('Top');
});
TcHmi.EventProvider.register('LeftPaperGrid.onAttached', function (e, data) { //rewriting in progress
    recoverPaperData('Left');
});
TcHmi.EventProvider.register('RightPaperGrid.onAttached', function (e, data) { //rewriting in progress
    recoverPaperData('Right');
});

TcHmi.EventProvider.register('BottomPaperGrid.onAttached', function (e, data) { //rewriting in progress
    recoverPaperData('Bottom');
});

function recoverPaperData(face) {
    TcHmi.Symbol.readEx2(`%s%PLC1.StrapWrapRecipe.${face}Paper%/s%`, function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            let arr = data.value.slice();
            for (let i = data.value.length - 1; i >= 0; i--) {
                if (!arr[i].start && !arr[i].end) {
                    arr.splice(i, 1);
                }
            }
            console.log(`refined ${face}Paper: `);
            console.log(arr);

            //write back to server to overwrite shifted elements
            let temp = arr.slice();
            for (let i = 0; i < MaxElements - arr.length; i++) {
                temp.push({ start: 0, end: 0 });
            }
            console.log(temp);
            TcHmi.Server.writeSymbol(`PLC1.StrapWrapRecipe.${face}Paper`, temp, function (data) {
                if (data.error !== TcHmi.Errors.NONE) {
                    console.log('overwrite failed')
                }
            });

            recoverElements(`${face}Paper`, arr);
        }
        else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log(`${face}Paper read failed`);
        }
    });
}