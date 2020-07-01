"use strict";


let bolObj = {condition:"===", test:"Trond"};

let name = "Trond";
let condition = name === bolObj.test;
console.log(condition);

if(condition === true) {
    console.log("doo something");
}else {
    console.log("do something else");

}
