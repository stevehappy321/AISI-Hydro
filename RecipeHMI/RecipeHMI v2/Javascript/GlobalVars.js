// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />

//max elements per container
const MaxElements = 16;

//max dynamic controls, to be phased out and replaced with MaxElements
const MaxPaper = 5;
const MaxCardboard = 12;
const MaxCornerGuard = 5;
const MaxWoodBunk = 8
const MaxChipboard = 8;
const MaxWrap = 10;

//src data
var PaperSrcData = [];

var CardboardSurfacesSrcData = [];
var CardboardCornersSrcData = [];

var CornerGuardSrcData = [];

var ChipboardSrcData = [];

var WoodBunkTopSrcData = [];
var WoodBunkSidesSrcData = [];
var WoodBunkBottomSrcData = [];
//---------------------

//TcHmi/HTML elements
var TopPaperElements = [];
var SidesPaperElements = [];
var BottomPaperElements = [];

var CardboardElements = [];
var CornerGuardElements = [];
var ChipboardElements = [];
var WoodBunkElements = [];

var PaperWrapElements = [];
var CardboardWrapElements = [];
//---------------------

TcHmi.EventProvider.register('PackagingMenu.onAttached', function (e, data) {

    //read combobox source data by materials
    PaperSrcData = [];

    CardboardSurfacesSrcData = [];
    CardboardCornersSrcData = [];

    CornerGuardSrcData = [];

    ChipboardSrcData = [];

    WoodBunkTopSrcData = [];
    WoodBunkSidesSrcData = [];
    WoodBunkBottomSrcData = [];

    TcHmi.Symbol.readEx2('%s%PLC1.GVL.Paper%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            PaperSrcData = (data.value);
            console.log(PaperSrcData);
        } else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('Paper read failed');
        }
    });

    TcHmi.Symbol.readEx2('%s%PLC1.GVL.CardboardSurfaces%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            CardboardSurfacesSrcData = data.value;
            console.log(CardboardSurfacesSrcData);
        } else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('Cardboard (Surfaces) read failed');
        }
    });
    TcHmi.Symbol.readEx2('%s%PLC1.GVL.CardboardCorners%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            CardboardCornersSrcData = data.value;
            console.log(CardboardCornersSrcData);
        } else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('Cardboard (Corners) read failed');
        }
    });

    TcHmi.Symbol.readEx2('%s%PLC1.GVL.CornerGuard%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            CornerGuardSrcData = (data.value);
            console.log(CornerGuardSrcData);
        } else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('Corner Guard read failed');
        }
    });

    TcHmi.Symbol.readEx2('%s%PLC1.GVL.Chipboard%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            ChipboardSrcData = (data.value);
            console.log(ChipboardSrcData);
        } else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('Chipboard read failed');
        }
    });

    TcHmi.Symbol.readEx2('%s%PLC1.GVL.WoodBunkTop%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            WoodBunkTopSrcData = data.value;
            console.log(WoodBunkTopSrcData);
        } else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('Wood Bunk (Top) read failed');
        }
    });
    TcHmi.Symbol.readEx2('%s%PLC1.GVL.WoodBunkSides%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            WoodBunkSidesSrcData = data.value;
            console.log(WoodBunkSidesSrcData);
        } else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('Wood Bunk (Sides) read failed');
        }
    });
    TcHmi.Symbol.readEx2('%s%PLC1.GVL.WoodBunkBottom%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            WoodBunkBottomSrcData = data.value;
            console.log(WoodBunkBottomSrcData);
        } else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('Wood Bunk (Bottom) read failed');
        }
    });
});

function resetAllIdAvailable() {
    CornerGuardIdAvailable = [];
    ChipboardIdAvailable = [];
    WoodBunkIdAvailable = [];

    TopPaperIdAvailable = [];
    SidesPaperIdAvailable = [];
    BottomPaperIdAvailable = [];

    for (let i = 0; i < MaxElements; i++) {
        CornerGuardIdAvailable.push(true);
        ChipboardIdAvailable.push(true);
        WoodBunkIdAvailable.push(true);
    }

    for (let i = 0; i < MaxPaper; i++) {
        TopPaperIdAvailable.push(true);
        SidesPaperIdAvailable.push(true);
        BottomPaperIdAvailable.push(true);
    }
}