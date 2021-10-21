import { Box, Text } from '@chakra-ui/react';
import { Container } from '../components/Container';
import { Main } from '../components/Main';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Global } from 'recharts';
import { convertFlowToVolume, getPeak } from '../utils';

Global.isSsr = true;
const Index = ({ flow, peakFlow, volume }) => {
  // const flowetData] = useState([]);
  // const [peakFlow, setPeakFlow] = useState();
  const [fev, setFev] = useState();
  // const [volume, setVolume] = useState([]);
  const [frv, setFrv] = useState([]);

  console.log(flow);

  return (
    <Container height="100vh">
      <Main>
        <Box>
          <Text>peak flow: {peakFlow ?? ''}</Text>
          <Text>fev: {fev ?? ''}</Text>
          {flow.length > 0 && (
            <LineChart
              width={500}
              height={300}
              data={flow}
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
                isAnimationActive={false}
                type="monotone"
                dataKey="value"
                stroke="#82ca9d"
                dot={false}
              />
            </LineChart>
          )}
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
              <Line type="" dataKey="value" stroke="#82ca9d" dot={false} />
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
              <Line type="" dataKey="flow" stroke="#82ca9d" dot={false} />
            </LineChart>
          )}
        </Box>
      </Main>
    </Container>
  );
};

export default Index;

export const getServerSideProps = async () => {
  const response = await fetch('http://localhost:3000/api/waveforms/1');
  const flow = await response.json();

  const values = flow.map((d) => d.value);
  const peakFlow = getPeak(values);
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
