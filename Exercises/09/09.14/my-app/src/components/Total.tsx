import { CourseParts as TotalProps } from "../types";

export const Total = (props: TotalProps): JSX.Element => {
  
  return (
    <p>
      Number of exercises{" "}
      {props.courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  );
};