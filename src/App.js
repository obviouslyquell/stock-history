import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import Graph from './Components/Graph';
import Info from './Components/Info';
import Sidebar from './Components/Sidebar';
import { dataContext } from './context';

function App() {
  const [dataValue, setDataValue] = useState('');
  return (
    <dataContext.Provider value={{ dataValue, setDataValue }}>
      <div className="App">
        <Sidebar />
        <div className="container">
          <Graph />
          {/* <Info /> */}
        </div>
      </div>
    </dataContext.Provider>
  );
}

export default App;
