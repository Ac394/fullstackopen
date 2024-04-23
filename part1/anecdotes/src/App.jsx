import { useState } from "react";

const Header = ({ text }) => <h1>{text}</h1>;

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const Anecdote = ({ anecdote, votes }) => (
  <>
    <p>{anecdote}</p>
    <p>has {votes} votes</p>
  </>
);

const BestAnecdote = ({ anecdotes, votes }) => {
  const highestVote = Math.max(...votes);
  const bestAnecdoteindex = votes.indexOf(highestVote);

  if (highestVote === 0) return <p>All anecdotes have 0 votes.</p>;

  return (
    <>
      <p>{anecdotes[bestAnecdoteindex]}</p>
      <p>has {votes[bestAnecdoteindex]} votes</p>
    </>
  );
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const getRandomNumber = () => Math.floor(Math.random() * anecdotes.length);
  const [selected, setSelected] = useState(getRandomNumber());
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const handleAnecdoteClick = () => setSelected(getRandomNumber());

  const handleVoteClick = () => {
    const votesCopy = [...votes];
    votesCopy[selected]++;
    setVotes(votesCopy);
  };

  return (
    <div>
      <Header text={"Anecdote of the day"} />
      <Anecdote anecdote={anecdotes[selected]} votes={votes[selected]} />
      <Button handleClick={handleVoteClick} text={"vote"} />
      <Button handleClick={handleAnecdoteClick} text={"next anecdote"} />
      <Header text={"Anecdote with most votes"} />
      <BestAnecdote anecdotes={anecdotes} votes={votes} />
    </div>
  );
};

export default App;
