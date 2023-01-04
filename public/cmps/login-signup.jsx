import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js";
import { userService } from "../services/user.service.js"
import { LoginForm } from "./login-form.jsx";

const { useState } = React;

export function LoginSignUp({ onChangeLoginStatus }) {
  const [isSignUp, setIsSignUp] = useState(false);

  function onLogin(credentials) {
    isSignUp ? signup(credentials) : login(credentials);
  }

  function login(credentials) {
    userService.login(credentials)
      .then(onChangeLoginStatus)
      .then(() => {
        showSuccessMsg("Logged in Successfully");
      })
      .catch((err) => {
        showErrorMsg("Oops Try again");
      });
  }

  function signup(credentials) {
    userService.signup(credentials)
      .then(onChangeLoginStatus)
      .then(() => {
        showSuccessMsg("Signed In succesfully");
      })
      .catch((err) => {
        showErrorMsg("Oops Try again");
      });
  }

  return (
    <div className="login-page">
      <LoginForm onLogin={onLogin} isSignUp={isSignUp} />
      <div className="btns">
        <a href="#" onClick={() => setIsSignUp}>
          {isSignUp ? "already a member? Login" : "new User? ignup here"}
        </a>
      </div>
    </div>
  );
}
