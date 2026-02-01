import Primitive from "../components/Primitive";
import SubmitContainer from "../components/submit/SubmitContainer";
import SubmitHeader from "../components/submit/SubmitHeader";
import SubmitAttention from "../components/submit/SubmitAttention";
import SubmitForm from "../components/submit/SubmitForm";

const Submit = () => {
  return (
    <Primitive>
      <SubmitContainer>
        <SubmitHeader />
        <SubmitAttention />
        <SubmitForm />
      </SubmitContainer>
    </Primitive>
  );
};

export default Submit;
