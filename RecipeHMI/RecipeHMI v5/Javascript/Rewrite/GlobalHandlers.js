// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />
function recoverElements(materialType, recipeArr, createMaterialFunc) {
    for (let i = 0; i < recipeArr.length; i++) { //regenerate material controls
        console.log(recipeArr[i]);
        createMaterialFunc();
    }
}

function setData(materialType, elementsArr, recipeArr) { //combobox data only, numerical data can bind without this
    for (let i = 0; i < elementsArr.length; i++) {

        let topIndex, leftIndex, rightIndex, bottomIndex;
        let upperCornersIndex, lowerCornersIndex;

        if (materialType == 'TopPaper' || materialType == 'LeftPaper' || materialType == 'RightPaper' || materialType == 'BottomPaper') {

        }
        else if (materialType.includes('Wrap')) {

        }
        else if (materialType == 'Cardboard') {
            topIndex = CardboardSrc.indexOf(recipeArr[i].top);
            leftIndex = CardboardSrc.indexOf(recipeArr[i].sides);
            rightIndex = CardboardSrc.indexOf(recipeArr[i].sides);
            bottomIndex = CardboardSrc.indexOf(recipeArr[i].bottom);

            upperCornersIndex = CardboardSrc.indexOf(recipeArr[i].upperCorners);
            lowerCornersIndex = CardboardSrc.indexOf(recipeArr[i].lowerCorners);

            TcHmi.Controls.get(elementsArr[i].getId() + `.Top${materialType}`).setSelectedIndex(topIndex);
            TcHmi.Controls.get(elementsArr[i].getId() + `.Left${materialType}`).setSelectedIndex(leftIndex);
            TcHmi.Controls.get(elementsArr[i].getId() + `.Right${materialType}`).setSelectedIndex(rightIndex);
            TcHmi.Controls.get(elementsArr[i].getId() + `.Bottom${materialType}`).setSelectedIndex(bottomIndex);

            TcHmi.Controls.get(elementsArr[i].getId() + `.UpperCorners${materialType}`).setSelectedIndex(upperCornersIndex);
            TcHmi.Controls.get(elementsArr[i].getId() + `.LowerCorners${materialType}`).setSelectedIndex(lowerCornersIndex);
        }
        else if (materialType == 'CornerGuard') {
            upperCornersIndex = CornerGuardSrc.indexOf(recipeArr[i].upperCorners);
            lowerCornersIndex = CornerGuardSrc.indexOf(recipeArr[i].lowerCorners);

            TcHmi.Controls.get(elementsArr[i].getId() + `.UpperCorners${materialType}`).setSelectedIndex(upperCornersIndex);
            TcHmi.Controls.get(elementsArr[i].getId() + `.LowerCorners${materialType}`).setSelectedIndex(lowerCornersIndex);
        }
        else if (materialType == 'Chipboard') {
            topIndex = ChipboardSrc.indexOf(recipeArr[i].top);
            bottomIndex = ChipboardSrc.indexOf(recipeArr[i].bottom);

            TcHmi.Controls.get(elementsArr[i].getId() + `.Top${materialType}`).setSelectedIndex(topIndex);
            TcHmi.Controls.get(elementsArr[i].getId() + `.Bottom${materialType}`).setSelectedIndex(bottomIndex);
        }
        else if (materialType == 'WoodBunk') {
            topIndex = WoodBunkTopSrc.indexOf(recipeArr[i].top);
            leftIndex = WoodBunkSidesSrc.indexOf(recipeArr[i].left);
            rightIndex = WoodBunkSidesSrc.indexOf(recipeArr[i].right);
            bottomIndex = WoodBunkBottomSrc.indexOf(recipeArr[i].bottom);

            TcHmi.Controls.get(elementsArr[i].getId() + `.Top${materialType}`).setSelectedIndex(topIndex);
            TcHmi.Controls.get(elementsArr[i].getId() + `.Left${materialType}`).setSelectedIndex(leftIndex);
            TcHmi.Controls.get(elementsArr[i].getId() + `.Right${materialType}`).setSelectedIndex(rightIndex);
            TcHmi.Controls.get(elementsArr[i].getId() + `.Bottom${materialType}`).setSelectedIndex(bottomIndex);
        }
    }
}