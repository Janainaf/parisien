import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

function ArticleDetail(props) {
  const params = useParams();
  const { context } = props;
  const [selectedArticle, setselectedArticle] = useState("");
  const id = params.id;
  let navigate = useNavigate();
  const authUser = context.authenticatedUser;

  // Fetches the selected article by id  using context and data helper
  // for more information, please check Context.js and Data.js
  useEffect(() => {
    context.data
      .getArticle(id)
      .then((response) => {
        setselectedArticle(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [context.data, id]);

  // Deletes the selected article by id

  const handleRemoveArticle= (event) => {
    event.preventDefault();
    context.data
      .deleteArticle(
        id,
        authUser.user.emailAddress,
        context.authenticatedUser.password
      )
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <main>
      {/* *** Article Detail header (can be refactored into a new component)
      - shows delete, update and return button depending on auth user *** */}

      <div className="actions--bar">
        {selectedArticle && (
          <div className="wrap">
            {authUser === null ||
            authUser.user.id !== selectedArticle.article.User.id ? (
              <Link to="/" className="button button-secondary">
                Return to List
              </Link>
            ) : (
              <>
                {/* ***Only the user who created the article can update or delete it*** */}
                <Link
                  to={`/articles/${selectedArticle.article.id}/update`}
                  className="button"
                >
                  Update Article{" "}
                </Link>
                <Link to="/" className="button" onClick={handleRemoveArticle}>
                  Delete Article
                </Link>
                <Link to="/" className="button button-secondary">
                  Return to List
                </Link>
              </>
            )}
          </div>
        )}
      </div>
      {/* *** This part can be later refactored into a component *** */}

      <div className="wrap">
        <h2>Article Detail</h2>
        <form>
          <div className="main--flex">
            <div>
              <h3 className="article--detail--title">Article</h3>
              {selectedArticle && (
                <>
                  <h4 className="article--name">
                    {selectedArticle.article.title}
                  </h4>
                  <p>
                    By {selectedArticle.article.User.firstName}{" "}
                    {selectedArticle.article.User.lastName}
                  </p>
                  {/* ***Added Markdown for better readability *** */}

                  <ReactMarkdown>
                    {selectedArticle.article.description}
                  </ReactMarkdown>
                </>
              )}
            </div>
            {/* *** This part can be later refactored into a component *** */}

            {selectedArticle && (
              <div>
                <h3 className="article--detail--title">Estimated Time</h3>
                <p>{selectedArticle.article.estimatedTime}</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
export default ArticleDetail;
