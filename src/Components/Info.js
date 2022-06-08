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
  const isRepeated = (a, b) => {
    return a.split(' ').slice(0, 3).join(' ') === b.split(' ').slice(0, 3).join(' ');
  };
  const isBreak = (a) => {
    return a.split(' ').includes('<a') || a.split(' ').includes('<li');
  };
  console.log(news);
  return (
    <section className="news">
      <div className="news__header">
        <h1 className="news__header-heading heading">
          {dataValue ? `Latest news about ${dataValue?.ticket}` : `Latest news about stocks`}
        </h1>

        <div className="news__select">
          <select id="standard-select" value={selectLanguage} onChange={handleSelectChange}>
            <option value="en">EN</option>
            <option value="ru">RU</option>
            <option value="de">DE</option>
            <option value="es">ES</option>
          </select>
          <div className="news__desc"></div>
        </div>
      </div>

      {news &&
        news.map((e, index) => (
          <div className="news__item" key={index}>
            <a href={e.url} target="_blank" rel="noopener noreferrer">
              <h1 className="news__item-heading">{e.title}</h1>
            </a>
            <div className="news__item-container">
              <img src={e.urlToImage} alt="news picture" className="news__item-image" />
              <div>
                <a
                  href={e.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="news__item-link">
                  {`${e.source.name[0].toLowerCase()}${e.source.name.slice(1)}`}
                </a>
                <p className="news__item-description">{!isBreak(e.description) && e.description}</p>
                <p className="news__item-content">
                  {!isRepeated(e.description, e.content) && e.content}
                </p>
              </div>
            </div>
          </div>
        ))}
    </section>
  );
}

export default Info;
