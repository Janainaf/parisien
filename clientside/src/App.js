import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Articles from "./components/Articles";
import ArticleDetail from "./components/ArticleDetail";
import CreateArticle from "./components/CreateArticle";
import UpdateArticle from "./components/UpdateArticle";
import UserSignIn from "./components/UserSignIn";
import UserSignUp from "./components/UserSignUp";
import UserSignOut from "./components/UserSignOut";
import NotFound from "./components/NotFound";
import withContext from "./Context";
import PrivateRoute from "./PrivateRoute";

// Used context to get authenticated User for all components.
// Can be refactored to use {useContext} within each component

const HeaderWithContext = withContext(Header);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInUpWithContext = withContext(UserSignIn);
const UserSignOutUpWithContext = withContext(UserSignOut);
const CreateArticleWithContext = withContext(CreateArticle);
const ArticlesWithContext = withContext(Articles);
const ArticleDetailWithContext = withContext(ArticleDetail);
const UpdateArticleDetailWithContext = withContext(UpdateArticle);
const PrivateRouteWithContext = withContext(PrivateRoute);

function App() {
  return (
    <div>
      {/* ***** Routes for every component **** */}
      <main>
        <HeaderWithContext />
        <Routes>
          <Route exact path="/" element={<ArticlesWithContext />} />
          <Route path={`articles/:id`} element={<ArticleDetailWithContext />} />
          <Route path="/articles/create" element={<CreateArticleWithContext />} />

          {/* ***** Private Routes ONLY FOR authenticated User **** */}
          {/* ***** Check PrivateRoute component **** */}

          <Route
            path="/articles/:id/update"
            element={<PrivateRouteWithContext />}
          >
            <Route
              path="/articles/:id/update"
              element={<UpdateArticleDetailWithContext />}
            />
          </Route>

          <Route path="/articles/create" element={<PrivateRouteWithContext />}>
            <Route
              path="/articles/create"
              element={<CreateArticleWithContext />}
            />
          </Route>

          <Route exact path="/signin" element={<UserSignInUpWithContext />} />
          <Route exact path="/signup" element={<UserSignUpWithContext />} />
          <Route exact path="/signout" element={<UserSignOutUpWithContext />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
