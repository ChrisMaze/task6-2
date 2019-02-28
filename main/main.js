var datbase = require("./datbase");
var item = datbase.loadAllItems();
function getSameNum(val,arr){
    var processArr = arr.filter(function(value) {
        return value == val;
    });
    return processArr.length;
}

function getNum(shoppingList,inputs)
{
    var shoppingListNum = [];
    for(var i =0 ;i < shoppingList.length;i++)
    {
        shoppingListNum.push(getSameNum(shoppingList[i],inputs));
    }
    return shoppingListNum;
}

function findMultiple(inputs) {
    var index = -1;
    var outputs = [];
    for(var i=0; i<inputs.length;i++)
    {
        index = inputs[i].indexOf("-");
        if(index != -1)
        {
            var k = parseInt(inputs[i].length);
            var m = inputs[i].substr(index+1,k);
            //console.log(m);
            for (var j = 0; j<m; j++)
            {
                outputs.push(inputs[i].substr(0,index));
            }
        }else
        {
            outputs.push(inputs[i]);
        }
    }
   // console.log(outputs);
    return outputs;
}

function remDup(arr){
    var x = new Set(arr);
    return [...x];
}

function discount(shoppingList,shoppingListNum) {
    var dShoppingListNum = [].concat(shoppingListNum);
    for (var i=0;i<datbase.loadPromotions().length;i++)
    {
        for (var k = 0; k<shoppingList.length;k++)
        {
            for (var j=0;j<datbase.loadPromotions()[i].barcodes.length;j++)
            {
                if(datbase.loadPromotions()[i].barcodes[j] == shoppingList[k])
                {
                    var m=3;
                    while(dShoppingListNum[k]>=m)
                    {
                        dShoppingListNum[k]--;
                        m=m+2;
                    }
                }
            }
        }
    }
    return dShoppingListNum;
}

function getName(shoppingList)
{
    var shoppingListName = [];
    for (var i=0;i<shoppingList.length;i++)
    {
       for(var j=0;j<item.length;j++)
       {
           if (shoppingList[i] == item[j].barcode)
           {
               shoppingListName.push(item[j].name);
           }
       }
    }
    return shoppingListName;
}

module.exports = function printInventory(inputs) {
    var outputs = '***<没钱赚商店>购物清单***\n';
    var shoppingListNum = [];
    var shoppingList = [];
    var dShoppingListNum = [];
    var shoppingListName = [];
    var shoppingListUnit = [];
    var dis = 0;
    var res = 0;
    inputs = findMultiple(inputs);
    shoppingList = remDup(inputs);
    shoppingListNum = getNum(shoppingList,inputs);

    dShoppingListNum = discount(shoppingList,shoppingListNum);
    //console.log(dShoppingListNum);
    shoppingListName = getName(shoppingList);


    for (var i = 0; i<shoppingList.length; i++)
    {
        for (var j= 0; j<item.length;j++)
        {
            if (shoppingList[i] == item[j].barcode)
            {
                res += dShoppingListNum[i]*item[j].price;
                outputs += '名称：' + item[j].name + '，数量：' + shoppingListNum[i] + item[j].unit + '，单价：' + item[j].price.toFixed(2) +
                    '(元)，小计：' + (dShoppingListNum[i]*item[j].price).toFixed(2) + '(元)\n';
            }
        }
    }
    outputs +='----------------------\n挥泪赠送商品：\n';
    for(var i = 0; i<dShoppingListNum.length;i++)
    {
        var dif = shoppingListNum[i]-dShoppingListNum[i];
        if ( dif != 0)
        {
            for (var j=0; j<item.length;j++)
            {
                if(shoppingList[i] == item[j].barcode)
                {
                    outputs +='名称：' + item[j].name + '，数量：' + dif + item[j].unit + '\n';
                    dis += dif*item[j].price;
                }
            }
        }
    }








    outputs += '----------------------\n' +
        '总计：'+ res.toFixed(2)+'(元)\n' +
        '节省：'+ dis.toFixed(2) + '(元)\n' +
        '**********************'

    console.log(outputs);
    return 0;
};