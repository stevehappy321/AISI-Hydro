// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.760.48/runtimes/native1.12-tchmi/TcHmi.d.ts" />

class Bundle {
    constructor(id, bLength, bHeight) {
        this.bId = bId;
        this.bLength = bLength;
        this.bHeight = bHeight;
        this.position;

        this.section = Sections.PAPER;
    }
}

function BundleIsValid(bundle) {
    return (bundle.id != '')
}