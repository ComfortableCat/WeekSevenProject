import TopicsList from "./TopicsList";
import "../styles/Home.css";

export default function Home() {
  return (
    <>
      <div className="welcomeContainer">
        <h1>Welcome to Talker</h1>
        <h3>Where talking is free and plentiful</h3>
        <h5>up to 144 characters</h5>
        <h4>
          click one of the topics below to get started or browse the topics page
        </h4>
      </div>
      <div className="fiveTopics">
        <p>Five interesting talkingpoints:</p>
        <TopicsList number={5} byPopular={true} offset={0} />
      </div>
    </>
  );
}
