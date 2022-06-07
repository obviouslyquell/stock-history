import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { dataContext } from '../context';

function Info() {
  const { dataValue, setDataValue, news, setNews } = useContext(dataContext);
  const [selectLanguage, setSelectLanguage] = useState('en');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

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
    if (loading) {
      axios
        .get(
          `https://newsapi.org/v2/everything?q=${
            dataValue?.ticket ? dataValue.ticket : 'stocks'
          }&from=${
            weekAgo.toISOString().split('T')[0]
          }&sortBy=relevancy&language=${selectLanguage}&apiKey=${
            process.env.REACT_APP_SECOND_NEWS_KEY
          }&pageSize=5&page=${page}`,
        )
        .then((resp) => {
          setNews([...news, ...resp.data.articles]);
          setPage((prev) => prev + 1);
        })
        .finally(() => setLoading(false));
    }
  }, [dataValue, selectLanguage, loading]);

  const handleSelectChange = (e) => {
    setSelectLanguage(e.target.value);
    setNews([]);
    setLoading(true);
  };

  const scrollHandler = (e) => {
    if (
      e.target.documentElement.scrollHeight -
        (e.target.documentElement.scrollTop + window.innerHeight) <
      10
    ) {
      setLoading(true);
    }
  };
  return (
    <section className="news">
      <h1 className="heading">Latest news</h1>

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
