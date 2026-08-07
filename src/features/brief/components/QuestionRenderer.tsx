import type { FieldProps } from "./field-contract";
import { EmailField, LongTextField, ShortTextField } from "./fields/TextFields";
import { MultiChoiceField, RatingScaleField, SingleChoiceField } from "./fields/ChoiceFields";
import { PriorityMatrixField } from "./fields/PriorityMatrixField";
import { AccessChecklistField } from "./fields/AccessChecklistField";
import { RepeaterField } from "./fields/RepeaterField";

/**
 * Único punto del proyecto donde se decide qué componente dibuja qué tipo.
 * El `switch` es exhaustivo por construcción: si se añade un tipo a
 * types.ts y no se registra aquí, TypeScript falla en el `never` final.
 */
export function QuestionRenderer(props: FieldProps) {
  const { question } = props;
  switch (question.type) {
    case "shortText":
      return <ShortTextField {...props} question={question} />;
    case "longText":
      return <LongTextField {...props} question={question} />;
    case "email":
      return <EmailField {...props} question={question} />;
    case "singleChoice":
      return <SingleChoiceField {...props} question={question} />;
    case "multiChoice":
      return <MultiChoiceField {...props} question={question} />;
    case "ratingScale":
      return <RatingScaleField {...props} question={question} />;
    case "priorityMatrix":
      return <PriorityMatrixField {...props} question={question} />;
    case "accessChecklist":
      return <AccessChecklistField {...props} question={question} />;
    case "repeater":
      return <RepeaterField {...props} question={question} />;
    default: {
      const unreachable: never = question;
      throw new Error(`Tipo de pregunta sin componente: ${JSON.stringify(unreachable)}`);
    }
  }
}
