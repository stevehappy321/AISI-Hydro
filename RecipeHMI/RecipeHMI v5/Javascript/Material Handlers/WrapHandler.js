// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
let newWrapId = 0;

TcHmi.EventProvider.register('WrapPoints.onAttached', function (e, data) {
    newWrapId = 0;
    PaperWrapElements = [];
    CardboardWrapElements = [];
});

function createWrap(wrapType) {
    let container = TcHmi.Controls.get(`${wrapType}WrapContainer`);
    let elements = [];
    switch (wrapType) {
        case 'Paper':
            elements = PaperWrapElements;
            break;
        case 'Cardboard':
            elements = CardboardWrapElements;
            break;
    }

    if (elements.length < MaxPaper) {
        let newMaterial = TcHmi.ControlFactory.createEx(
            'TcHmi.Controls.System.TcHmiUserControlHost',
            `${wrapType}Wrap_${newWrapId}`,
            { //attributes here
                'data-tchmi-type': 'TcHmi.Controls.System.TcHmiUserControlHost',
                'data-tchmi-height': 25,
                'data-tchmi-height-unit': 'px',
                'data-tchmi-left': 10,
                'data-tchmi-left-unit': 'px',
                'data-tchmi-target-user-control': 'UserControls/Wrap.usercontrol',
                'data-tchmi-top': 35 * elements.length + 80,
                'data-tchmi-top-unit': 'px',
                'data-tchmi-width': 250,
                'data-tchmi-width-unit': 'px',
                'data-tchmi-background-image-horizontal-alignment': 'Center',
                'data-tchmi-background-image-vertical-alignment': 'Center'
            },
            container
        );

        TcHmi.EventProvider.register(newMaterial.getId() + '.WrapDelete.onPressed', function (e, data) {
            deleteWrap(wrapType, `${wrapType}Wrap_${newWrapId}`);
        });

        console.log('added element ID: ' + newMaterial.getId());

        if (container && newMaterial) container.addChild(newMaterial);

        elements.push(newMaterial);
        newWrapId++;

        //bind
        recoverBindings(`${wrapType}Wrap`, elements, 2);
    }
    else {
        console.log('Too many elements for this container');
        console.log(elements);
    }
}

TcHmi.EventProvider.register('AddPaperWrap.onMouseClick', function (e, data) {
    console.log(e);
    createWrap('Paper');
});
TcHmi.EventProvider.register('AddCardboardWrap.onMouseClick', function (e, data) {
    console.log(e);
    createWrap('Cardboard');
});

function deleteWrap(wrapType, id) {
    let elements = [];
    switch (wrapType) {
        case 'Paper':
            elements = PaperWrapElements;d
            break;
        case 'Cardboard':
            elements = CardboardWrapElements;
            break;
    }

    let container = TcHmi.Controls.get(`${wrapType}WrapContainer`);
    let element = TcHmi.Controls.get(id);
    let elementIndex = elements.indexOf(element);

    //destroy element
    console.log('deleted element ID: ' + id + ' at index: ' + elementIndex);
    elements.splice(elementIndex, 1);
    element.destroy();
    
    //rewrite server values
    TcHmi.Server.writeSymbol(`PLC1.MAIN.arrayHelpers::removeWrap`, { wrapType: wrapType, i: elementIndex });

    //reposition elements
    for (let i = 0; i < elements.length; i++) {
        elements[i].setTop(35 * i + 80);
    }
    console.log(elements);

    //bind
    recoverBindings(`${wrapType}Wrap`, elements);
}

TcHmi.EventProvider.register('PaperWrapContainer.onAttached', function (e, data) {
    TcHmi.Symbol.readEx2('%s%PLC1.StrapWrapRecipe.PaperWrap%/s%', function (data) { //get array from PLC
        if (data.error === TcHmi.Errors.NONE) {
            let arr = data.value;
            for (let i = arr.length - 1; i >= 0; i--) {
                if (!arr[i].position && !arr[i].rotations) { //remove empty entries starting from the back
                    arr.splice(i, 1);
                }
            }
            console.log('refined PaperWrap: ');
            console.log(arr);

            //pad unused entries and rewrite to server
            let temp = arr.slice();
            for (let i = 0; i < MaxElements - arr.length; i++) {
                temp.push({ position: 0, rotations: 0 });
            }
            console.log(temp);
            TcHmi.Server.writeSymbol('PLC1.StrapWrapRecipe.PaperWrap', temp, function (data) {
                if (data.error !== TcHmi.Errors.NONE) {
                    console.log('overwrite failed');
                }
            });

            recoverWrapElements('Paper', arr);
        }
        else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('PaperWrap read failed');
        }
    });
});
TcHmi.EventProvider.register('CardboardWrapContainer.onAttached', function (e, data) {
    TcHmi.Symbol.readEx2('%s%PLC1.StrapWrapRecipe.CardboardWrap%/s%', function (data) { //get array from PLC
        if (data.error === TcHmi.Errors.NONE) {
            let arr = data.value;
            for (let i = arr.length - 1; i >= 0; i--) {
                if (!arr[i].position && !arr[i].rotations) { //remove empty entries starting from the back
                    arr.splice(i, 1);
                }
            }
            console.log('refined CardboardWrap: ');
            console.log(arr);

            //pad unused entries and rewrite to server
            let temp = arr.slice();
            for (let i = 0; i < MaxElements - arr.length; i++) {
                temp.push({ position: 0, rotations: 0 });
            }
            console.log(temp);
            TcHmi.Server.writeSymbol('PLC1.StrapWrapRecipe.CardboardWrap', temp, function (data) {
                if (data.error !== TcHmi.Errors.NONE) {
                    console.log('overwrite failed');
                }
            });

            recoverWrapElements('Cardboard', arr);
        }
        else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('CardboardWrap read failed');
        }
    });
});

function recoverWrapElements(wrapType, arr) {
    let container = TcHmi.Controls.get(`${wrapType}WrapContainer`);
    for (let i = 0; i < arr.length; i++) { //recreate material controls
        createWrap(wrapType);
        console.log(arr[i])
    }
}