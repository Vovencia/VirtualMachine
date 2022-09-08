export function Call<IResult, IArgs extends any[]>(
  fn: (...args: IArgs) => IResult,
  ...args: IArgs
): IResult {
  return fn(...args);
}
