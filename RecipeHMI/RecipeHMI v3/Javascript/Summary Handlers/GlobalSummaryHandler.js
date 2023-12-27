// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function createSummary(materialType) {
    let recipe = [];
    recoverRecipe(materialType, recipe);
    recoverElements(materialType, recipe);
}

function recoverRecipe(materialType, arr) {
    TcHmi.Symbol.readEx2(`%s%PLC1.StrapWrapRecipe.${materialType}%/s%`, function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            arr = data.value.slice();
            for (let i = data.value.length - 1; i >= 0; i--) { //remove null materials starting from the back
                if (!arr[i].top && !arr[i].sides && !arr[i].bottom && !arr[i].upperCorner && !arr[i].lowerCorner) {
                    arr.splice(i, 1);
                }
            }
            console.log(`refined ${materialType}: `);
            console.log(arr);

            //overwrite shifted elements back to server
            let temp = arr.slice();
            for (let i = 0; i < MaxServerEntries - arr.length; i++) {
                temp.push({ position: -1, top: '', sides: '', bottom: '', upperCorner: '', lowerCorner: '' });
            }
            console.log(temp);
            TcHmi.Server.writeSymbol(`PLC1.StrapWrapRecipe.${materialType}`, temp, function (data) {
                if (data.error === TcHmi.Errors.NONE) {
                    console.log(`${materialType} overwrite ok`)
                }
                else {
                    console.log(`${materialType} overwrite failed`)
                }
            });
        }
        else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log(`${materialType} read failed`);
        }
    });
    return arr;
}

function recoverElements(materialType, recipe) {
    let newMaterial = TcHmi.ControlFactory.createEx(
        'TcHmi.Controls.System.TcHmiUserControlHost',
        `${materialType}_${newId}`,
        { //attributes here
            'data-tchmi-type': 'TcHmi.Controls.System.TcHmiUserControlHost',
            'data-tchmi-height': 25,
            'data-tchmi-height-unit': 'px',
            'data-tchmi-left': 10,
            'data-tchmi-left-unit': 'px',
            'data-tchmi-target-user-control': 'UserControls/SummaryElement.usercontrol',
            'data-tchmi-top': 35 * ChipboardElements.length + 45,
            'data-tchmi-top-unit': 'px',
            'data-tchmi-width': 430,
            'data-tchmi-width-unit': 'px',
            'data-tchmi-background-image-horizontal-alignment': 'Center',
            'data-tchmi-background-image-vertical-alignment': 'Center'
        },
        TcHmi.Controls.get(`${materialType}Grid`)
    );

    console.log('added element ID: ' + newMaterial.getId());

    if (face && newMaterial) face.addChild(newMaterial);

    ChipboardIdAvailable[newId] = false;
    ChipboardElements.push(newMaterial);

    //bind
    recoverBindings('Chipboard', ChipboardElements);
}