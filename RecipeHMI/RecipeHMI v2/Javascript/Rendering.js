// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
const scaleFactor = 5;
TcHmi.EventProvider.register('TopRender.onAttached', function (e, data) {
    generateFaces();
    renderMaterials('Top');
});
TcHmi.EventProvider.register('SidesRender.onAttached', function (e, data) {
    generateFaces();
    renderMaterials('Sides')
});
TcHmi.EventProvider.register('BottomRender.onAttached', function (e, data) {
    generateFaces();
    renderMaterials('Bottom');
});

//for setting dimensions, redundant

function generateFaces() {
    TcHmi.Symbol.readEx2('%s%PLC1.BundleData.length%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            TcHmi.Controls.get(`TopRender`).setWidth(scaleFactor * data.value);
            TcHmi.Controls.get(`SidesRender`).setWidth(scaleFactor * data.value);
            TcHmi.Controls.get(`BottomRender`).setWidth(scaleFactor * data.value);
            
        }
    });
    TcHmi.Symbol.readEx2('%s%PLC1.BundleData.height%/s%', function (data) {
        if (scaleFactor * data.error === TcHmi.Errors.NONE) {
            TcHmi.Controls.get(`SidesRender`).setHeight(scaleFactor * data.value);
        }
    });
    TcHmi.Symbol.readEx2('%s%PLC1.BundleData.width%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            TcHmi.Controls.get(`TopRender`).setHeight(scaleFactor * data.value);
            TcHmi.Controls.get(`BottomRender`).setHeight(scaleFactor * data.value);
            console.log(TcHmi.Controls.get('TopRender').getHeight())
        }
    });
}

function renderMaterials(face) {
    let materials = [];

    let Paper = [];
    let Cardboard = [];
    let CornerGuard = [];
    let Chipboard = [];
    let WoodBunk = [];

    TcHmi.Server.readSymbol(
        [
            `PLC1.StrapWrapRecipe.${face}Paper`,
            'PLC1.StrapWrapRecipe.Cardboard',
            'PLC1.StrapWrapRecipe.CornerGuard',
            'PLC1.StrapWrapRecipe.Chipboard',
            'PLC1.StrapWrapRecipe.WoodBunk',
        ],
        function (data) { //do stuff under this
            console.log(data);
            Paper = data.results[0].value;
            Cardboard = data.results[1].value;
            CornerGuard = data.results[2].value;
            Chipboard = data.results[3].value;
            WoodBunk = data.results[4].value;

            for (let i = 1; i < data.results.length; i++) {
                console.log(data.results[i].value);
                materials = materials.concat(data.results[i].value);
                //console.log(materials)
            }            
            console.log(`paper and materials:`);
            console.log(Paper);
            console.log(materials);

            switch (face) {
                case 'Top':
                    //renderTop(Paper, materials, Cardboard, CornerGuard, Chipboard, WoodBunk);
                    renderTop(Paper, materials);
                    break;
                case 'Sides':
                    renderSides(Paper, materials);
                    break;
                case 'Bottom':
                    renderBottom(Paper, materials);
            }
            
        }
    );
}

