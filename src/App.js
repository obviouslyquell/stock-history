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
          {dataValue ? (
            <Graph />
          ) : (
            <div className="App__hint">Type your stock ticket in search</div>
          )}
          {/* <Info /> */}
        </div>
      </div>
    </dataContext.Provider>
  );
}

export default App;
