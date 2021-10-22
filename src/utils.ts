export const getPeak = (values) => {
  const peak = Math.max(...values);
  return peak;
};

export const getPeakPoint = (data: { value: number; index: number }[]) => {
  const values = data.map((d) => d.value);
  const peakValue = Math.max(...values);
  const peakIndex = data[values.indexOf(peakValue)].index;

  return {
    value: peakValue,
    index: peakIndex,
  };
};

export const convertFlowToVolume = (data) => {
  let volume = 0;
  const volumeData = data.map((d) => {
    volume += d.value * 0.002;
    return {
      index: d.index,
      value: volume,
    };
  });

  return volumeData;
};
