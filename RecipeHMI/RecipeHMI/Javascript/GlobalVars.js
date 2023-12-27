// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />

//max elements per container
const MaxPaper = 5;
const MaxElements = 14;

//SrcData for arrays, read with Desktop.onAttached
var topSrcData;
var sidesSrcData;
var bottomSrcData;
var upperCornerSrcData;
var lowerCornerSrcData;
//by material, capitalize everything for easy copy paste
var PaperSrcData = [];
var CardboardSrcData = [];
var CornerGuardSrcData = [];
var ChipboardSrcData = [];
var WoodBunkSrcData = [[], [], []]; //array of 3 arrays

//holds HTML elements
var topElements = [];
var sidesElements = [];
var bottomElements = [];
var upperCornerElements = [];
var lowerCornerElements = [];
//by material, capitalize everything for easy copy paste
var TopPaperElements = [];
var SidesPaperElements = [];
var BottomPaperElements = [];

var CardboardElements = [];
var CornerGuardElements = [];
var ChipboardElements = [];
var WoodBunkElements = [];

//true if ID is available, false if taken
var topIdAvailable = [];
var sidesIdAvailable = [];
var bottomIdAvailable = [];
var upperCornerIdAvailable = [];
var lowerCornerIdAvailable = [];
//by material, capitalize everything for easy copy paste
var TopPaperIdAvailable = [];
var SidesPaperIdAvailable = [];
var BottomPaperIdAvailable = [];

var CardboardIdAvailable = [];
var CornerGuardIdAvailable = [];
var ChipboardIdAvailable = [];
var WoodBunkIdAvailable = [];

//by material and sides


TcHmi.EventProvider.register('StrapWrapRecipe.onAttached', function (e, data) {
    console.log(e);

    resetAllIdAvailable();

    //read combobox SrcData from PLC
    TcHmi.Symbol.readEx2('%s%PLC1.GVL.top%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            // Handle result value... 
            topSrcData = data.value;
            console.log(topSrcData);
        } else {
            // Handle error... 
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('top read failed');
        }
    });
    TcHmi.Symbol.readEx2('%s%PLC1.GVL.sides%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            sidesSrcData = data.value;
            console.log(sidesSrcData);
        } else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('sides read failed');
        }
    });
    TcHmi.Symbol.readEx2('%s%PLC1.GVL.bottom%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            bottomSrcData = data.value;
            console.log(bottomSrcData);
        } else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('bottom read failed');
        }
    });
    TcHmi.Symbol.readEx2('%s%PLC1.GVL.upperCorner%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            upperCornerSrcData = data.value;
            console.log(upperCornerSrcData);
        } else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('upper corner read failed');
        }
    });
    TcHmi.Symbol.readEx2('%s%PLC1.GVL.lowerCorner%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            lowerCornerSrcData = data.value;
            console.log(lowerCornerSrcData);
        } else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('lower corner read failed');
        }
    });

    //read by materials
    TcHmi.Symbol.readEx2('%s%PLC1.GVL.woodBunkTop%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            WoodBunkSrcData[0] = (data.value);
            console.log(WoodBunkSrcData);
        } else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('wood bunk read failed');
        }
    });
    TcHmi.Symbol.readEx2('%s%PLC1.GVL.woodBunkSides%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            WoodBunkSrcData[1] = (data.value);
            console.log(WoodBunkSrcData);
        } else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('wood bunk read failed');
        }
    });
    TcHmi.Symbol.readEx2('%s%PLC1.GVL.woodBunkBottom%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            WoodBunkSrcData[2] = (data.value);
            console.log(WoodBunkSrcData);
        } else {
            console.log(data.error);
            console.log(TcHmi.Errors);
            console.log('wood bunk read failed');
        }
    });
});


function resetAllIdAvailable() {
    topIdAvailable = [];
    sidesIdAvailable = [];
    bottomIdAvailable = [];
    upperCornerIdAvailable = [];
    lowerCornerIdAvailable = [];

    PaperIdAvailable = [];
    CardboardIdAvailable = [];
    CornerGuardIdAvailable = [];
    ChipboardIdAvailable = [];
    woodBunkIdAvailable = [];

    TopPaperIdAvailable = [];
    SidesPaperIdAvailable = [];
    BottomPaperIdAvailable = [];

    for (let i = 0; i < MaxElements; i++) {
        topIdAvailable.push(true);
        sidesIdAvailable.push(true);
        bottomIdAvailable.push(true);
        upperCornerIdAvailable.push(true);
        lowerCornerIdAvailable.push(true);

        PaperIdAvailable.push(true);
        CardboardIdAvailable.push(true);
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