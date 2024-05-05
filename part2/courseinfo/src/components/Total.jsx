const Total = ({ parts }) => {
  const sum = parts.reduce((sum, part) => sum + part.exercises, 0);
  return <p>Number of exercises {sum}</p>;
};

export default Total;
