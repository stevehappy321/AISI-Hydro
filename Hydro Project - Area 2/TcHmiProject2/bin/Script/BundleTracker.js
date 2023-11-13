// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.760.48/runtimes/native1.12-tchmi/TcHmi.d.ts" />

const color = [
    `red`,
    `orange`,
    `yellow`,
    `green`,
    `blue`,
    `purple`
];

const Sections = {
    PAPER: 0,
    CARDBOARD_CORNERGUARD: 1,
    CHIPBOARD: 2,
    WOOD_BUNK: 3,
    OUTPUT: 4,

    size: 5
}

const markerLength = 150;
const markerHeight = 60;
const SectionUiPositions = { //left only, calculate right by adding with markerLength
    PAPER: 1080,
    CARDBOARD_CORNERGUARD: 610,
    CHIPBOARD: 390,
    WOOD_BUNK: 190,
    OUTPUT: 10,
    
    TRANSIT_PAPER: 1300,
    TRANSIT_CARDBOARD_CORNERGUARD: 850,
    size: 7
}

const paperPos = 1150;
const cardboardCornerGuardPos = 690;
const chipboardPos = 480;
const woodBunkPos = 280;
const outputPos = 40;

let bundlesQueueWatchdog;
let bundlesQueue = [];

let sectionsIteratorWatchdog;
let sectionsIterator = [];

let sectionsBusyWatchdog;
let sectionsBusy = [];

let sectionsBusyIndex = []; //1 per section
let transitionBundleIndexes = [[]]; //many per transition

let iMarker = 0;
let markers = [];

function watchBundlesQueue() {
    let symbolName = `PLC1.MAIN.bundlesQueue`;
    let symbol = new TcHmi.Symbol(`%s%` + symbolName + `%/s%`);

    var destroySymbol = symbol.watch(function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            var value = data.value;
            bundlesQueue = value;//.filter(item => item.id !== '');
            console.log(bundlesQueue);
        }
        else {
            console.log(`watch failed: ` + symbolName);
        }
    });
    return destroySymbol;
}

function watchsectionsIterator() {
    let symbolName = `PLC1.MAIN.sectionsIterator`;
    let symbol = new TcHmi.Symbol(`%s%` + symbolName + `%/s%`);

    var destroySymbol = symbol.watch(function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            var value = data.value;
            sectionsIterator = value;
            console.log(value);

            updateBundles();
        }
        else { console.log(`watch failed: ` + symbolName); }
    });
    return destroySymbol;
}

function watchsectionsBusy() {
    let symbolName = `PLC1.MAIN.sectionsBusy`;
    let symbol = new TcHmi.Symbol(`%s%` + symbolName + `%/s%`);

    var destroySymbol = symbol.watch(function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            var value = data.value;
            sectionsBusy = value;
            console.log(value);

            updateBundles();
        }
        else { console.log(`watch failed: ` + symbolName); }
    });
    return destroySymbol;
}

TcHmi.EventProvider.register(`StartPage.onAttached`, function (e, data) {
    iMarker = 0;
    bundlesQueueWatchdog = watchBundlesQueue();
    sectionsIteratorWatchdog = watchsectionsIterator();
    sectionsBusyWatchdog = watchsectionsBusy();
    
});

TcHmi.EventProvider.register(`StartPage.onDetached`, function (e, data) {
    iMarker = 0;
    bundlesQueueWatchdog();
    sectionsIterator();
    sectionsBusy();
});

/*
if bundle[iBundle] is valid but section is not ACTIVE, then bundle is still in transition
*/
function updateBundles() {
    setSectionBundleIndexes();
    setTransitionBundleIndexes();
    calculateLinks();
}

/*
indexes of bundles in between = [prev.iterator-1] to [this.iterator (+1 if this.bundleOut exists)] //iterate through this backwards
# of bundles in between = (prev.iterator) - (this.iterator) (-1 if this.bundleOut exists) //-1 indicates that 2 sections are processing same bundle
*/
function setSectionBundleIndexes() {
    for (let i = 0; i < Sections.size; i++) {
        if (sectionsBusy[i]) {
            sectionsBusyIndex[i] = sectionsIterator[i];
        }
        else {
            sectionsBusyIndex[i] = -1; //set current section's ACTIVE bundle index
        }
    }
}

