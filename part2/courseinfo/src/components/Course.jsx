import Header from "./Header";
import Content from "./Content";
import Total from "./Total";

const Course = ({ courses }) => (
  <>
    {courses.map((course) => (
      <div key={course.id}>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    ))}
  </>
);

export default Course;
