"use strict";

let arr = [
    {name:"trond",age:40},
    {name:"lars",age:38},
    {name:"kristina",age:35}
];


for (let  [i,item] of arr.entries()) {

    console.log( i,item.name);

};
console.log("program stopping");