//function renderTop(Paper, materials, Cardboard, CornerGuard, Chipboard, WoodBunk) {
function renderTop(Paper, materials) {
    for (let i = Paper.length - 1; i >= 0; i--) { //discard unused paper intervals
        if (Paper[i].start >= Paper[i].end) {
            Paper.splice(i, 1);
        }
    }
    for (let i = materials.length - 1; i >= 0; i--) { //discard element if there is no top/upper corner material
        if (!materials[i].top && !materials[i].upperCorner) {
            materials.splice(i, 1);
        }
    }

    console.log('array for top render: ');
    console.log(Paper);
    console.log(materials);

    
    const view = TcHmi.Controls.get(`TopRender`);
    const centerline = view.getHeight() / 2;

    for (let i = 0; i < Paper.length; i++) { //paper only
        let paperElem = TcHmi.ControlFactory.createEx(
                `TcHmi.Controls.Beckhoff.TcHmiRectangle`,
                `PAP28_${i}_top`,
                {
                    'data-tchmi-type': "TcHmi.Controls.Beckhoff.TcHmiRectangle",
                    'data-tchmi-height': TcHmi.Controls.get(`PAP28`).getHeight(),
                    'data-tchmi-height-unit': "px",
                    'data-tchmi-left': scaleFactor * Paper[i].start,
                    'data-tchmi-left-unit': "px",
                    'data-tchmi-top': centerline - TcHmi.Controls.get(`PAP28`).getHeight() / 2,
                    'data-tchmi-top-unit': "px",
                    'data-tchmi-width': scaleFactor * (Paper[i].end - Paper[i].start),
                    'data-tchmi-width-unit': "px"
                },
                view
            );
        paperElem.setFillColor(TcHmi.Controls.get(`PAP28`).getFillColor());
        view.addChild(paperElem);
    }
    
    for (let i = 0; i < materials.length; i++) {
        console.log(materials[i]);
        if (materials[i].top) {
            let topElem = TcHmi.ControlFactory.createEx(
                `TcHmi.Controls.Beckhoff.TcHmiRectangle`,
                `${materials[i].top}_${i}_top`,
                {
                    'data-tchmi-type': "TcHmi.Controls.Beckhoff.TcHmiRectangle",
                    'data-tchmi-height': TcHmi.Controls.get(materials[i].top).getHeight(),
                    'data-tchmi-height-unit': "px",
                    'data-tchmi-left': scaleFactor * materials[i].position,
                    'data-tchmi-left-unit': "px",
                    'data-tchmi-top': centerline - TcHmi.Controls.get(materials[i].top).getHeight() / 2,
                    'data-tchmi-top-unit': "px",
                    'data-tchmi-width': TcHmi.Controls.get(materials[i].top).getWidth(),
                    'data-tchmi-width-unit': "px"
                },
                view
            );
            topElem.setFillColor(TcHmi.Controls.get(materials[i].top).getFillColor());
            view.addChild(topElem);
        }
            
        if (materials[i].upperCorner) {
            let upperCornerElemLeft = TcHmi.ControlFactory.createEx(
                `TcHmi.Controls.Beckhoff.TcHmiRectangle`,
                `${materials[i].upperCorner}_${i}_topL`,
                {
                    'data-tchmi-type': "TcHmi.Controls.Beckhoff.TcHmiRectangle",
                    'data-tchmi-height': TcHmi.Controls.get(materials[i].upperCorner).getHeight(),
                    'data-tchmi-height-unit': "px",
                    'data-tchmi-left': scaleFactor * materials[i].position,
                    'data-tchmi-left-unit': "px",
                    'data-tchmi-top': 0,
                    'data-tchmi-top-unit': "px",
                    'data-tchmi-width': TcHmi.Controls.get(materials[i].upperCorner).getWidth(),
                    'data-tchmi-width-unit': "px"
                },
                view
            );
            upperCornerElemLeft.setFillColor(TcHmi.Controls.get(materials[i].upperCorner).getFillColor());
            view.addChild(upperCornerElemLeft);
            
            let upperCornerElemRight = TcHmi.ControlFactory.createEx(
                `TcHmi.Controls.Beckhoff.TcHmiRectangle`,
                `${materials[i].upperCorner}_${i}_topR`,
                {
                    'data-tchmi-type': "TcHmi.Controls.Beckhoff.TcHmiRectangle",
                    'data-tchmi-height': TcHmi.Controls.get(materials[i].upperCorner).getHeight(),
                    'data-tchmi-height-unit': "px",
                    'data-tchmi-left': scaleFactor * materials[i].position,
                    'data-tchmi-left-unit': "px",
                    'data-tchmi-top': view.getHeight() - TcHmi.Controls.get(materials[i].upperCorner).getHeight(),
                    'data-tchmi-top-unit': "px",
                    'data-tchmi-width': TcHmi.Controls.get(materials[i].upperCorner).getWidth(),
                    'data-tchmi-width-unit': "px"
                },
                view
            );
            upperCornerElemRight.setFillColor(TcHmi.Controls.get(materials[i].upperCorner).getFillColor());
            view.addChild(upperCornerElemRight);
        }
    }
}

