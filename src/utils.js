export const getPeak = (values) => {
  const peak = Math.max(...values);
  return peak;
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
