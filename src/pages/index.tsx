import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { Stat, StatLabel, StatNumber, HStack } from '@chakra-ui/react';

import { Container } from '../components/Container';
import { Main } from '../components/Main';

import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { convertFlowToVolume, getPeak } from '../utils';
import FlowChart from '../components/Charts/Flow';

// Global.isSsr = false;

const Index = ({ flow, peakFlow, volume }) => {
  const [fev, setFev] = useState();
  const [frv, setFrv] = useState([]);

  return (
    <Container height="100vh">
      <Main alignItems="center">
        <HStack
          border="3px solid"
          borderColor="teal.400"
          rounded="lg"
          p={4}
          w="container.sm"
        >
          <Stat>
            <StatLabel>Peak Flow</StatLabel>
            <StatNumber>{peakFlow ?? ''} L/s</StatNumber>
          </Stat>

          <Stat>
            <StatLabel>Fev1</StatLabel>
            <StatNumber>{fev ?? '0'} L</StatNumber>
          </Stat>
        </HStack>
        {flow.length > 0 && <FlowChart flow={flow} />}
        {volume.length > 0 && (
          <LineChart
            width={500}
            height={300}
            data={volume}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="index"
              interval={250}
              tickFormatter={(x) => {
                return x.toFixed(1);
              }}
            />
            <YAxis />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#82ca9d"
              strokeWidth={4}
              dot={false}
            />
          </LineChart>
        )}
        {frv.length > 0 && (
          <LineChart
            width={500}
            height={300}
            data={frv}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="volume" />
            <YAxis />
            <Line type="monotone" dataKey="flow" stroke="#82ca9d" dot={false} />
          </LineChart>
        )}
      </Main>
    </Container>
  );
};

export default Index;

export const getStaticProps: GetStaticProps = async (context) => {
  const response = await fetch('http://localhost:3000/api/waveforms/1');
  const flow = await response.json();

  const flowValues = flow.map((d) => d.value);
  const peakFlow = getPeak(flowValues);
  const volume = convertFlowToVolume(flow);
  console.log(volume);

  return {
    props: {
      flow,
      peakFlow,
      volume,
    },
  };
};
