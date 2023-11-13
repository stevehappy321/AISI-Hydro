// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.760.48/runtimes/native1.12-tchmi/TcHmi.d.ts" />

let paperPanel
let cardboardCornerGuardPanel;
let chipboardPanel;
let woodBunkPanel;
let outputPanel;

TcHmi.EventProvider.register(`PaperStatusPanel.onAttached`, function (e, data) {
    paperPanel = new StatusPanel(`paper`, ``);
});
TcHmi.EventProvider.register(`PaperStatusPanel.onDetached`, function (e, data) {
    paperPanel.unwatch();
});


TcHmi.EventProvider.register(`CardboardCornerGuardStatusPanel.onAttached`, function (e, data) {
    cardboardCornerGuardPanel = new StatusPanel(`cardboardCornerGuard`, ``);
});
TcHmi.EventProvider.register(`CardboardCornerGuardStatusPanel.onDetached`, function (e, data) {
    cardboardCornerGuardPanel.unwatch();
});


TcHmi.EventProvider.register(`ChipboardStatusPanel.onAttached`, function (e, data) {
    chipboardPanel = new StatusPanel(`chipboard`, ``);
});
TcHmi.EventProvider.register(`ChipboardStatusPanel.onDetached`, function (e, data) {
    chipboardPanel.unwatch();
});


TcHmi.EventProvider.register(`WoodBunkStatusPanel.onAttached`, function (e, data) {
    woodBunkPanel = new StatusPanel(`woodBunk`, ``);
});
TcHmi.EventProvider.register(`WoodBunkStatusPanel.onDetached`, function (e, data) {
    woodBunkPanel.unwatch();
});


TcHmi.EventProvider.register(`OutputStatusPanel.onAttached`, function (e, data) {
    outputPanel = new StatusPanel(`output`, ``);
});
TcHmi.EventProvider.register(`OutputStatusPanel.onDetached`, function (e, data) {
    outputPanel.unwatch();
});