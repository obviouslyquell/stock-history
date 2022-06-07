import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { dataContext } from '../context';

function Sidebar() {
  const { dataValue, setDataValue, news, setNews } = useContext(dataContext);
  const [value, setValue] = useState(''); // контроль инпута
  const [selectValue, setSelectValue] = useState('Month');
  const [stockInfo, setStockInfo] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [enableSearch, setEnableSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const url = 'https://www.alphavantage.co/';
  const stock = 'AAPL';

  useEffect(() => {
    document
      .getElementById('input')
      .addEventListener('focus', () => document.getElementById('form').classList.add('box-shadow'));
    document
      .getElementById('input')
      .addEventListener('blur', () =>
        document.getElementById('form').classList.remove('box-shadow'),
      );
    document
      .getElementById('standard-select')
      .addEventListener('focus', () => document.getElementById('form').classList.add('box-shadow'));
    document
      .getElementById('standard-select')
      .addEventListener('blur', () =>
        document.getElementById('form').classList.remove('box-shadow'),
      );
  }, []);

  function convertForGraph(obj) {
    if (Object.hasOwn(obj, 'Note')) {
      alert('5 запросов в минуту');
      //return null;
    }
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
          open: obj['Monthly Adjusted Time Series'][property]['1. open'],
          high: obj['Monthly Adjusted Time Series'][property]['2. high'],
          low: obj['Monthly Adjusted Time Series'][property]['3. low'],
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
          open: obj['Weekly Adjusted Time Series'][property]['1. open'],
          high: obj['Weekly Adjusted Time Series'][property]['2. high'],
          low: obj['Weekly Adjusted Time Series'][property]['3. low'],
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
          open: obj['Time Series (Daily)'][property]['1. open'],
          high: obj['Time Series (Daily)'][property]['2. high'],
          low: obj['Time Series (Daily)'][property]['3. low'],
        });
      }
    }
    const max = Math.max(...arr.map((o) => o.price));
    const min = Math.min(...arr.map((o) => o.price));
    return { ticket: ticket, arr: arr, max: max };
  }

  const getData = (event) => {
    setIsLoading(true);
    setNews([]);
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
      .get(
        `${url}query?function=${timeRange}&symbol=${value}&apikey=${process.env.REACT_APP_STOCK_KEY}`,
      )
      .then((data) => {
        setDataValue(convertForGraph(data.data));
        setIsLoading(false);
      })
      .catch((err) => alert(err))
      .finally(() => setIsLoading(false));

    setValue(''); // сбрасывает инпут
  };

  useEffect(() => {
    if (enableSearch && value.length > 0) {
      axios
        .get(
          `${url}query?function=SYMBOL_SEARCH&keywords=${value}&apikey=${process.env.REACT_APP_STOCK_KEY}`,
        )
        .then((data) => setSuggestions(data.data.bestMatches));
      document.getElementById('input').classList.add('border-radius-top-left');
      document.getElementById('searchBtn').classList.add('border-radius-top-right');
    } else {
      setSuggestions([]); // hide suggestions
      document.getElementById('input').classList.remove('border-radius-top-left');
      document.getElementById('searchBtn').classList.remove('border-radius-top-right');
    }
  }, [value, enableSearch]);

  const onItemClick = (e) => {
    setValue(e.target.textContent);
    document.getElementById('searchBtn').click();
  };
  const handleChange = (e) => {
    setValue(e.target.value.toUpperCase());
  };
  const handleSelectChange = (e) => {
    setSelectValue(e.target.value);
  };
  return (
    <header className="header">
      <label className="toggle" htmlFor="searchCheckBox" id="standard-toggle" tabIndex="0">
        <input
          type="checkbox"
          className="toggle__input"
          id="searchCheckBox"
          checked={enableSearch}
          onChange={() => {
            setEnableSearch(!enableSearch);
            console.log('setenable');
          }}
        />
        <span className="toggle-track">
          <span className="toggle-indicator">
            <span className="checkMark">
              <svg viewBox="0 0 24 24" id="ghq-svg-check" role="presentation" aria-hidden="true">
                <path d="M9.86 18a1 1 0 01-.73-.32l-4.86-5.17a1.001 1.001 0 011.46-1.37l4.12 4.39 8.41-9.2a1 1 0 111.48 1.34l-9.14 10a1 1 0 01-.73.33h-.01z"></path>
              </svg>
            </span>
          </span>
        </span>
        Enable search
      </label>

      <form action="submit" className="header__form" id="form">
        <input
          id="input"
          className="input-text"
          type="text"
          placeholder="Type a ticket..."
          value={value}
          onChange={handleChange}
          onBlur={(e) => {
            if (
              e.relatedTarget?.id !== 'standard-select' &&
              e.relatedTarget?.id !== 'standard-toggle'
            ) {
              setEnableSearch(false);
            }
          }}
          autoComplete="off"></input>
        <label htmlFor="input" className="input-label">
          Stock
        </label>
        <label htmlFor="standard-select"></label>
        <div className="select">
          <select id="standard-select" value={selectValue} onChange={handleSelectChange}>
            <option value="Month">Month</option>
            <option value="Week">Week</option>
            <option value="Day">Day</option>
          </select>
          <div className="desc"></div>
        </div>
        <button
          onClick={getData}
          id="searchBtn"
          className={`header__form-btn ${isLoading ? 'loading' : ''}`}>
          Submit
        </button>
      </form>
      <div className="header__form-search__suggestions">
        {suggestions &&
          suggestions.map((e, index) => (
            <div key={index} className="search__container" onMouseDown={onItemClick}>
              <span className="search__item-name">
                {e['1. symbol']} ({e['2. name']})
              </span>
              <div>
                <span className="search__item-currency">{e['8. currency']}</span>
                <span className="search__item-region">{e['4. region']}</span>
              </div>
            </div>
          ))}
      </div>
    </header>
  );
}

export default Sidebar;
