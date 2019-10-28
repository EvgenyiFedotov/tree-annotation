export const ExpConst1 = 1;
export const ExpConst2: number = 2;
export const ExpConst3 = 3,
  ExpConst4: number = 4;
export let ExpLet1 = "1";
export let ExpLet2: string = "2";
export var ExpVar1 = new Date();
export var ExpVar2: Date = new Date();
export const ExpArrFunc1 = () => ["1"];
export const ExpArrFunc2: () => Array<string> = () => ["2"];
export const ExpArrFunc3 = (a: boolean) => (a ? "1" : 2);
export function ExpFunc1() {}
export function ExpFunc2(a: string) {}
export function ExpFunc3({ a: string, b: number }) {}
export function ExpFunc4(): Array<string> {
  return [];
}
export class ExpClass1 {}
export class ExpClass2 extends ExpClass1 {}
