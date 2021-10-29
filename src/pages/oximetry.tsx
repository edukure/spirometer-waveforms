import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Label,
  ResponsiveContainer,
} from 'recharts';
import { Box, useTheme, Text } from '@chakra-ui/react';
import createTrend from 'trendline';

import { Container } from '../components/Container';
import { Main } from '../components/Main';

const irRaw = [
  228518, 228584, 228585, 228298, 228221, 228344, 228416, 228485, 228143,
  228233, 228306, 228302, 228294, 228024, 228116, 228139, 228142, 227928,
  227870, 227978, 228014,
];
const redRaw = [
  253850, 254062, 254128, 253153, 253570, 253868, 254037, 253928, 253351,
  253817, 254040, 254157, 253686, 253761, 254043, 254165, 254228, 253596,
  253988, 254164, 254275,
];
// 100 Hz
// const irRaw = [
//   226255, 225634, 225375, 225617, 225775, 225892, 226013, 226082, 226145,
//   226100, 225172, 225348, 225590, 225716, 225818, 225912, 225979, 225963,
//   224951, 225012, 225305, 225486, 225596, 225737, 225865, 225922,
// ];

// // 100 Hz
// const redRaw = [
//   248235, 245926, 246445, 247126, 247493, 247833, 248087, 248315, 248494,
//   247081, 246272, 246875, 247465, 247749, 248048, 248301, 248485, 247585,
//   245869, 246355, 247077, 247424, 247856, 248153, 248404, 247371,
// ];

// const irRaw = [
//   229850, 229914, 229942, 229160, 229011, 229166, 229471, 229614, 229723,
//   229807, 229865, 229939, 229535, 229039, 229106, 229409, 229592, 229686,
//   229784, 229839, 229899, 229886, 229153, 229334, 229548, 229660,
// ];

// const redRaw = [
//   258016, 258206, 258031, 255758, 255870, 256562, 257165, 257540, 257797,
//   258023, 258184, 258265, 255959, 256063, 256626, 257311, 257657, 257870,
//   258082, 258269, 258409, 257394, 256638, 257230, 257759, 258023,
// ].splice(0, 21);

// 400hz
// const irRaw = [
//   221910, 221821, 221887, 221937, 221966, 222009, 222023, 222044, 222063,
//   222026, 221760, 221779, 221862, 221923, 222016, 222058, 222080, 222108,
//   222131, 221876, 221794, 221873, 221939, 221966, 222002, 222025,
// ].splice(0, 16);

// const redRaw = [
//   247059, 247094, 247311, 247426, 247551, 247651, 247722, 247802, 247838,
//   247354, 247024, 247292, 247448, 247597, 247700, 247816, 247955, 248022,
//   247953, 247329, 247447, 247636, 247748, 247864, 247989, 248050,
// ].splice(0, 16);

const ir = irRaw.map((value, index, array) => {
  return {
    index,
    value,
  };
});

const red = redRaw.map((value, index) => {
  return {
    index,
    value,
  };
});

const data = ir.map((value, index) => {
  return {
    index,
    ir: value.value,
    red: redRaw[index],
  };
});

function findPeaksAndTroughs(array) {
  const start = 1; // Starting index to search
  const end = array.length - 2; // Last index to search
  const obj = { peaks: [], troughs: [] }; // Object to store the indexs of peaks/thoughs

  for (let i = start; i <= end; i++) {
    const current = array[i];
    const last = array[i - 1];
    const next = array[i + 1];

    if (current > next && current > last) obj.peaks.push(i);
    else if (current < next && current < last) obj.troughs.push(i);
  }
  return obj;
}

function Oximetry({}) {
  const theme = useTheme();

  const trendIR = createTrend(data, 'index', 'ir');
  const trendRed = createTrend(data, 'index', 'red');
  console.log(trendIR);

  const removeTrend = () => {
    return data.map(({ index, ir, red }) => ({
      index,
      ir: ir - trendIR.calcY(index),
      red: red - trendRed.calcY(index),
    }));
  };

  const withoutTrend = removeTrend();

  const ir = withoutTrend.map((v) => v.ir);
  const irMax = Math.max(...ir);
  const irMin = Math.min(...ir);

  const red = withoutTrend.map((v) => v.red);
  const redMax = Math.max(...red);
  const redMin = Math.min(...red);

  const ratioAverage = redMax / redMin / (irMax / irMin);

  // redAC / redDC / (irAC) / ir DC
  // AC = (max - min )/dt
  // DC = calcY(dt)
  const getSpO2 = (ratio: number) =>
    -45.06 * ratio * ratio + 30.354 * ratio + 94.845;

  const getRatio = (array, start, end) => {
    const red =
      (array[end].red - array[start].red) /
      (array[end].index - array[start].index) /
      trendRed.calcY((array[end].index + array[start].index) / 2);

    const ir =
      (array[end].ir - array[start].ir) /
      (array[end].index - array[start].index) /
      trendIR.calcY((array[end].index + array[start].index) / 2);

    console.log(red, ir);
    return red / ir;
  };

  console.log(findPeaksAndTroughs(red));
  console.log(findPeaksAndTroughs(ir));

  const ratio = getRatio(data, 4, 8);

  const spo2 = getSpO2(ratioAverage);

  return (
    <Container height="100vh">
      <Main alignItems="center">
        <Box p={2} w="full" h="300px" maxW="container.sm">
          <Text>{spo2}</Text>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={withoutTrend}
              margin={{
                top: 5,
                right: 30,
                bottom: 20,
              }}
              syncId="charts"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="index"
                tickFormatter={(x) => {
                  return x.toFixed(1);
                }}
              >
                <Label offset={0} position="bottom">
                  Seconds [s]
                </Label>
              </XAxis>
              <YAxis
              //  domain={[252000, 250000]}
              >
                <Label offset={20} position="center" angle={-90}>
                  red
                </Label>
              </YAxis>
              <Line
                isAnimationActive={false}
                type="monotone"
                dataKey="red"
                stroke={theme.colors.teal['400']}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={withoutTrend}
              margin={{
                top: 5,
                right: 30,
                bottom: 20,
              }}
              syncId="charts"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="index"
                tickFormatter={(x) => {
                  return x.toFixed(1);
                }}
              >
                <Label offset={0} position="bottom">
                  index
                </Label>
              </XAxis>
              <YAxis>
                <Label offset={20} position="center" angle={-90}>
                  IR
                </Label>
              </YAxis>
              <Line
                isAnimationActive={false}
                type="monotone"
                dataKey="ir"
                stroke={theme.colors.teal['400']}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Main>
    </Container>
  );
}

export default Oximetry;
