import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Label,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from 'recharts';
import { Box, Text, BoxProps, useTheme } from '@chakra-ui/react';

import { getPeakPoint } from '../../../utils';

type FlowPoint = {
  value: number;
  index: number;
};

interface FlowChartProps extends BoxProps {
  flow: FlowPoint[];
  peak?: FlowPoint;
}

function FlowChart({ flow, peak, ...props }: FlowChartProps) {
  const theme = useTheme();
  if (!peak) {
    peak = getPeakPoint(flow);
  }

  return (
    <Box p={2} w="full" h="300px" maxW="container.sm" {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={flow}
          margin={{
            top: 5,
            right: 30,
            bottom: 20,
          }}
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
          <YAxis>
            <Label offset={20} position="center" angle={-90}>
              Flow [L/s]
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="value"
            stroke={theme.colors.teal['400']}
            strokeWidth={3}
            dot={<Dot peak={peak.value} />}
          />
          <ReferenceLine
            y={peak.value}
            label={{
              value: `${peak.value} L/s`,
              position: 'top',
              fontSize: '1.25rem',
            }}
            stroke={theme.colors.red['600']}
            strokeDasharray="5 5"
            isFront={false}
          />
          <Tooltip content={<CustomTooltip />} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

export default FlowChart;

const Dot = (props) => {
  const { cx, cy, peak, value } = props;
  const theme = useTheme();
  if (value === peak) {
    return <circle cx={cx} cy={cy} r={4} fill={theme.colors.red['600']} />;
  }
  return null;
};

const CustomTooltip = (props) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <Box bg="blackAlpha.700" color="white" rounded="lg" px={4} py={2}>
        <Box>
          <Text as="span" fontWeight="semibold">
            flow:{' '}
          </Text>
          <Text as="span">{payload[0].value}</Text>
          <Text as="span"> L/s</Text>
        </Box>
        <Box>
          <Text as="span" fontWeight="semibold">
            time:{' '}
          </Text>
          <Text as="span">{Number(label).toFixed(2)}</Text>
          <Text as="span"> s</Text>
        </Box>
      </Box>
    );
  }

  return null;
};
