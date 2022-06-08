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
  const [newsPage, setNewsPage] = useState(1);
  return (
    <dataContext.Provider value={{ dataValue, setDataValue, news, setNews, newsPage, setNewsPage }}>
      <div className="App">
        <Sidebar />
        <div className="container">
          {dataValue ? <Graph /> : <></>}
          <Info />
        </div>
      </div>
    </dataContext.Provider>
  );
}

export default App;
