import React  from 'react';
import ReactDOM from 'react-dom';
import { hello } from "./sub";

console.log('hello');
hello();

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
