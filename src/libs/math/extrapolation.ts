export const extrapolation2dPoints = (window: number) => {
  let store: [number, number][] = [];
  return function (x: number, y: number): { x: number; y: number } | null {
    store.push([x, y]);
    if (store.length < window) {
      return null;
    }

    const sum = store.reduce((acc, val) => [acc[0] + val[0], acc[1] + val[1]], [
      0,
      0,
    ]);
    const average = {
      x: sum[0] / window,
      y: sum[1] / window,
    };

    store = store.slice(-window - 1);
    return average;
  };
};
