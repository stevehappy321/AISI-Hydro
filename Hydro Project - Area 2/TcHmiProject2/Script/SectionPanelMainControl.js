// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.760.48/runtimes/native1.12-tchmi/TcHmi.d.ts" />
/*
let paperPanel
let cardboardCornerGuardPanel;
let chipboardPanel;
let woodBunkPanel;
let outputPanel;
*/

TcHmi.EventProvider.register(`PaperStatusPanelMain.onAttached`, function (e, data) {
    paperPanel = new StatusPanel(`paper`, `Main`);
});
TcHmi.EventProvider.register(`PaperStatusPanelMain.onDetached`, function (e, data) {
    paperPanel.unwatch();
});


TcHmi.EventProvider.register(`CardboardCornerGuardStatusPanelMain.onAttached`, function (e, data) {
    cardboardCornerGuardPanel = new StatusPanel(`cardboardCornerGuard`, `Main`);
});
TcHmi.EventProvider.register(`CardboardCornerGuardStatusPanelMain.onDetached`, function (e, data) {
    cardboardCornerGuardPanel.unwatch();
});


TcHmi.EventProvider.register(`ChipboardStatusPanelMain.onAttached`, function (e, data) {
    chipboardPanel = new StatusPanel(`chipboard`, `Main`);
});
TcHmi.EventProvider.register(`ChipboardStatusPanelMain.onDetached`, function (e, data) {
    chipboardPanel.unwatch();
});


TcHmi.EventProvider.register(`WoodBunkStatusPanelMain.onAttached`, function (e, data) {
    woodBunkPanel = new StatusPanel(`woodBunk`, `Main`);
});
TcHmi.EventProvider.register(`WoodBunkStatusPanelMain.onDetached`, function (e, data) {
    woodBunkPanel.unwatch();
});


TcHmi.EventProvider.register(`OutputStatusPanelMain.onAttached`, function (e, data) {
    outputPanel = new StatusPanel(`output`, `Main`);
});
TcHmi.EventProvider.register(`OutputStatusPanelMain.onDetached`, function (e, data) {
    outputPanel.unwatch();
});
