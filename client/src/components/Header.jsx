import { Link } from "react-router-dom";
import UserBtn from "./UserBtn";
import "../styles/Header.css";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

export default function Header() {
  const { user } = useContext(UserContext);
  return (
    <header>
      <div className="headerlinks">
        <img />
        <h1>Talker logo</h1>
        <Link to="/">HOME</Link>
        <Link to="/talkingpoints">EXPLORE</Link>
      </div>
      <div>
        {user.length !== 0 && (
          <Link to="/createtalkingpoint">CREATE TALKING POINT</Link>
        )}
        <UserBtn />
      </div>
    </header>
  );
}
