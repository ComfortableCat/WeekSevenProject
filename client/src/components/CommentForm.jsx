import { UserContext } from "../context/UserContext";
import { useContext } from "react";

export default function CommentForm({ parentId, topicId }) {
  const { user } = useContext(UserContext);
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    if (data.content !== "") {
      data.parentId = parentId;
      data.topicId = topicId;
      data.userId = user.id;

      const response = await fetch("http://localhost:8080/replies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      window.location.reload();
    } else {
      //SHOW ERROR OR SOMETHING
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea name="content" placeholder="Reply..." maxLength={144} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
