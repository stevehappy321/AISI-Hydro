// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />

let originalBundle;
let newBundle;

TcHmi.EventProvider.register('BundleProperties.onAttached', function (e, data) {
    console.log(e);
    getCompleteBundle();
});

function getCompleteBundle() {
    TcHmi.Server.readSymbol(['HmiPort.MAIN.original', 'HmiPort.MAIN.confirmed'], function (data) {
        originalBundle = data.results[0].value;
        newBundle = data.results[1].value;

        setBundleData(newBundle);
    });
}

function setBundleData(bundle) {

}