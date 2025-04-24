import { isConstructorDeclaration } from "typescript";

type LocalProps = {
  value: Date | undefined;
  dayOfWeek: boolean;
};

const DateFormater = (props: LocalProps) => {
  if (props.value) {
    const dateFormat = "uk-UA";
    const date = new Date(props.value);
    const dateOptions: any = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" };
    if (props.dayOfWeek) dateOptions.weekday = "long";
    const dateSting = date.toLocaleDateString(dateFormat, dateOptions);

    return <>{dateSting}</>;
  } else return <></>;
};

export default DateFormater;