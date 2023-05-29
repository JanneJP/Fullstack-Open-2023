import { CoursePart } from "../types";

interface TotalProps {
  courseParts: CoursePart[]
}
export const Total = (props: TotalProps): JSX.Element => {
  
  return (
    <p>
      Number of exercises{" "}
      {props.courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  );
};