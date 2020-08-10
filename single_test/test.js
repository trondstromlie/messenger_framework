"use strict";

let arr = [
    {name : "trond", age:40},
    {name : "kristina" , age: 35},
    {name : "rolf" , age: 68}
];

let first = arr.filter(item => item.name === "kristina");
console.log({first:first});


let second = arr.filter(item => item.name !== "kristina" && item.age !== 35);
console.log({second:second});


let third = arr.filter( (item) => {
    if(item.name !== "trond" && item.age !== 40) return item;
})
console.log({third:third})