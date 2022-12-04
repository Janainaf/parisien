import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Forbidden from "./Forbidden";
import axios from "axios";

function UpdateArticle(props) {
  const params = useParams();
  const { context } = props;
  const [selectedArticle, setselectedArticle] = useState("");
  const id = params.id;
  let navigate = useNavigate();
  const authUser = context.authenticatedUser;
  const [errors, setErrors] = useState([]);

  // Fetches the selected article by id using axios
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/articles${id}`)
      .then((response) => {
        setselectedArticle(response.data.article);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, authUser.user.id]);

  // Updates the selected article by id  using context and data helper
  // for more information, please check Context.js and Data.js

  const handleUpdateArticle = (event) => {
    event.preventDefault();

    context.data
      .UpdateArticle(
        id,
        selectedArticle,
        authUser.user.emailAddress,
        context.authenticatedUser.password
      )
      .then((errors) => {
        if (errors.length) {
          setErrors(errors);
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChanges = (event) => {
    setselectedArticle((prevValue) => ({
      ...prevValue,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="wrap">
      {selectedArticle && (
        <>
          {/* ***Only the user who created the article can update or delete it*** */}

          {authUser === null || authUser.user.id !== selectedArticle.User.id ? (
            <Forbidden />
          ) : (
            selectedArticle && (
              <>
                {/* To update a article, users have to provide title and description */}

                <h2>Update Article</h2>
                {errors.length > 0 && (
                  <div className="validation--errors">
                    <h3>Validation Errors</h3>
                    <ul>
                      {errors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <form onSubmit={handleUpdateArticle}>
                  <div className="main--flex">
                    <div>
                      <label htmlFor="articleTitle">Article Title</label>
                      <input
                        id="title"
                        type="text"
                        name="title"
                        defaultValue={selectedArticle.title}
                        onInput={handleChanges}
                      />
                      <p>
                        By {selectedArticle.User.firstName}{" "}
                        {selectedArticle.User.lastName}
                      </p>

                      <label htmlFor="articleDescription">
                        Article Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        defaultValue={selectedArticle.description}
                        onInput={handleChanges}
                      ></textarea>
                    </div>
                    <div>
                      <label htmlFor="estimatedTime">Estimated Time</label>
                      <input
                        id="estimatedTime"
                        name="estimatedTime"
                        type="text"
                        defaultValue={selectedArticle.estimatedTime}
                        onInput={handleChanges}
                      />

                      <label htmlFor="materialsNeeded">Materials Needed</label>
                      <textarea
                        id="materialsNeeded"
                        name="materialsNeeded"
                        defaultValue={selectedArticle.materialsNeeded}
                        onInput={handleChanges}
                      ></textarea>
                    </div>
                  </div>
                  <button className="button" type="submit">
                    Update Article
                  </button>
                  <Link to={`/articles/${id}`}>
                    <button className="button button-secondary">Cancel</button>{" "}
                  </Link>{" "}
                </form>
              </>
            )
          )}
        </>
      )}
    </div>
  );
}

export default UpdateArticle;
