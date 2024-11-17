import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Account() {
  let { user, setUser } = useContext(UserContext);
  return (
    <div className="account">
      <p>{user.username}</p>
      <button onClick={() => setUser([])}>sign out</button>
      <div className="accountlinks">
        <Link>Your Topics</Link>
        <Link>Your Replies</Link>
      </div>
      <button>settings</button>
    </div>
  );
}
//NEED TO CREATE REAL LINKS AND DESTINATIONS
