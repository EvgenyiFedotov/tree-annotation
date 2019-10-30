const nametest1 = 1;
const nametest2: number = 2;
const nametest3 = 1 || 2;
const nametest4 = 1 && 2;
const nametest5 = "1",
  nametest6: string = "2";
const nametest7 = ["1"],
  nametest8 = [1, "2"],
  nametest9: Array<string> = ["1", "2"];
const nametest10 = 1 || 2 || 3;
const nametest11 = ["1", 1] || 1 || "2";
const nametest12: Array<string | number> | number | string =
  ["1", 1] || 1 || "2";

let nametest13 = 1;
let nametest14: number = 2;

nametest14 = 3;
nametest14 = 5;

var nametest15 = "1";
var nametest16: string = "2";

nametest16 = "3";

var nametest17: Date = new Date();
var nametest18: Map<string, number> = new Map([["id1", 1]]);
const nametest19: Date = new Date("2019-01-01");
let nametest20: Date = new Date(2019, 0, 0, 0, 0, 0);
const nametest21 = nametest20;
