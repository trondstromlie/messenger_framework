"use strict";
let arr = [
    {value1 : "a", value2 : "b"},
    {value1 : "a", value2 : "c"},
    {value1 : "b", value2 : "b"},
    {value1 : "a", value2 : "b"}
];

let value = arr.filter(item => !(item.value1 == "a" && item.value2 == "b"));

console.log({value:value});


let value2 = arr.filter( (item )=> {
    if(! (item.value1 =="a" && item.value2 == "b")) {
        return true
    }
})
console.log({value2:value2});