function renderSides(Paper, materials) {
    for (let i = Paper.length - 1; i >= 0; i--) { //discard unused paper intervals
        if (Paper[i].start >= Paper[i].end) {
            Paper.splice(i, 1);
        }
    }
    for (let i = materials.length - 1; i >= 0; i--) { //discard element if there is no sides/lower corner/upper corner material
        if (!materials[i].sides && !materials[i].upperCorner && !materials[i].lowerCorner) {
            materials.splice(i, 1);
        }
    }

    console.log('array for sides render: ');
    console.log(Paper);
    console.log(materials);

    const view = TcHmi.Controls.get(`SidesRender`);
    const centerline = view.getHeight() / 2;

    for (let i = 0; i < Paper.length; i++) { //paper only
        let paperElem = TcHmi.ControlFactory.createEx(
                `TcHmi.Controls.Beckhoff.TcHmiRectangle`,
                `PAP28_${i}_sides`,
                {
                    'data-tchmi-type': "TcHmi.Controls.Beckhoff.TcHmiRectangle",
                    'data-tchmi-height': TcHmi.Controls.get(`PAP28`).getHeight(),
                    'data-tchmi-height-unit': "px",
                    'data-tchmi-left': scaleFactor * Paper[i].start,
                    'data-tchmi-left-unit': "px",
                    'data-tchmi-top': centerline - TcHmi.Controls.get(`PAP28`).getHeight() / 2,
                    'data-tchmi-top-unit': "px",
                    'data-tchmi-width': scaleFactor * (Paper[i].end - Paper[i].start),
                    'data-tchmi-width-unit': "px"
                },
                view
            );
        paperElem.setFillColor(TcHmi.Controls.get(`PAP28`).getFillColor());
        view.addChild(paperElem);
    }

    for (let i = 0; i < materials.length; i++) {
        console.log(materials[i]);
        if (materials[i].sides) {
            let topElem = TcHmi.ControlFactory.createEx(
                `TcHmi.Controls.Beckhoff.TcHmiRectangle`,
                `${materials[i].sides}_${i}_sides`,
                {
                    'data-tchmi-type': "TcHmi.Controls.Beckhoff.TcHmiRectangle",
                    'data-tchmi-height': TcHmi.Controls.get(materials[i].sides).getHeight(),
                    'data-tchmi-height-unit': "px",
                    'data-tchmi-left': scaleFactor * materials[i].position,
                    'data-tchmi-left-unit': "px",
                    'data-tchmi-top': centerline - TcHmi.Controls.get(materials[i].sides).getHeight() / 2,
                    'data-tchmi-top-unit': "px",
                    'data-tchmi-width': TcHmi.Controls.get(materials[i].sides).getWidth(),
                    'data-tchmi-width-unit': "px"
                },
                view
            );
            topElem.setFillColor(TcHmi.Controls.get(materials[i].sides).getFillColor());
            view.addChild(topElem);
        }

        if (materials[i].upperCorner) {
            let upperCornerElem = TcHmi.ControlFactory.createEx(
                `TcHmi.Controls.Beckhoff.TcHmiRectangle`,
                `${materials[i].upperCorner}_${i}_high`,
                {
                    'data-tchmi-type': "TcHmi.Controls.Beckhoff.TcHmiRectangle",
                    'data-tchmi-height': TcHmi.Controls.get(materials[i].upperCorner).getHeight(),
                    'data-tchmi-height-unit': "px",
                    'data-tchmi-left': scaleFactor * materials[i].position,
                    'data-tchmi-left-unit': "px",
                    'data-tchmi-top': 0,
                    'data-tchmi-top-unit': "px",
                    'data-tchmi-width': TcHmi.Controls.get(materials[i].upperCorner).getWidth(),
                    'data-tchmi-width-unit': "px"
                },
                view
            );
            upperCornerElem.setFillColor(TcHmi.Controls.get(materials[i].upperCorner).getFillColor());
            view.addChild(upperCornerElem);
        }

        if (materials[i].lowerCorner) {
            let lowerCornerElem = TcHmi.ControlFactory.createEx(
                `TcHmi.Controls.Beckhoff.TcHmiRectangle`,
                `${materials[i].lowerCorner}_${i}_low`,
                {
                    'data-tchmi-type': "TcHmi.Controls.Beckhoff.TcHmiRectangle",
                    'data-tchmi-height': TcHmi.Controls.get(materials[i].lowerCorner).getHeight(),
                    'data-tchmi-height-unit': "px",
                    'data-tchmi-left': scaleFactor * materials[i].position,
                    'data-tchmi-left-unit': "px",
                    'data-tchmi-top': view.getHeight() - TcHmi.Controls.get(materials[i].lowerCorner).getHeight(),
                    'data-tchmi-top-unit': "px",
                    'data-tchmi-width': TcHmi.Controls.get(materials[i].lowerCorner).getWidth(),
                    'data-tchmi-width-unit': "px"
                },
                view
            );
            lowerCornerElem.setFillColor(TcHmi.Controls.get(materials[i].lowerCorner).getFillColor());
            view.addChild(lowerCornerElem);
        }
    }
}

