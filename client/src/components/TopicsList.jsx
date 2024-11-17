import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TopicsList({ number, asc, byPopular, offset }) {
  const [topics, setTopics] = useState([]);
  if (asc !== true) {
    asc = false;
  }
  if (byPopular !== true) {
    byPopular = false;
  }
  useEffect(() => {
    async function getTopics() {
      const response = await fetch(
        `http://localhost:8080/topicslist?number=${number}&asc=${asc}&pop=${byPopular}&offset=${offset}`
      );

      setTopics(await response.json());
    }
    getTopics();
  }, [offset]);
  return (
    <>
      {topics.length !== 0 &&
        topics.map((topic, i) => (
          <Link key={i} to={`/talkingpoints/${topic.id}`}>
            {topic.title}
          </Link>
        ))}
    </>
  );
}
