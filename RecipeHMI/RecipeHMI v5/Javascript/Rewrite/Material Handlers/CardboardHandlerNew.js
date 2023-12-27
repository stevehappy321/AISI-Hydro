// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
let newCardboardId = 0;

TcHmi.EventProvider.register('AddCardboard.onMouseClick', function (e, data) {
    cardboard.push({ position: 0, top: '', left: '', right: '', bottom: '', upperCorners: '', lowerCorners: '' });
    createCardboard();
});

function createCardboard(surface) {
    if (CardboardElements.length < MaxElements) {
        var container = TcHmi.Controls.get(`${surface}CardboardGrid`);

        let newMaterial = TcHmi.ControlFactory.createEx(
            'TcHmi.Controls.System.TcHmiUserControlHost',
            `${surface}Cardboard_${newCardboardId}`,
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
            deleteCardboard(surface, newMaterial.getId());
        });

        console.log('added element ID: ' + newMaterial.getId());

        if (container && newMaterial) container.addChild(newMaterial);

        CardboardElements.push(newMaterial);
        newCardboardId++;

        //set data using array
        setData(materialType, CardboardElements, cardboard);

    }
    else {
        console.log('Too many elements for this container')
    }
}

function deleteCardboard(surface, id) {
    let elementsArr = CardboardElements[surface];
    let entriesArr = cardboardEntries[surface];

    let container = TcHmi.Controls.get(`${surface}CardboardGrid`);
    let element = TcHmi.Controls.get(id);
    let index = elementsArr.indexOf(element);

    //destroy element
    console.log('deleted element ID: ' + id + ' at index: ' + index);

    elementsArr.splice(index, 1);
    entriesArr.splice(index, 1);

    element.destroy();

    //reposition elements
    for (let i = 0; i < elementsArr.length; i++) {
        elementsArr[i].setTop(35 * i);
    }
}

TcHmi.EventProvider.register('CardboardRecipe.onAttached', function (e, data) {
    newCardboardId = 0;
    cardboardEntries = [];
});

TcHmi.EventProvider.register('TopCardboardGrid.onAttached', function (e, data) {
    let surface = Surfaces.TOP;
    let entriesArr = cardboardEntries[surface];

    CardboardElements[surface] = [];
    recoverElements('Cardboard', entriesArr, function () { createCardboard(surface) });
});

TcHmi.EventProvider.register('LeftCardboardGrid.onAttached', function (e, data) {
    let surface = Surfaces.LEFT;
    let entriesArr = cardboardEntries[surface];

    CardboardElements[surface] = [];
    recoverElements('Cardboard', entriesArr, function () { createCardboard(surface) });
});

TcHmi.EventProvider.register('RightCardboardGrid.onAttached', function (e, data) {
    let surface = Surfaces.RIGHT;
    let entriesArr = cardboardEntries[surface];

    CardboardElements[surface] = [];
    recoverElements('Cardboard', entriesArr, function () { createCardboard(surface) });
});

TcHmi.EventProvider.register('BottomCardboardGrid.onAttached', function (e, data) {
    let surface = Surfaces.BOTTOM;
    let entriesArr = cardboardEntries[surface];

    CardboardElements[surface] = [];
    recoverElements('Cardboard', entriesArr, function () { createCardboard(surface) });
});

TcHmi.EventProvider.register('CornersCardboardGrid.onAttached', function (e, data) {
    let surface = Surfaces.CORNERS;
    let entriesArr = cardboardEntries[surface];

    CardboardElements[surface] = [];
    recoverElements('Cardboard', entriesArr, function () { createCardboard(surface) });
});