import { useState, useContext } from "react";
import CommentForm from "./CommentForm";
import { UserContext } from "../context/UserContext";

export default function Replies({ username, content, parentId, topicId }) {
  const [show, setShow] = useState(false);
  const { user } = useContext(UserContext);
  function handleClick() {
    setShow(!show);
  }
  return (
    <div className="reply" id={parentId}>
      <p>{username}</p>
      <p>{content}</p>
      {user.length !== 0 && (
        <>
          {show === false ? (
            <button id={"button" + parentId} onClick={handleClick}>
              reply
            </button>
          ) : (
            <CommentForm parentId={parentId} topicId={topicId} />
          )}
        </>
      )}
    </div>
  );
}
