import React from "react";
import { useState } from "react";
import Forbidden from "./Forbidden";

import { Link, useNavigate } from "react-router-dom";

function CreateArticle(props) {
  const { context } = props;
  let navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedTime, setestimatedTime] = useState("");
  const [materialsNeeded, setmaterialsNeeded] = useState("");
  const [errors, setErrors] = useState([]);

  const authUser = context.authenticatedUser;

  // Creates a new article  using context and data helper
  // for more information, please check Context.js and Data.js
  function handleSubmit(event) {
    event.preventDefault();
    const article = {
      title,
      description,
      estimatedTime,
      materialsNeeded,
      userId: authUser.user.id,
    };
    context.data
      .createArticle(
        article,
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
  }

  return (
    <div id="root">
      <main>
        {/* Only registered users can create a article */}
        {authUser === null && <Forbidden />}
        {authUser !== null && (
          <div className="wrap">
            <h2>Create Article</h2>
            {errors.length > 0 && (
              <div className="validation--errors">
                {/* To create a article, users have to provide title and description */}
                <h3>Validation Errors</h3>
                <ul>
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="main--flex">
                <div>
                  <label htmlFor="articleTitle">Article Title</label>
                  <input
                    id="articleTitle"
                    name="articleTitle"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                  <p>
                    {" "}
                    By {authUser.user.firstName} {authUser.user.lastName}
                  </p>

                  <label htmlFor="articleDescription">Article Description</label>
                  <textarea
                    id="articleDescription"
                    name="articleDescription"
                    type="text"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="estimatedTime">Estimated Time</label>

                  <input
                    id="estimatedTime"
                    name="estimatedTime"
                    type="text"
                    value={estimatedTime}
                    onChange={(event) => setestimatedTime(event.target.value)}
                  />
                  <label htmlFor="materialsNeeded">Materials Needed</label>
                </div>
              </div>
              <button className="button" type="submit">
                Create Article
              </button>
              <Link to="/">
                <button className="button button-secondary">Cancel</button>{" "}
              </Link>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default CreateArticle;
