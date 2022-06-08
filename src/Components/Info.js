import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { dataContext } from '../context';

function Info() {
  const { dataValue, setDataValue, news, setNews, newsPage, setNewsPage } = useContext(dataContext);
  const [selectLanguage, setSelectLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [stopLoading, setStopLoading] = useState(false);
  let weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);
    return function () {
      document.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  useEffect(() => {
    // if results<5 {page isnt incrementing}
    if (loading && !stopLoading) {
      axios
        .get(
          `https://newsapi.org/v2/everything?q=${
            dataValue?.ticket ? dataValue.ticket : 'stocks'
          }&from=${
            weekAgo.toISOString().split('T')[0]
          }&sortBy=relevancy&language=${selectLanguage}&apiKey=${
            process.env.REACT_APP_NEWS_KEY
          }&pageSize=5&page=${newsPage}`,
        )
        .then((resp) => {
          if (resp.data.totalResults > newsPage * 5) {
            setNews([...news, ...resp.data.articles]);
            setNewsPage((prev) => prev + 1);
          }
          if (resp.data.totalResults <= 5) {
            setNews(resp.data.articles);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [loading, dataValue]);

  const handleSelectChange = (e) => {
    setSelectLanguage(e.target.value);
    setNews([]);
    setNewsPage(1);
    setLoading(true);
  };

  const scrollHandler = (e) => {
    if (
      e.target.documentElement.scrollHeight -
        (e.target.documentElement.scrollTop + window.innerHeight) <
      100
    ) {
      setLoading(true);
    }
  };
  return (
    <section className="news">
      <h1 className="heading">
        {dataValue ? `Latest news about ${dataValue?.ticket}` : `Latest news about stocks`}
      </h1>

      <div className="select">
        <select id="standard-select" value={selectLanguage} onChange={handleSelectChange}>
          <option value="en">EN</option>
          <option value="ru">RU</option>
          <option value="de">DE</option>
          <option value="es">ES</option>
        </select>
        <div className="desc"></div>
      </div>

      {news &&
        news.map((e, index) => (
          <div className="news__item" key={index}>
            <h1>{e.title}</h1>
            <p>{e.description}</p>
            <p>{e.content}</p>
          </div>
        ))}
    </section>
  );
}

export default Info;
