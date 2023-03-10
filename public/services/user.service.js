const BASE_URL = "/api/user/";

export const userService = {
  get,
  signup,
  login,
  logout,
  getEmptyCredentials,
  getLoggedinUser,
};

function get(userId) {
  return axios.get(BASE_URL + userId).then((res) => res.data);
}

function signup(credentials) {
  return axios
    .post(BASE_URL + "signup", credentials)
    .then((res) => res.data)
    .then((user) => {
      _saveLoggedinUser(user);
      return user;
    });
}

function login(credentials) {
  return axios
    .post(BASE_URL + "login", credentials)
    .then((res) => res.data)
    .then(({ data: user }) => {
      console.log(user);
      _saveLoggedinUser(user);
      return user;
    });
}

function getEmptyCredentials(
  fullname = "",
  username = "",
  password = "secret"
) {
  return { fullname, username, password };
}

function getLoggedinUser() {
  const test = (sessionStorage.getItem("loggedinUser"));
  console.log(test);
  return JSON.parse(test || null);
}

function logout() {
  return axios.post(BASE_URL + "logout").then(() => {
    sessionStorage.removeItem("loggedinUser");
  });
}

function _saveLoggedinUser(user) {
  sessionStorage.setItem("loggedinUser", JSON.stringify(user || null));
}
