import Primitive from "../components/reusable/Primitive.tsx";
import FirstStep from "../components/non-reusable/submit/FirstStep.tsx";
import SecondStep from "../components/non-reusable/submit/SecondStep.tsx";
import ThirdStep from "../components/non-reusable/submit/ThirdStep.tsx";
import FourthStep from "../components/non-reusable/submit/FourthStep.tsx";
import FifthStep from "../components/non-reusable/submit/FifthStep.tsx";
import { useState } from "react";

export interface FirstStepInputs {
  name: string;
  section: string;
  nrp: string;
  ext: string;
  email: string;
  fileResource: string;
  department: string;
  form: string;
}

export interface SecondStepInputs {
  formNumber: string;
  prNumber: string;
  subject: string;
  returnOnOutgoing: string;
}

export interface Usage {
  costCenter: string;
  budgetOrNature: string;
  periode: string;
  balance: string;
  description: string;
  quantity: string;
  unitPrice: string;
  measure: string;
  currency: string;
  vendor: string;
  reason: string;
  estimatedDeliveryDate: string;
}

export interface ThirdStepInputs {
  usages: Usage[];
}

export interface FourthStepInputs {
  approver: string[];
  releaser: string[];
  administrator: string[];
}

export interface FifthStepInputs {
  files: File[];
}

const PROGRESS_CONSTRAINT = {
  FIRST_STEP: [1],
  SECOND_STEP: [1, 2],
  THIRD_STEP: [1, 2, 3],
  FOURTH_STEP: [1, 2, 3, 4],
};

const evaluateConstraint = (totalProgress: number[], constraint: number[]) => {
  return constraint.every((step) => totalProgress.includes(step));
};

const DEFAULT_VALUES = {
  firstStep: {
    name: "",
    section: "",
    nrp: "",
    ext: "",
    email: "",
    fileResource: "",
    department: "",
    form: "",
  },
  secondStep: {
    formNumber: "123456789",
    prNumber: "1010101010101",
    subject: "",
    returnOnOutgoing: "",
  },
  thirdStep: {
    usages: [],
  },
  fourthStep: {
    approver: [],
    releaser: [],
    administrator: [],
  },
  fifthStep: {
    files: [],
  },
};

const Submit = () => {
  const [progress, setProgress] = useState<number[]>([]);

  const [firstStepInputs, setFirstStepInputs] = useState<FirstStepInputs>(
    DEFAULT_VALUES.firstStep,
  );

  const [secondStepInputs, setSecondStepInputs] = useState<SecondStepInputs>(
    DEFAULT_VALUES.secondStep,
  );

  const [thirdStepInputs, setThirdStepInputs] = useState<ThirdStepInputs>(
    DEFAULT_VALUES.thirdStep,
  );

  const [fourthStepInputs, setFourthStepInputs] = useState<FourthStepInputs>(
    DEFAULT_VALUES.fourthStep,
  );

  const [fifthStepInputs, setFifthStepInputs] = useState<FifthStepInputs>(
    DEFAULT_VALUES.fifthStep,
  );

  const allRequiredFieldsAreFilled = () => {
    const { ext, ...filteredFirstStep } = firstStepInputs;
    const { ext: _d1, ...defaultFirstStep } = DEFAULT_VALUES.firstStep;
    const { formNumber, prNumber, ...filteredSecondStep } = secondStepInputs;
    const {
      formNumber: _d2,
      prNumber: _d3,
      ...defaultSecondStep
    } = DEFAULT_VALUES.secondStep;

    console.log(`Ignoring fields : ${ext}, ${formNumber}, ${prNumber}}`);

    const currentValues = {
      firstStep: filteredFirstStep,
      secondStep: filteredSecondStep,
    };

    const comparisonDefaults = {
      firstStep: defaultFirstStep,
      secondStep: defaultSecondStep,
    };

    const someRequiredFieldsAreEmpty =
      currentValues.firstStep.name === comparisonDefaults.firstStep.name ||
      currentValues.firstStep.section ===
        comparisonDefaults.firstStep.section ||
      currentValues.firstStep.nrp === comparisonDefaults.firstStep.nrp ||
      currentValues.firstStep.email === comparisonDefaults.firstStep.email ||
      currentValues.firstStep.fileResource ===
        comparisonDefaults.firstStep.fileResource ||
      currentValues.firstStep.department ===
        comparisonDefaults.firstStep.department ||
      currentValues.firstStep.form === comparisonDefaults.firstStep.form ||
      currentValues.secondStep.subject ===
        comparisonDefaults.secondStep.subject ||
      currentValues.secondStep.returnOnOutgoing ===
        comparisonDefaults.secondStep.returnOnOutgoing ||
      thirdStepInputs.usages.length === 0 ||
      fourthStepInputs.approver.length === 0 ||
      fourthStepInputs.releaser.length === 0 ||
      fourthStepInputs.administrator.length === 0;

    return someRequiredFieldsAreEmpty;
  };

  return (
    <Primitive>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap gap-8">
          <FirstStep
            progressSetter={setProgress}
            firstStepInputsGetter={firstStepInputs}
            firstStepInputsInputsSetter={setFirstStepInputs}
            firstStepInputsDefaultValue={DEFAULT_VALUES.firstStep}
          />
          {evaluateConstraint(progress, PROGRESS_CONSTRAINT.FIRST_STEP) ? (
            <SecondStep
              progressSetter={setProgress}
              secondStepInputsGetter={secondStepInputs}
              secondStepInputsInputsSetter={setSecondStepInputs}
              secondStepInputsDefaultValue={DEFAULT_VALUES.secondStep}
            />
          ) : (
            ""
          )}
        </div>
        {evaluateConstraint(progress, PROGRESS_CONSTRAINT.SECOND_STEP) ? (
          <ThirdStep
            progressSetter={setProgress}
            thirdStepInputsGetter={thirdStepInputs}
            thirdStepInputsInputsSetter={setThirdStepInputs}
            thirdStepInputsDefaultValue={DEFAULT_VALUES.thirdStep}
          />
        ) : (
          ""
        )}
        <div className="flex flex-wrap gap-8">
          {evaluateConstraint(progress, PROGRESS_CONSTRAINT.THIRD_STEP) ? (
            <FourthStep
              progressSetter={setProgress}
              fourthStepInputsGetter={fourthStepInputs}
              fourthStepInputsSetter={setFourthStepInputs}
              fourthStepInputsDefaultValue={DEFAULT_VALUES.fourthStep}
            />
          ) : (
            ""
          )}
          {evaluateConstraint(progress, PROGRESS_CONSTRAINT.FOURTH_STEP) ? (
            <FifthStep
              fifthStepInputsGetter={fifthStepInputs}
              fifthStepInputsSetter={setFifthStepInputs}
              fifthStepInputsDefaultValue={DEFAULT_VALUES.fifthStep}
              evaluateSubmission={allRequiredFieldsAreFilled}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </Primitive>
  );
};

export default Submit;
