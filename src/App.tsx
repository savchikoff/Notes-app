import { Button } from 'antd';
import { Normalize } from 'styled-normalize'
import NotesList from './components/NotesList/NotesList';
import React from 'react';

const App: React.FC = () => (
  <div className="App">
    <NotesList></NotesList>
  </div>
);

export default App;