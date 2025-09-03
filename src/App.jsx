import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RouterView from './router/index';

function App() {
  return (
    <Router>
      <RouterView />
    </Router>
  );
}

export default App;
