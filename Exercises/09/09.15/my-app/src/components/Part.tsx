import { CoursePart } from "../types";

interface PartProps {
  part: CoursePart
}

export const Part = (props: PartProps) => {
  switch (props.part.kind) {
    case "basic":
      return (
        <div>
          <h2>{props.part.name} {props.part.exerciseCount}</h2>
          <p><i>{props.part.description}</i></p>
        </div>
      )
    case "group":
      return (
        <div>
          <h2>{props.part.name} {props.part.exerciseCount}</h2>
          <p>Project Exercises {props.part.groupProjectCount}</p>
        </div>
      )
    case "background":
      return (
        <div>
          <h2>{props.part.name} {props.part.exerciseCount}</h2>
          <p><i>{props.part.description}</i></p>
          <p>Background material: {props.part.backgroundMaterial}</p>
        </div>
      )
    case "special":
      return (
        <div>
          <h2>{props.part.name} {props.part.exerciseCount}</h2>
          <p><i>{props.part.description}</i></p>
          <p>Required skills: {props.part.requirements.join(', ')}</p>
        </div>
      )
  }
};