function renderBottom(Paper, materials) {
    for (let i = Paper.length - 1; i >= 0; i--) { //discard unused paper intervals
        if (Paper[i].start >= Paper[i].end) {
            Paper.splice(i, 1);
        }
    }
    for (let i = materials.length - 1; i >= 0; i--) { //discard element if there is no top/upper corner material
        if (!materials[i].bottom && !materials[i].lowerCorner) {
            materials.splice(i, 1);
        }
    }

    console.log('array for bottom render: ');
    console.log(Paper);
    console.log(materials);

    const view = TcHmi.Controls.get(`BottomRender`);
    const centerline = view.getHeight() / 2;

    for (let i = 0; i < Paper.length; i++) { //paper only
        let paperElem = TcHmi.ControlFactory.createEx(
                `TcHmi.Controls.Beckhoff.TcHmiRectangle`,
                `PAP28_${i}_bottom`,
                {
                    'data-tchmi-type': "TcHmi.Controls.Beckhoff.TcHmiRectangle",
                    'data-tchmi-height': TcHmi.Controls.get(`PAP28`).getHeight(),
                    'data-tchmi-height-unit': "px",
                    'data-tchmi-left': scaleFactor * Paper[i].start,
                    'data-tchmi-left-unit': "px",
                    'data-tchmi-top': centerline - TcHmi.Controls.get(`PAP28`).getHeight() / 2,
                    'data-tchmi-top-unit': "px",
                    'data-tchmi-width': scaleFactor * (Paper[i].end - Paper[i].start),
                    'data-tchmi-width-unit': "px"
                },
                view
            );
        paperElem.setFillColor(TcHmi.Controls.get(`PAP28`).getFillColor());
        view.addChild(paperElem);
    }

    for (let i = 0; i < materials.length; i++) {
        console.log(materials[i]);
        if (materials[i].bottom) {
            let topElem = TcHmi.ControlFactory.createEx(
                `TcHmi.Controls.Beckhoff.TcHmiRectangle`,
                `${materials[i].bottom}_${i}_bottom`,
                {
                    'data-tchmi-type': "TcHmi.Controls.Beckhoff.TcHmiRectangle",
                    'data-tchmi-height': TcHmi.Controls.get(materials[i].bottom).getHeight(),
                    'data-tchmi-height-unit': "px",
                    'data-tchmi-left': scaleFactor * materials[i].position,
                    'data-tchmi-left-unit': "px",
                    'data-tchmi-top': centerline - TcHmi.Controls.get(materials[i].bottom).getHeight() / 2,
                    'data-tchmi-top-unit': "px",
                    'data-tchmi-width': TcHmi.Controls.get(materials[i].bottom).getWidth(),
                    'data-tchmi-width-unit': "px"
                },
                view
            );
            topElem.setFillColor(TcHmi.Controls.get(materials[i].bottom).getFillColor());
            view.addChild(topElem);
        }

        if (materials[i].lowerCorner) {
            let leftElem = TcHmi.ControlFactory.createEx(
                `TcHmi.Controls.Beckhoff.TcHmiRectangle`,
                `${materials[i].lowerCorner}_${i}_bottomL`,
                {
                    'data-tchmi-type': "TcHmi.Controls.Beckhoff.TcHmiRectangle",
                    'data-tchmi-height': TcHmi.Controls.get(materials[i].lowerCorner).getHeight(),
                    'data-tchmi-height-unit': "px",
                    'data-tchmi-left': scaleFactor * materials[i].position,
                    'data-tchmi-left-unit': "px",
                    'data-tchmi-top': 0,
                    'data-tchmi-top-unit': "px",
                    'data-tchmi-width': TcHmi.Controls.get(materials[i].lowerCorner).getWidth(),
                    'data-tchmi-width-unit': "px"
                },
                view
            );
            leftElem.setFillColor(TcHmi.Controls.get(materials[i].lowerCorner).getFillColor());
            view.addChild(leftElem);

            let rightElem = TcHmi.ControlFactory.createEx(
                `TcHmi.Controls.Beckhoff.TcHmiRectangle`,
                `${materials[i].lowerCorner}_${i}_bottomR`,
                {
                    'data-tchmi-type': "TcHmi.Controls.Beckhoff.TcHmiRectangle",
                    'data-tchmi-height': TcHmi.Controls.get(materials[i].lowerCorner).getHeight(),
                    'data-tchmi-height-unit': "px",
                    'data-tchmi-left': scaleFactor * materials[i].position,
                    'data-tchmi-left-unit': "px",
                    'data-tchmi-top': view.getHeight() - TcHmi.Controls.get(materials[i].lowerCorner).getHeight(),
                    'data-tchmi-top-unit': "px",
                    'data-tchmi-width': TcHmi.Controls.get(materials[i].lowerCorner).getWidth(),
                    'data-tchmi-width-unit': "px"
                },
                view
            );
            rightElem.setFillColor(TcHmi.Controls.get(materials[i].lowerCorner).getFillColor());
            view.addChild(rightElem);
        }
    }
}

