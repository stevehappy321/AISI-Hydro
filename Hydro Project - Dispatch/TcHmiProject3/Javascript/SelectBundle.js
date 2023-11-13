// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
let datagridUpdater;
let selectedBundle;

let prevBasicBundlesArr;
let basicBundlesArr;

let defaultBasicBundle = {
    "Select": false,
    "BundleID": '',
    "Weight": 0,
    "BundleLength": 0,
    "BundleWidth": 0,
    "BundleHeight": 0,
    "ExtrusionWeight": 0,
    "ExtrusionWidth": 0,
    "ExtrusionHeight": 0,
    "TotalExtrusions": 0,
    "Layers": 0,
    "ExtrusionsPerLayer": 0
};

TcHmi.EventProvider.register('BasicBundlesDatagrid.onAttached', function (e, data) {
    console.log(e);

    updateList();
    datagridUpdater = window.setInterval(readAndSetBundles, 500);
});

function readAndSetBundles() {
    TcHmi.Server.readSymbol('HmiPort.FindBundlesFromDb.basicBundlesArr', function (data) {
        
        if (data.results.value) {
            basicBundlesArr = data.results.value.filter(e => e);
        }
        else {
            basicBundlesArr = [defaultBasicBundle, defaultBasicBundle];
        }


        if (!isEqual(prevBasicBundlesArr, basicBundlesArr)) {
            console.log('arrays differ');
            console.log(prevBasicBundlesArr);
            console.log(basicBundlesArr);

            prevBasicBundlesArr = basicBundlesArr;
            TcHmi.Controls.get('BasicBundlesDatagrid').setSrcData(basicBundlesArr);
        }
    });
}

TcHmi.EventProvider.register('BasicBundlesDatagrid.onDetached', function (e, data) {
    console.log(e);
    window.clearInterval(datagridUpdater);
    identifySelectedBundle();
});

TcHmi.EventProvider.register('BundleSelectButton.onMouseClick', function (e, data) {
    console.log(e);
    identifySelectedBundle();
});

/*
this function is called when the user clicks the Select button or leaves the page
*/
function identifySelectedBundle() {
    let datagridArr = TcHmi.Controls.get('BasicBundlesDatagrid').getSrcData();

    for (let i = 0; i < datagridArr.length; i++) {
        if (datagridArr[i].Select) {
            selectedBundle = datagridArr[i];
            //delete selectedBundle.Select;
            return selectedBundle;
        }
    }
}


function updateList() {
    /*
    var symbol = new TcHmi.Symbol('%s%PLC1.MAIN.sTest%/s%');
    var destroySymbol = symbol.watch(function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            // Handle result value... 
            var value = data.value;
            console.log(value);
        } else {
            // Handle error... 
        }
        // Stop watch inline
        // data.destroy(); // Call the destroy function inline to stop the watch and free resources. 
    });
    */
}