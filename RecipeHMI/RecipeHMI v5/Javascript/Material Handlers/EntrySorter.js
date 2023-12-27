// Keep these lines for a best effort IntelliSense of Visual Studio 2017 and higher.
/// <reference path="./../../../Packages/Beckhoff.TwinCAT.HMI.Framework.12.758.8/runtimes/native1.12-tchmi/TcHmi.d.ts" />

TcHmi.EventProvider.register('SortEntries.onMouseClick', function (e, data) { //delete bindings, sort data, manually set data, create 2 way bindings
    sortEntries(cardboard);
    sortEntries(cornerGuard);
    sortEntries(chipboard);
    sortEntries(woodBunk);
});

function sortRecipe(recipeArr) { //bubblesort
    for (let i = 0; i < recipeArr.length - 1 ; i++) {
        for (let j = 0; j < recipeArr.length - i - 1; j++) {
            if (recipeArr[j].position > arr[j + 1].position) {
                let temp = recipe[j];
                recipe[j] = recipe[j + 1];
                recipe[j + 1] = temp;
            }
        }
    }

    
}