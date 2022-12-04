import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Articles(props) {
  const { context } = props;
  const [data, setData] = useState("");

  useEffect(() => {
    context.data
      .getArticles()
      .then((response) => {
        setData(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [context.data]);

  return (
    <div className="wrap main--grid">
      {data &&
        data.map((article) => (
          <Link
            to={`/articles/${article.id}`}
            className="article--module article--link"
            key={article.id}
          >
            <h2 className="article--label">article</h2>
            <h3 className="article--title">{article.title}</h3>
          </Link>
        ))}
      <Link to="/articles/create" className="article--module article--add--module">
        <span className="article--add--title">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 13 13"
            className="add"
          >
            <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
          </svg>
          Rajouter un Article
        </span>
      </Link>
    </div>
  );
}
export default Articles;
