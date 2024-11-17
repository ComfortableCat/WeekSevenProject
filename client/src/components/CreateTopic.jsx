import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import "../styles/CreateTopic.css";

export default function CreateTopic() {
  let { user } = useContext(UserContext);
  const [count, setCount] = useState("0");
  const [error, setError] = useState(0);
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    if (data.title !== "") {
      data.id = user.id;
      const response = await fetch(
        `https://weeksevenproject.onrender.com/topic`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const json = await response.json();
      console.log(json);
      if (json === "exists") {
        //ERROR EXISTS DONT USE THE SAME TALKING POINT YOUVE USED BEFORE
        setError("DONT USE THE SAME TALKING POINT YOUVE USED BEFORE");
        console.log("exists");
      } else if (typeof json[0].id === "number") {
        window.location.assign(
          `https://weeksevenproject-client.onrender.com/talkingpoints/${json[0].id}`
        );
      } else {
        console.log("escaped");
      }
    }
  }

  function handleChange(event) {
    setCount(event.currentTarget.value.length);
  }
  return (
    <>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <label>Talking point</label>
          {error !== 0 && <p>{error}</p>}
          <input type="text" name="title" />
          <label>Details</label>
          <textarea
            onChange={handleChange}
            type="text"
            name="content"
            maxLength="144"
          />
          <p>{count}/144</p>
          <button type="submit">SUBMIT</button>
        </form>
      </div>
    </>
  );
}
