export default class Data {
  // * Fetches the REST API using users credentials when necessary

  api(path, method, body = null, requiresAuth = false, credentials = null) {
    const url = "http://localhost:5000/api" + path;

    const options = {
      method,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requiresAuth) {
      const encodedCredentials = btoa(
        `${credentials.username}:${credentials.password}`
      );
      options.headers["Authorization"] = `Basic ${encodedCredentials}`;
    }
    return fetch(url, options);
  }

  // * Gets a user by their @param username(here, emailAddress) and @param password
  async getUser(username, password) {
    const response = await this.api(`/users`, "GET", null, true, {
      username,
      password,
    });
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else if (response.status === 401) {
      return null;
    } else {
      throw new Error();
    }
  }

  // Creates a new user with an object user and its properties (see signup.js)
  async createUser(user) {
    const response = await this.api("/users", "POST", user);
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      return response.json().then((data) => {
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }

  // Gets all articles on the database

  async getArticles() {
    const response = await this.api("/articles", "GET", null, false);
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error();
    }
  }

  // Gets selected article by @param id

  async getArticle(id) {
    const response = await this.api(`/articles/${id}`, "GET", null, false);
    if (response.status === 200) {
      return response.json().then((data) => data);
    } else {
      throw new Error();
    }
  }

  async createArticle(article, username, password) {
    const response = await this.api("/articles", "POST", article, true, {
      username,
      password,
    });
    if (response.status === 201) {
      return [];
    } else if (response.status === 400) {
      return response.json().then((data) => {
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }


  async updateArticle(id, article, username, password) {
    const response = await this.api(`/articles/${id}`, "PUT", article, true, {
      username,
      password,
    });
    if (response.status === 204) {
      return [];
    } else if (response.status === 400) {
      return response.json().then((data) => {
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }

  // * Deletes selected article by id
  async deleteArticle(id, username, password) {
    const response = await this.api(`/articles/${id}`, "DELETE", null, true, {
      username,
      password,
    });
    if (response.status === 204) {
      return [];
    } else if (response.status === 400) {
      return response.json().then((data) => {
        return data.errors;
      });
    } else {
      throw new Error();
    }
  }
}
