import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function SignInForm() {
  let { user, setUser } = useContext(UserContext);
  const [createUser, setCreateUser] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    if (data.username !== "" && data.password !== "") {
      if (createUser === false) {
        const response = await fetch(
          `http://localhost:8080/users?username=${data.username}&password=${data.password}`
        );
        const json = await response.json();
        const userInfo = await json[0];
        if (userInfo === undefined) {
          //ERROR USERNAME OR PASSWORD INCORRECT
          setError("Username or password are incorrect");
        } else if (
          userInfo.username == data.username &&
          userInfo.password == data.password
        ) {
          setUser(userInfo);
        } else {
          alert("UNEXPECTED ERROR");
        }
      } else {
        if (data.password === data.confirmPassword) {
          const response = await fetch("http://localhost:8080/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          const success = await response.json();
          if (success === "User Created") {
            setUser(data);
          } else if (success === "User Exists") {
            setError("User already exists");
          }
        } else {
          setError("Passwords must match");
        }
      }
    } else {
      setError("inputs can not be empty");
    }
  }

  return (
    <div className="signInForm">
      <p>{createUser ? "Create User" : "Sign In"}</p>
      <form onSubmit={handleSubmit}>
        {error !== "" && <p>{error}</p>}
        <label>Username</label>
        <input type="text" name="username" />
        <label>Password</label>
        <input type="text" name="password" />
        {createUser && (
          <>
            <label>Confirm Password</label>
            <input type="text" name="confirmPassword" />
          </>
        )}
        <button type="submit">{createUser ? "Create User" : "Sign In"}</button>
      </form>
      <p>or</p>
      <button
        onClick={() => {
          setCreateUser(!createUser);
          setError("");
        }}
        type="button"
      >
        {createUser ? "Sign In" : "Create User"}
      </button>
    </div>
  );
}
