// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />

TcHmi.EventProvider.register('TopRender.onAttached', function (e, data) {
    //top and bottom: length x width
    //sides: length x height
    //front and back: width x height
    renderTop();
    renderSides();
    renderBottom();
});

function renderTop() {
    let length = TcHmi.Controls.get(`Length`).getValue();
    let width = TcHmi.Controls.get(`Width`).getValue();

    TcHmi.Controls.get(`TopRender`).setHeight(length);
    TcHmi.Controls.get(`TopRender`).setWidth(width);
}

function renderSides() {
    let length = TcHmi.Controls.get(`Length`).getValue();
    let height = TcHmi.Controls.get(`Height`).getValue();

    TcHmi.Controls.get(`SidesRender`).setHeight(height);
    TcHmi.Controls.get(`SidesRender`).setWidth(length);
}

function renderBottom() {
    let length = TcHmi.Controls.get(`Length`).getValue();
    let width = TcHmi.Controls.get(`Width`).getValue();

    TcHmi.Controls.get(`BottomRender`).setHeight(length);
    TcHmi.Controls.get(`BottomRender`).setWidth(width);
}