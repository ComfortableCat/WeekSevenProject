import { useContext, useEffect, useState } from "react";
import Replies from "./Replies";
import { useParams } from "react-router-dom";
import "../styles/TopicPage.css";
import CommentForm from "./CommentForm";
import { UserContext } from "../context/UserContext";

export default function TopicPage() {
  const { user } = useContext(UserContext);
  let { id } = useParams();
  const [comments, setComments] = useState("");
  const [topic, setTopic] = useState({});
  const [showSubComments, setShowSubComments] = useState(false);

  useEffect(() => {
    async function getTopic() {
      const response = await fetch(`http://localhost:8080/topic?id=${id}`);
      const topicResponse = await response.json();
      setTopic(topicResponse[0]);
    }
    getTopic();
  }, []);

  useEffect(() => {
    async function getComments() {
      const response = await fetch(
        `http://localhost:8080/replies?topicId=${id}`
      );
      const replies = await response.json();

      const placeholder = replies.map((reply) => {
        console.log(reply.subreplies);
        const subreplies = reply.subreplies;

        if (subreplies !== null) {
          for (let i = 0; i < subreplies.length; i++) {
            subreplies[i].username = reply.subusers[i];
          }
          return (
            <div className="replyContainer" key={reply.id}>
              <Replies
                username={reply.username}
                content={reply.content}
                parentId={reply.id}
                topicId={id}
              />
              <div className="subreply">
                {subreplies.map((subreply) => (
                  <Replies
                    username={subreply.username}
                    content={subreply.content}
                    parentId={subreply.id}
                    topicId={id}
                    key={subreply.id}
                  />
                ))}
              </div>
            </div>
          );
        } else {
          return (
            <div className="replyContainer" key={reply.id}>
              <Replies
                username={reply.username}
                content={reply.content}
                parentId={reply.id}
                topicId={id}
              />
            </div>
          );
        }
      });
      setComments(placeholder);
    }
    getComments();
  }, []);

  return (
    <>
      <div className="topic">
        <h2>{topic.title}</h2>
        <h4>{topic.content}</h4>
        <p>{topic.username}</p>
      </div>
      <div className="comments">{comments}</div>
      {user.length !== 0 && <CommentForm topicId={id} />}
    </>
  );
}