function setTransitionBundleIndexes() {
    for (let i = 0; i < Sections.size; i++) {

        let temp = sectionsIterator[i];
        if (sectionsBusyIndex[i] > -1) { //if section is active, start loop from next index
            temp++;
        }

        if (i == Sections.PAPER) {
            //for (let j = GVL.maxQueue; j >= temp; j--) {
            for (let j = temp; j <= 16; j++) {
                if (BundleIsValid(bundlesQueue[j])) {
                    transitionBundleIndexes[i].push(j);
                }
            }
        }
        else {
            for (let j = temp; j < sectionsIterator[i - 1] - 1; j++) {
                if (BundleIsValid(bundlesQueue[j])) {
                    transitionBundleIndexes[i].push(j);
                }
            }
        }

    }
}

function calculateLinks() {
    //a short bundle that is actively being processed at a section can be defined as a link of 1 section
    let iteratorLink = -1;
    let bundleOutIndexLink = -1;
    let startLink = -1;
    let endLink = -1;

    for (let i = 0; i < Sections.size; i++) {
        let left;
        let right;

        switch (startLink) {
            case Sections.PAPER:
                right = SectionUiPositions.PAPER;
                break;
            case Sections.CARDBOARD_CORNERGUARD:
                right = SectionUiPositions.CARDBOARD_CORNERGUARD;
                break;
            case Sections.CHIPBOARD:
                right = SectionUiPositions.CHIPBOARD;
                break;
            case Sections.WOOD_BUNK:
                right = SectionUiPositions.WOOD_BUNK;
                break;
            case Sections.OUTPUT:
                right = SectionUiPositions.OUTPUT;
                break;
            default:
                right = -1000;
        }

        switch (endLink) {
            case Sections.PAPER:
                left = SectionUiPositions.PAPER;
                break;
            case Sections.CARDBOARD_CORNERGUARD:
                left = SectionUiPositions.CARDBOARD_CORNERGUARD;
                break;
            case Sections.CHIPBOARD:
                left = SectionUiPositions.CHIPBOARD;
                break;
            case Sections.WOOD_BUNK:
                left = SectionUiPositions.WOOD_BUNK;
                break;
            case Sections.OUTPUT:
                left = SectionUiPositions.OUTPUT;
                break;
            default:
                left = -1000;
        }

        if (iteratorLink[i] == -1 || bundleOutIndexLink == -1 || startLink == -1) { //link not started because any of these values are not initialized
            if (sectionsBusyIndex[i] > -1) { //start link
                iteratorLink = sectionsIterator[i];
                bundleOutIndexLink = sectionsBusyIndex[i];
                startLink = i;
                endLink = i;
            }
            continue;
        }

        //end link when different iterator or different bundleOut
        if (sectionsIterator[i] != iteratorLink || sectionsBusyIndex[i] != bundleOutIndexLink) {

            drawBundleMarkers(left, (right + markerLength) - left);

            startLink = i;
            endLink = i;
            iteratorLink = sectionsIterator[i];
            bundleOutIndexLink = sectionsBusyIndex[i];

            continue;
        }
        endLink = i;
    }

    if (startLink > -1 && endLink > -1 && bundleOutIndexLink > -1) {
        //drawBundleMarkers(startLink, endLink);
        startLink = -1;
        endLink = -1;
    }
}

/*
draw a rectangle with a length based on the measurements
*/
function drawBundleMarkers(left, width) {
    var newMarker = TcHmi.ControlFactory.createEx(
        `TcHmi.Controls.Beckhoff.TcHmiRectangle`,
        `Marker_${iMarker}`,
        {
            'data-tchmi-height': markerHeight,
            'data-tchmi-height-unit': 'px',
            'data-tchmi-left': left,
            'data-tchmi-left-unit': 'px',
            'data-tchmi-top': 120 ,
            'data-tchmi-top-unit': 'px',
            'data-tchmi-width': width,
            'data-tchmi-width-unit': 'px',
            'data-tchmi-stroke-thickness': 3,
            'data-tchmi-zindex': 3,

            'data-tchmi-fill-color': {
                'color': 'rgba(0, 255, 91, 0.5647058)'
            }
        }
    );
    iMarker++;

    var parent = TcHmi.Controls.get('CellContainer');
    if (parent && newMarker) {
        parent.addChild(newMarker);
        markers.push(newMarker);
    }
}