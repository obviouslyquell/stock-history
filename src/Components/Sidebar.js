import axios from 'axios';
import React, { useContext, useState } from 'react';
import { dataContext } from '../context';

function Sidebar() {
  const { dataValue, setDataValue } = useContext(dataContext);
  const [value, setValue] = useState(''); // контроль инпута
  const [stockInfo, setStockInfo] = useState('');

  const key = 'QZIEPYB5LUEZ87YV';
  const url = 'https://www.alphavantage.co/';
  const stock = 'AAPL';

  function convertForGraph(obj) {
    const ticket = obj['Meta Data']['2. Symbol'];
    const arr = [];
    for (const property in obj['Monthly Adjusted Time Series']) {
      arr.push({
        symbol: ticket,
        name: property,
        price: obj['Monthly Adjusted Time Series'][property]['4. close'],
        amt: obj['Monthly Adjusted Time Series'][property]['6. volume'],
        div: obj['Monthly Adjusted Time Series'][property]['7. dividend amount'],
      });
    }
    const max = Math.max(...arr.map((o) => o.price));
    return { ticket: ticket, arr: arr, max: max };
  }
  const getData = (event) => {
    event.preventDefault();
    axios
      .get(`${url}query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${value}&apikey=${key}`)
      .then((data) => setDataValue(convertForGraph(data.data)));
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <header className="header">
      <form action="submit" className="header__form">
        <input
          id="input"
          className="input-text"
          type="text"
          placeholder="Type a ticket..."
          value={value}
          onChange={handleChange}></input>
        <label htmlFor="input" className="input-label">
          Stock
        </label>
        <button onClick={getData}>Submit</button>
      </form>
    </header>
  );
}

export default Sidebar;