/*
function placeCardboard() {
    let arr;
    TcHmi.Symbol.readEx2('%s%PLC1.StrapWrapRecipe.Cardboard%/s%', function (data) {
        if (data.error === TcHmi.Errors.NONE) {
            arr = data.value.slice();
            for (let i = data.value.length - 1; i >= 0; i--) { //remove null materials starting from the back
                if (!arr[i].top && !arr[i].sides && !arr[i].bottom && !arr[i].upperCorner && !arr[i].lowerCorner) {
                    arr.splice(i, 1);
                }
            }
            console.log('refined Cardboard: ');
            console.log(arr);
        }
    });

    let topView = TcHmi.Controls.get(`TopRender`);
    let sidesView = TcHmi.Controls.get(`SidesRender`);
    let bottomView = TcHmi.Controls.get(`BottomRender`);
    for (let i = 0; i < arr.length - 1; i++) {
        let topElem = tchmi_clone_object(TcHmi.Controls.get(`${arr[i].top}`));
        topElem.setTop = topView.getHeight() / 2;
        topElem.setLeft = arr[i].position;
        topView.addChild(topElem);

        let sidesElem = tchmi_clone_object(TcHmi.Controls.get(`${arr[i].sides}`));
        sidesElem.setTop = sidesView.getHeight() / 2;
        sidesElem.setLeft = arr[i].position;
        sidesView.addChild(sidesElem);

        let bottomElem = tchmi_clone_object(TcHmi.Controls.get(`${arr[i].bottom}`));
        bottomElem.setTop = bottomView.getHeight() / 2;
        bottomElem.setLeft = arr[i].position;
        bottomView.addChild(bottomElem);

        let upperCornerElem = tchmi_clone_object(TcHmi.Controls.get(`${arr[i].upperCorner}`));
        upperCornerElem.setTop = topView.getHeight() / 2;
        upperCornerElem.setLeft = arr[i].position;
        topView.addChild(upperCornerElem);

        let lowerCornerElem = tchmi_clone_object(TcHmi.Controls.get(`${arr[i].lowerCorner}`));
        lowerCornerElem.setTop = bottomView.getHeight() / 2;
        lowerCornerElem.setLeft = arr[i].position;
        bottomView.addChild(upperCornerElem);

    }
}
*/