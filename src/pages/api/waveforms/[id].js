import fs from 'fs';
import path from 'path';

export default (req, res) => {
  const { id } = req.query;

  const dir = path.resolve('./public', 'waveforms', `${id}.txt`);

  const file = fs.readFileSync(dir, 'utf8');

  const data = file
    .split('\n')
    .map((line) => parseFloat(line))
    .slice(0, -1);

  return res.status(200).json(data);
};
