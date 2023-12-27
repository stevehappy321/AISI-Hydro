// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />

//max elements per container
const MaxElements = 16;

const Surfaces = Object.freeze({
    TOP: `Top`,
    LEFT: `Left`,
    RIGHT: `Right`,
    BOTTOM: `Bottom`,

    UPPERCORNERS: `UpperCorners`,
    LOWERCORNERS: `LowerCorners`,
    CORNERS: `Corners`,

    size
});

const Shape = Object.freeze({
    RECTANGLE: 'Rectangle',
    TRAPEZOID: 'Trapezoid',
    TRIANGLE: 'Triangle',

    size
});

//src data
const PaperSrc = ['PAP28'];

const CardboardSrc = ['CAR20S', 'CAR20M', 'CAR20L', 'CAR28S', 'CAR28M', 'CAR28L']; //remember to add C-fold for sides

const CornerGuardSrc = ['COR48', 'COR96'];

const ChipboardSrc = [];

const WoodBunkTopSrc = ['WDT20', 'WDT22', 'WDT28', 'WDW20', 'WDW22'];

const WoodBunkSidesSrc = [
    'WDS08', 'WDS10', 'WDS12', 'WDS14', 'WDS20','WDS22', 'WDS28', 
    'WDS8x8', 'WDS8x10', 'WDS12x12', 'WDS12x14', 'WDS20x10', 'WDS20x12'];

const WoodBunkBottomSrc = ['WDB20', 'WDB22', 'WDB28'];