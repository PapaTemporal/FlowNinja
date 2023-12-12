export default function ZoomEvent(this: any, type: any, {
  sourceEvent,
  target,
  transform,
  dispatch
}: { sourceEvent: any; target: { (selection: any): void; transform(collection: any, transform: any, point: any, event: any): void; scaleBy(selection: any, k: any, p: any, event: any): void; scaleTo(selection: any, k: any, p: any, event: any): void; translateBy(selection: any, x: any, y: any, event: any): void; translateTo(selection: any, x: any, y: any, p: any, event: any): void; wheelDelta(_: any, ...args: any[]): any | ((event: any) => number); filter(_: any, ...args: any[]): any | ((event: any) => boolean); touchable(_: any, ...args: any[]): any | (() => number | boolean); extent(_: any, ...args: any[]): any | (() => any[][]); scaleExtent(_: any, ...args: any[]): any | number[]; translateExtent(_: any, ...args: any[]): any | number[][]; constrain(_: any, ...args: any[]): (transform: any, extent: any, translateExtent: any) => any; duration(_: any, ...args: any[]): number | any; interpolate(_: any, ...args: any[]): any; on(...args: any[]): any; clickDistance(_: any, ...args: any[]): number | any; tapDistance(_: any, ...args: any[]): number | any; }; type: any; transform: any; dispatch: any; }) {
  Object.defineProperties(this, {
    type: { value: type, enumerable: true, configurable: true },
    sourceEvent: { value: sourceEvent, enumerable: true, configurable: true },
    target: { value: target, enumerable: true, configurable: true },
    transform: { value: transform, enumerable: true, configurable: true },
    _: { value: dispatch }
  });
}
