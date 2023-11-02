// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.760.48/runtimes/native1.12-tchmi/TcHmi.d.ts" />

function drawBundleMarkers(left, width) {
    console.log(`drawing bundle [left, width, color]: ${left}, ${width}, ${color[iMarkerColor]}`);
    var newMarker = TcHmi.ControlFactory.createEx(
        `TcHmi.Controls.Beckhoff.TcHmiRectangle`,
        `Marker_${iMarker}`,
        {
            'data-tchmi-height': markerHeight,
            'data-tchmi-height-unit': 'px',
            'data-tchmi-left': left,
            'data-tchmi-left-unit': 'px',
            'data-tchmi-top': 120,
            'data-tchmi-top-unit': 'px',
            'data-tchmi-width': width,
            'data-tchmi-width-unit': 'px',
            'data-tchmi-stroke-thickness': 3,
            'data-tchmi-zindex': 3,

            'data-tchmi-fill-color': {
                'color': color[iMarkerColor]
            }
        }
    );

    TcHmi.Controls.get(`Marker_${iMarker}`).setOpacity(0.5);

    iMarker++;
    iMarkerColor++;
    iMarkerColor = iMarkerColor % (color.length);

    var parent = TcHmi.Controls.get('CellContainer');
    if (parent && newMarker) {
        parent.addChild(newMarker);
        markers.push(newMarker);
    }
}