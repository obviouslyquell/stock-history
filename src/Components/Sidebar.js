import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { dataContext } from '../context';

function Sidebar() {
  const { dataValue, setDataValue } = useContext(dataContext);
  const [value, setValue] = useState(''); // контроль инпута
  const [selectValue, setSelectValue] = useState('Month');
  const [stockInfo, setStockInfo] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const key = 'QZIEPYB5LUEZ87YV';
  const url = 'https://www.alphavantage.co/';
  const stock = 'AAPL';

  // function convertForGraph(obj) {
  //   const ticket = obj['Meta Data']['2. Symbol'];
  //   const arr = [];
  //   for (const property in obj['Monthly Adjusted Time Series']) {
  //     arr.push({
  //       symbol: ticket,
  //       name: property,
  //       price: obj['Monthly Adjusted Time Series'][property]['4. close'],
  //       amt: obj['Monthly Adjusted Time Series'][property]['6. volume'],
  //       div: obj['Monthly Adjusted Time Series'][property]['7. dividend amount'],
  //     });
  //   }
  //   const max = Math.max(...arr.map((o) => o.price));
  //   const min = Math.min(...arr.map((o) => o.price));
  //   return { ticket: ticket, arr: arr, max: max };
  // }
  function convertForGraph(obj) {
    const ticket = obj['Meta Data']['2. Symbol'];
    const arr = [];
    if (obj['Meta Data']['1. Information'] === 'Monthly Adjusted Prices and Volumes') {
      for (const property in obj['Monthly Adjusted Time Series']) {
        arr.push({
          symbol: ticket,
          name: property,
          price: obj['Monthly Adjusted Time Series'][property]['4. close'],
          amt: obj['Monthly Adjusted Time Series'][property]['6. volume'],
          div: obj['Monthly Adjusted Time Series'][property]['7. dividend amount'],
        });
      }
    } else if (obj['Meta Data']['1. Information'] === 'Weekly Adjusted Prices and Volumes') {
      for (const property in obj['Weekly Adjusted Time Series']) {
        arr.push({
          symbol: ticket,
          name: property,
          price: obj['Weekly Adjusted Time Series'][property]['4. close'],
          amt: obj['Weekly Adjusted Time Series'][property]['6. volume'],
          div: obj['Weekly Adjusted Time Series'][property]['7. dividend amount'],
        });
      }
    } else if (
      obj['Meta Data']['1. Information'] === 'Daily Prices (open, high, low, close) and Volumes'
    ) {
      for (const property in obj['Time Series (Daily)']) {
        arr.push({
          symbol: ticket,
          name: property,
          price: obj['Time Series (Daily)'][property]['4. close'],
          amt: obj['Time Series (Daily)'][property]['5. volume'],
        });
      }
    }
    const max = Math.max(...arr.map((o) => o.price));
    const min = Math.min(...arr.map((o) => o.price));
    return { ticket: ticket, arr: arr, max: max };
  }

  const getData = (event) => {
    event.preventDefault();
    let timeRange = '';
    switch (selectValue) {
      case 'Month':
        timeRange = 'TIME_SERIES_MONTHLY_ADJUSTED';
        break;
      case 'Week':
        timeRange = 'TIME_SERIES_WEEKLY_ADJUSTED';
        break;
      case 'Day':
        timeRange = 'TIME_SERIES_DAILY&outputsize=full';
        break;
      default:
        break;
    }
    axios
      .get(`${url}query?function=${timeRange}&symbol=${value}&apikey=${key}`)
      .then((data) => setDataValue(convertForGraph(data.data)));
  };

  // const getSuggestions = (ticket) => {
  //   axios
  //     .get(
  //       `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${ticket}&apikey=${key}`,
  //     )
  //     .then((data) => setSuggestions(data.data.bestMatches));
  //   console.log(suggestions);
  // };

  useEffect(() => {
    axios
      .get(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${value}&apikey=${key}`,
      )
      .then((data) => setSuggestions(data.data.bestMatches));
  }, [value]);

  const handleChange = (e) => {
    setValue(e.target.value.toUpperCase());
    // if (value.length > 1) {
    //   getSuggestions(value);
    // }
  };
  const handleSelectChange = (e) => {
    setSelectValue(e.target.value);
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
          onChange={handleChange}
          autoComplete="off"></input>
        <label htmlFor="input" className="input-label">
          Stock
        </label>
        <select value={selectValue} onChange={handleSelectChange}>
          <option value="Month">Month</option>
          <option value="Week">Week</option>
          <option value="Day">Day</option>
        </select>
        <button onClick={getData}>Submit</button>
      </form>
      {suggestions &&
        suggestions.map((e, index) => (
          <div key={index} className="search__container">
            <span className="search__item-name">{e['1. symbol']}</span>
            <span className="search__item-currency">{e['8. currency']}</span>
          </div>
        ))}
    </header>
  );
}

export default Sidebar;
