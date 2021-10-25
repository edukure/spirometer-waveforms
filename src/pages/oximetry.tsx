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
import { Box, useTheme } from '@chakra-ui/react';

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

const ir = irRaw.map((value, index) => {
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

function Oximetry({}) {
  const theme = useTheme();
  console.log(data);
  return (
    <Container height="100vh">
      <Main alignItems="center">
        <Box p={2} w="full" h="300px" maxW="container.sm">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
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
                interval={250}
                tickFormatter={(x) => {
                  return x.toFixed(1);
                }}
              >
                <Label offset={0} position="bottom">
                  Seconds [s]
                </Label>
              </XAxis>
              <YAxis domain={[252000, 250000]}>
                <Label offset={20} position="center" angle={-90}>
                  Flow [L/s]
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
              data={data}
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
                interval={250}
                tickFormatter={(x) => {
                  return x.toFixed(1);
                }}
              >
                <Label offset={0} position="bottom">
                  Seconds [s]
                </Label>
              </XAxis>
              <YAxis domain={[227600, 229000]}>
                <Label offset={20} position="center" angle={-90}>
                  Flow [L/s]
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
