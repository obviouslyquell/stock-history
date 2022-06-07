import { useState } from 'react';
import './App.scss';
import Graph from './Components/Graph';
import Info from './Components/Info';
import Sidebar from './Components/Sidebar';
import { dataContext } from './context';

function App() {
  const [dataValue, setDataValue] = useState('');
  const [news, setNews] = useState([]);
  const [isSameNews, setIsSameNews] = useState(false);
  return (
    <dataContext.Provider value={{ dataValue, setDataValue, news, setNews }}>
      <div className="App">
        <Sidebar />
        <div className="container">
          {dataValue ? (
            <Graph />
          ) : (
            <div className="App__hint">Type your stock ticket in search</div>
          )}
          <Info />
        </div>
      </div>
    </dataContext.Provider>
  );
}

export default App;
