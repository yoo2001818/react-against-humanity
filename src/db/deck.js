import fs from 'fs';
import path from 'path';

// Load test deck, and split it to answer and question section.
const rawData = fs.readFileSync(path.resolve(__dirname, 'testDeck.txt'),
  'utf-8').split('\n');
const data = {};
let section = 'Q';
for (let line of rawData) {
  let [type, text] = line.split('\t');
  if (type) section = type;
  if (!text) continue;
  if (data[section] == null) data[section] = [];
  let card = {
    type: section,
    text
  };
  if (section === 'Q') card.answerCount = text.split('_').length - 1;
  data[section].push(card);
}

export default data;

export function getQuestion() {
  const deck = data['Q'];
  return deck[deck.length * Math.random() | 0];
}

export function getAnswer(count) {
  const deck = data['A'];
  let output = [];
  for (let i = 0; i < count; ++i) {
    output.push(deck[deck.length * Math.random() | 0]);
  }
  return output;
}
