// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.760.48/runtimes/native1.12-tchmi/TcHmi.d.ts" />

const red = { color: 'rgba(255, 32, 32, 1)' };
const green = { color: 'rgba(0,255,0,1)' };

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

class StatusPanel {
    constructor(name, extensionName) { //use camelCase
        this.name = name;
        this.extensionName = extensionName;

        this.ready = this.watchVar('ready');
        this.busy = this.watchVar('busy');
        this.done = this.watchVar('done');
        this.error = this.watchVar('error');
        this.backlog = this.watchVar('backlog');
    }

    unwatch() {
        this.ready();
        this.busy();
        this.done();
        this.error();
        this.backlog();
    }

    watchVar(statusVar) {
        let section = this.name;
        
        let symbol = new TcHmi.Symbol(`%s%PLC1.MAIN.${section}Section::${statusVar}%/s%`);
        var destroySymbol = symbol.watch(function (data) {
            if (data.error === TcHmi.Errors.NONE) {
                var value = data.value;
                console.log(value);
                if (value) {
                    TcHmi.Controls
                        .get(`${capitalizeFirstLetter(section)}StatusPanel${this.extensionName}.${capitalizeFirstLetter(statusVar)}LED`)
                        .setFillColor(green);
                }
                else {
                    TcHmi.Controls
                        .get(`${capitalizeFirstLetter(section)}StatusPanel${this.extensionName}.${capitalizeFirstLetter(statusVar)}LED`)
                        .setFillColor(red);
                }
            }
            else {
                console.log(
                    `could not watch
                    PLC1.MAIN.${section}Section::${statusVar}`);
            }
        });

        return destroySymbol;
    }
}