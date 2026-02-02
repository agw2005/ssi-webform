import SubmitUserInfo from "../SubmitUserInfo";
import SubmitWorkInfo from "../SubmitWorkInfo";
import SubmitFormType from "../SubmitFormType";
import SubmitActions from "../SubmitActions";

const Form1Form = () => {
  return (
    <form className="space-y-6">
      <SubmitUserInfo />
      <SubmitWorkInfo />
      <SubmitFormType />
      <SubmitActions />
    </form>
  );
};

export default Form1Form;
