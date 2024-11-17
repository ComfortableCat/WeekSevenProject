import { useState, useContext } from "react";
import SignInForm from "./SignInForm";
import { UserContext } from "../context/UserContext";
import Account from "./Account";

export default function UserBtn() {
  const { user } = useContext(UserContext);
  const [signingIn, setSigningIn] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  return (
    <>
      {user.length === 0 ? (
        <>
          <button onClick={() => setSigningIn(!signingIn)}>sign in</button>
          {signingIn && <SignInForm />}
        </>
      ) : (
        <>
          <button onClick={() => setShowAccount(!showAccount)}>account</button>
          {showAccount && <Account />}
        </>
      )}
    </>
  );
}
