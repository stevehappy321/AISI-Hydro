// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />

TcHmi.EventProvider.register('SortEntries.onMouseClick', function (e, data) { //delete bindings, sort data, manually set data, create 2 way bindings
    sortEntries();
});

function sortEntries() {
    //delete bindings
    deleteBindings('TopPaper', TopPaperElements);
    deleteBindings('LeftPaper', SidesPaperElements);
    deleteBindings('RightPaper', SidesPaperElements);
    deleteBindings('BottomPaper', BottomPaperElements);

    deleteBindings('Cardboard', CardboardElements);
    deleteBindings('CornerGuard', CornerGuardElements);
    deleteBindings('Chipboard', ChipboardElements);
    deleteBindings('WoodBunk', WoodBunkElements);

    //sort data server side
    TcHmi.Server.readSymbol(`PLC1.MAIN.arrayHelpers::sortEntries`, function (data) {
        console.log('sorting entries');

        //manually set data
        recoverData('TopPaper', TopPaperElements);
        recoverData('LeftPaper', LeftPaperElements);
        recoverData('RightPaper', LeftPaperElements);
        recoverData('BottomPaper', BottomPaperElements);

        recoverData('Cardboard', CardboardElements);
        recoverData('CornerGuard', CornerGuardElements);
        recoverData('Chipboard', ChipboardElements);
        recoverData('WoodBunk', WoodBunkElements);

        //recover 2 way bindings
        recoverBindings('TopPaper', TopPaperElements, 2);
        recoverBindings('LeftPaper', LeftPaperElements, 2);
        recoverBindings('RightPaper', RightPaperElements, 2);
        recoverBindings('BottomPaper', BottomPaperElements, 2);

        recoverBindings('Cardboard', CardboardElements, 2);
        recoverBindings('CornerGuard', CornerGuardElements, 2);
        recoverBindings('Chipboard', ChipboardElements, 2);
        recoverBindings('WoodBunk', WoodBunkElements, 2);
    });
}

