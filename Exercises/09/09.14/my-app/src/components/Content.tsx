import { CourseParts as ContentProps } from "../types";

export const Content = (props: ContentProps) => {
  console.log(props)
  return (
    <div>
      {props.courseParts.map(part => <p key={part.name}>{part.name} {part.exerciseCount}</p>)}
    </div>
  );
};