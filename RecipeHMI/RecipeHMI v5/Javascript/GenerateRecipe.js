// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />

TcHmi.EventProvider.register('AddRecipeToDatabase.onMouseClick', function (e, data) {
    sortEntries();
    validate();
});

function validate() {
    TcHmi.Server.readSymbol([`PLC1.MAIN.validator::errors`, `PLC1.MAIN.validator::warnings`], function (data) {
        let dialogMessage;
        let errors = data.results[0].value.filter(e =>  e);
        let warnings = data.results[1].value.filter(e => e);

        console.log('errors and warnings: ');
        console.log(errors);
        console.log(warnings);

        let errorsMsg = `Correct the following errors: \n`;
        for (let i = 0; i < errors.length; i++) {
            errorsMsg += errors[i] + `\n`;
        }
        errorsMsg += `\n`;

        let warningsMsg = `The following warnings may be ignored at your discresion: \n`;
        for (let i = 0; i < warnings.length; i++) {
            warningsMsg += warnings[i] + `\n`;
        }
        warningsMsg += `\n`;

        if (errors.length == 0) { //only allow recipe creation if there are no errors, warnings may be overriden
            if (warnings.length == 0) {
                dialogMessage = 'Add recipe to database?';
            }
            else {
                dialogMessage = warningsMsg + 'Add recipe to database?';
            }
            
            if(confirm(dialogMessage)) {
                enterRecipe();
            }
        }
        else {
            if (warnings.length == 0) {
                dialogMessage = errorsMsg;
            }
            else {
                dialogMessage = warningsMsg + errorsMsg;
            }
            alert(dialogMessage);
            return;
        }
    });
}

function enterRecipe() {
    TcHmi.Server.writeSymbol(`PLC1.MAIN.generateRecipe`, true, function (data) {
        alert('Recipe added, all fields cleared!');
        reset();
    });
}

function reset() {
    for (let i = PaperElements[Surfaces.TOP].length - 1; i >= 0; i--) {
        PaperElements[Surfaces.TOP][i].destroy();
    }
    for (let i = SidesPaperElements.length - 1; i >= 0; i--) {
        SidesPaperElements[i].destroy();
    }
    for (let i = PaperElements[Surfaces.BOTTOM].length - 1; i >= 0; i--) {
        PaperElements[Surfaces.BOTTOM][i].destroy();
    }

    for (let i = CardboardElements.length - 1; i >= 0; i--) {
        CardboardElements[i].destroy();
    }
    for (let i = CornerGuardElements.length - 1; i >= 0; i--) {
        CornerGuardElements[i].destroy();
    }
    for (let i = ChipboardElements.length - 1; i >= 0; i--) {
        ChipboardElements[i].destroy();
    }
    for (let i = WoodBunkElements.length - 1; i >= 0; i--) {
        WoodBunkElements[i].destroy();
    }

    reload();
}