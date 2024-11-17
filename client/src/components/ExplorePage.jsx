import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TopicsList from "./TopicsList";
import "../styles/ExplorePage.css";

export default function ExplorePage() {
  // useParams;
  const [page, setPage] = useState(0);
  const [links, setLinks] = useState([]);
  useEffect(() => {
    async function getTopicsCount() {
      const response = await fetch("http://localhost:8080/topiccount");
      const topicCount = await response.json();
      let currentlinks = [];
      for (let i = 0; i < topicCount[0].count / 10; i++) {
        currentlinks = [
          ...currentlinks,
          <a
            key={i}
            className="pageNav"
            onClick={() => {
              setPage(i);
              console.log(i);
            }}
          >
            {i + 1}
          </a>,
        ];
      }
      setLinks(currentlinks);
    }
    getTopicsCount();
  }, [setLinks]);

  const [topics, setTopics] = useState();
  return (
    <>
      <div className="tenTopics">
        <p>Talkingpoints:</p>
        <TopicsList number="10" offset={page * 10} />
      </div>
      <nav>{links}</nav>
    </>
  );
}
