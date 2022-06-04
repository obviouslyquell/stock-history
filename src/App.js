import { useState } from 'react';
import './App.scss';
import Graph from './Components/Graph';
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
