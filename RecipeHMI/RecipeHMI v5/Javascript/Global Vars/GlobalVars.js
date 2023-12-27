// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />

//TcHmi/HTML elements, 2d arrays
var PaperElements = [];
var CardboardElements = [];
var CornerGuardElements = [];
var ChipboardElements = [];
var WoodBunkElements = [];

//figure out how to format these
var PaperWrapElements = [];
var CardboardWrapElements = [];
//---------------------

//general bundle data
var length;
var width;
var height;

var profileLength;
var profileWidth;
var profileHeight;

var pieces;
var layers;
var piecesPerLayer;

var crossSection; //use Shape ENUM

//bundle recipe entries
var paperEntries = [];

var cardboardEntries = [];
var cornerGuardEntries = [];
var chipboardEntries = [];
var woodBunkEntries = [];

//bundle recipe final info
var paperTop = [];
var paperLeft = [];
var paperRight = [];
var paperBottom = [];

var cardboard = [];
var cornerGuard = [];
var chipboard = [];
var woodBunk = [];

var extraWrap = [];
var extraStrap = [];

//repack recipe - coming soon