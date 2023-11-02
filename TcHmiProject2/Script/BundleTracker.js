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
let transitionBundleIndexes = []; //many per transition

let iMarkerColor = 0;
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

            updateBundles();
        }
        else {
            console.log(`watch failed: ` + symbolName);
        }
    });
    return destroySymbol;
}

function watchSectionsIterator() {
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

function watchSectionsBusy() {
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
    sectionsBusyWatchdog = watchSectionsBusy();
    sectionsIteratorWatchdog = watchSectionsIterator();
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
    console.log('updating bundles');
    for (let i = 0; i < markers.length; i++) {
        markers[i].destroy();
    }
    
    setSectionBundleIndexes();
    setTransitionBundleIndexes();
    calculateLinks();
    calculateTransitions();
}

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

/*
indexes of bundles in between = [prev.iterator-1] to [this.iterator (+1 if this.bundleOut exists)] //iterate through this backwards
# of bundles in between = (prev.iterator) - (this.iterator) (-1 if this.bundleOut exists) //-1 indicates that 2 sections are processing same bundle
*/
function setTransitionBundleIndexes() {
    for (let i = 0; i < Sections.size; i++) {
        transitionBundleIndexes[i] = [];
        let temp = sectionsIterator[i];
        if (sectionsBusyIndex[i] > -1) { //if section is active, start loop from next index
            temp++;
        }
        
        if (i == Sections.PAPER) {
            console.log(`indexes of transitioning[${i}] bundles: ${temp}, ${17 - 1} `);
            for (let j = temp; j <= 16; j++) {
                console.log(`checking bundle`)
                console.log(bundlesQueue[j])
                if (BundleIsValid(bundlesQueue[j])) {
                    console.log(`pushing ${j} into transitionBundleIndexes[${i}]`)
                    transitionBundleIndexes[i].push(j);
                }
            }
        }
        else {
            console.log(`indexes of transitioning[${i}] bundles: ${temp}, ${sectionsIterator[i - 1] - 1} `);
            for (let j = temp; j <= sectionsIterator[i - 1] - 1; j++) {
                console.log(`checking bundle`)
                console.log(bundlesQueue[j])
                if (BundleIsValid(bundlesQueue[j])) {
                    console.log(`pushing ${j} into transitionBundleIndexes[${i}]`)
                    transitionBundleIndexes[i].push(j);
                }
            }
        }

    }
    console.log(`transitionBundleIndexes: `);
    console.log(transitionBundleIndexes);
}

function calculateLinks() {
    //a short bundle that is actively being processed at a section can be defined as a link of 1 section
    let iteratorLink = -1;
    let busyIndexLink = -1;
    let startLink = -1;
    let endLink = -1;

    let left;
    let right;

    for (let i = 0; i < Sections.size; i++) {
        right = getMarkerPos(startLink);
        left = getMarkerPos(endLink);

        console.log(`section[${i}] data: `)
        console.log(sectionsIterator[i]);
        console.log(sectionsBusyIndex[i]);

        if (iteratorLink[i] == -1 || busyIndexLink == -1 || startLink == -1) { //link not started because any of these values are not initialized
            if (sectionsBusyIndex[i] > -1) { //start link
                iteratorLink = sectionsIterator[i];
                busyIndexLink = sectionsBusyIndex[i];
                startLink = i;
                endLink = i;
            }
            continue;
        }

        //end link when different iterator or different bundleOut
        if (sectionsIterator[i] != iteratorLink || sectionsBusyIndex[i] != busyIndexLink) {

            drawBundleMarkers(left, (right + markerLength) - left);

            startLink = i;
            endLink = i;
            iteratorLink = sectionsIterator[i];
            busyIndexLink = sectionsBusyIndex[i];

            continue;
        }
        endLink = i;
    }

    if (startLink > -1 && endLink > -1 && busyIndexLink > -1) {
        right = getMarkerPos(startLink);
        left = getMarkerPos(endLink);
        drawBundleMarkers(left, (right + markerLength) - left);
        startLink = -1;
        endLink = -1;
    }
    iMarkerColor = 0;
}

function getMarkerPos(sectionEnum) {
    let temp;
    switch (sectionEnum) {
        case Sections.PAPER:
            temp = SectionUiPositions.PAPER;
            break;
        case Sections.CARDBOARD_CORNERGUARD:
            temp = SectionUiPositions.CARDBOARD_CORNERGUARD;
            break;
        case Sections.CHIPBOARD:
            temp = SectionUiPositions.CHIPBOARD;
            break;
        case Sections.WOOD_BUNK:
            temp = SectionUiPositions.WOOD_BUNK;
            break;
        case Sections.OUTPUT:
            temp = SectionUiPositions.OUTPUT;
            break;
        default:
            temp = -1000;
            break;
    }
    return temp;
}

//bundles that are between units
function calculateTransitions() {
    for (let i = Sections.PAPER; i <= Sections.CARDBOARD_CORNERGUARD; i++) { //input buffer and inbetween paper/board
        if (transitionBundleIndexes[i].length > 0) {
            let left;
            switch (i) {
                case Sections.PAPER:
                    left = SectionUiPositions.TRANSIT_PAPER;
                    break
                case Sections.CARDBOARD_CORNERGUARD:
                    left = SectionUiPositions.TRANSIT_CARDBOARD_CORNERGUARD;
                    break;
            }
            drawBundleMarkers(left, markerLength);
        }
    }
}