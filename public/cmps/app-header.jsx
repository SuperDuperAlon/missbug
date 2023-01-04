const { NavLink } = ReactRouterDOM;
const { useEffect, useState } = React;

import { UserMsg } from "./user-msg.jsx";
import { LoginSignUp } from "./login-signup.jsx";
import { userService } from "../services/user.service.js";

export function AppHeader() {
  const [user, setUser] = useState(userService.getLoggedinUser());
//userService.getLoggedinUser()
  function onChangeLoginStatus(user) {
    setUser(user);
  }

  function onLogout() {
    userService.logout().then(() => {
      setUser(null);
    });
  }

  return (
    <header>
      <UserMsg />
      <nav>
        <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
        <NavLink to="/about">About</NavLink>
      </nav>
      <h1>Bugs are Forever</h1>
      {user ? (
        <section>
          <h2>Hello {user.fullName}</h2>
          <button onClick={onLogout}>LogOut</button>
        </section>
      ) : (
        <section>
          <LoginSignUp onChangeLoginStatus={onChangeLoginStatus} />
        </section>
      )}
    </header>
  );
}
