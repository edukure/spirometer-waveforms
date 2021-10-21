import fs from 'fs';
import path from 'path';

export default (req, res) => {
  const { id } = req.query;

  const dir = path.resolve('./public', 'waveforms', `${id}.txt`);

  const file = fs.readFileSync(dir, 'utf8');

  const values = file
    .split('\n')
    .map((line) => parseFloat(line))
    .slice(0, -1);

  const data = values.map((value, index) => ({
    value,
    index: index * 0.002,
  }));

  return res.status(200).json(data);
};
