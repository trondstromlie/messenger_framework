"use strict";

let obj = {
    name:"def",
    age:50,
    name_age: function () {
       return this.name + " is already turning " + this.age;
    }
};

console.log(obj.name_age());

let bjarne = Object.create(obj, {name:{value:"bjørnar"},age:{value:154}});



console.log(bjarne.name_age());
