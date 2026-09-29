export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  label: string;
  text: string;
}

export interface TerritoryQuestion {
  id: string;
  category: string;
  prompt: string;
  codeSnippet?: string;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  reward: number; // in Bits
  explanation?: string;
}

export const TERRITORY_QUESTIONS: TerritoryQuestion[] = [
  {
    id: 'tq-1',
    category: 'JAVASCRIPT // TYPES',
    prompt: 'What is the output of typeof NaN in JavaScript?',
    codeSnippet: 'console.log(typeof NaN);',
    options: [
      { key: 'A', label: 'A', text: '"undefined"' },
      { key: 'B', label: 'B', text: '"number"' },
      { key: 'C', label: 'C', text: '"nan"' },
      { key: 'D', label: 'D', text: '"object"' },
    ],
    correctAnswer: 'B',
    reward: 2,
    explanation: 'In JavaScript, NaN (Not-a-Number) is officially of type "number" per IEEE 754 floating point standard.',
  },
  {
    id: 'tq-2',
    category: 'JAVASCRIPT // EVENT LOOP',
    prompt: 'Where are resolved Promise callbacks placed before execution in the event loop?',
    codeSnippet: 'Promise.resolve().then(() => console.log("Resolved!"));',
    options: [
      { key: 'A', label: 'A', text: 'Microtask Queue' },
      { key: 'B', label: 'B', text: 'Macrotask Queue' },
      { key: 'C', label: 'C', text: 'Thread Pool' },
      { key: 'D', label: 'D', text: 'Call Stack immediately' },
    ],
    correctAnswer: 'A',
    reward: 2,
    explanation: 'Promises and mutation observers use the Microtask queue, which has higher priority than macrotasks (like setTimeout).',
  },
  {
    id: 'tq-3',
    category: 'ALGORITHMS // COMPLEXITY',
    prompt: 'What is the average time complexity of looking up a key in a JavaScript Map or Hash Table?',
    options: [
      { key: 'A', label: 'A', text: 'O(n)' },
      { key: 'B', label: 'B', text: 'O(log n)' },
      { key: 'C', label: 'C', text: 'O(1)' },
      { key: 'D', label: 'D', text: 'O(n²)' },
    ],
    correctAnswer: 'C',
    reward: 2,
    explanation: 'Hash tables offer constant time O(1) average lookup through direct hashing of keys.',
  },
  {
    id: 'tq-4',
    category: 'JAVASCRIPT // IMMUTABILITY',
    prompt: 'What happens when mutating a property of an object declared with const?',
    codeSnippet: 'const player = { score: 10 };\nplayer.score = 25;\nconsole.log(player.score);',
    options: [
      { key: 'A', label: 'A', text: 'Throws a TypeError: Assignment to constant variable' },
      { key: 'B', label: 'B', text: 'Silently fails and score remains 10' },
      { key: 'C', label: 'C', text: 'Logs 25 (the object property mutates successfully)' },
      { key: 'D', label: 'D', text: 'Returns undefined' },
    ],
    correctAnswer: 'C',
    reward: 2,
    explanation: 'const binds the variable reference, not the inner contents of an object.',
  },
  {
    id: 'tq-5',
    category: 'JAVASCRIPT // ARRAYS',
    prompt: 'What will the following reduce function return?',
    codeSnippet: '[1, 2, 3, 4].reduce((acc, curr) => acc + curr, 10);',
    options: [
      { key: 'A', label: 'A', text: '10' },
      { key: 'B', label: 'B', text: '20' },
      { key: 'C', label: 'C', text: '24' },
      { key: 'D', label: 'D', text: 'NaN' },
    ],
    correctAnswer: 'B',
    reward: 2,
    explanation: 'Initial accumulator is 10, plus (1 + 2 + 3 + 4 = 10), resulting in 20.',
  },
  {
    id: 'tq-6',
    category: 'JAVASCRIPT // SCOPE & CLOSURES',
    prompt: 'What is a closure in JavaScript?',
    options: [
      { key: 'A', label: 'A', text: 'A function bundled together with references to its lexical environment' },
      { key: 'B', label: 'B', text: 'A method to forcibly terminate execution of an asynchronous task' },
      { key: 'C', label: 'C', text: 'A private variable declared inside an IIFE' },
      { key: 'D', label: 'D', text: 'A syntax construct to close unhandled event listeners' },
    ],
    correctAnswer: 'A',
    reward: 2,
    explanation: 'A closure gives an inner function access to an outer function’s scope even after the outer function has returned.',
  },
  {
    id: 'tq-7',
    category: 'WEB // STORAGE',
    prompt: 'Which browser storage mechanism persists across browser sessions and tabs until explicitly cleared?',
    options: [
      { key: 'A', label: 'A', text: 'sessionStorage' },
      { key: 'B', label: 'B', text: 'localStorage' },
      { key: 'C', label: 'C', text: 'Memory Cache' },
      { key: 'D', label: 'D', text: 'Cookie with expires=0' },
    ],
    correctAnswer: 'B',
    reward: 2,
    explanation: 'localStorage persists until explicitly removed by the user or an application script.',
  },
  {
    id: 'tq-8',
    category: 'TYPESCRIPT // UTILITY TYPES',
    prompt: 'Which TypeScript utility type constructs a type with all properties of Type set to optional?',
    codeSnippet: 'type UserUpdate = Partial<User>;',
    options: [
      { key: 'A', label: 'A', text: 'Required<T>' },
      { key: 'B', label: 'B', text: 'Omit<T, K>' },
      { key: 'C', label: 'C', text: 'Partial<T>' },
      { key: 'D', label: 'D', text: 'Readonly<T>' },
    ],
    correctAnswer: 'C',
    reward: 2,
    explanation: 'Partial<T> marks all properties of type T as optional with ? modifier.',
  },
];
