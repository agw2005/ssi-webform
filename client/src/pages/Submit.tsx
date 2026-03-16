import Primitive from "../components/reusable/Primitive.tsx";
import FirstStep from "../components/non-reusable/submit/FirstStep.tsx";
import SecondStep from "../components/non-reusable/submit/SecondStep.tsx";
import ThirdStep from "../components/non-reusable/submit/ThirdStep.tsx";
import FourthStep from "../components/non-reusable/submit/FourthStep.tsx";
import FifthStep from "../components/non-reusable/submit/FifthStep.tsx";
import { useState } from "react";
import {
  type Balance,
  type Department,
  type FileResource,
  type Nature,
  type SectionName,
  type UserSection,
  type SubmitPayload,
  type FirstStepInputs,
  type SecondStepInputs,
  type ThirdStepInputs,
  type FourthStepInputs,
  type FifthStepInputs,
  submitRequest,
  type SubmitResponse,
} from "@scope/server";
import useFetch from "../hooks/useFetch.tsx";
import useForex from "../hooks/useForex.tsx";
import serverDomain from "../helper/serverDomain.ts";
import { useNavigate } from "react-router-dom";

const SECTION_NAMES_URL = `${serverDomain}/section/names`;
const FILE_RESOURCES_URL = `${serverDomain}/budget/fileresources`;
const DEPARTMENTS_URL = `${serverDomain}/frmprnopr/departments`;
const NATURES_URL = `${serverDomain}/budget/nature`;
const BALANCE_URL = (costCenter: string, period: string, nature: string) =>
  `${serverDomain}/budget/nature/${costCenter}/${period}/${nature}`;
const USER_SECTION_MAPPINGS_URL = `${serverDomain}/section/users`;
const SUBMIT_URL = `${serverDomain}/submit`;

const PROGRESS_CONSTRAINT = {
  FIRST_STEP: [1],
  SECOND_STEP: [1, 2],
  THIRD_STEP: [1, 2, 3],
  FOURTH_STEP: [1, 2, 3, 4],
};

const evaluateConstraint = (totalProgress: number[], constraint: number[]) => {
  return constraint.every((step) => totalProgress.includes(step));
};

const DEFAULT_VALUES: SubmitPayload = {
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
    formNumber: "0",
    prNumber: "0",
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
  const navigate = useNavigate();
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

  const [activeCostCenter, setActiveCostCenter] = useState<string>("");
  const [_isBalanceLoading, setIsBalanceLoading] = useState<boolean>(false);
  const [balanceError, setBalanceError] = useState<Error | null>(null);
  const [requestIsProcessing, setRequestIsProcessing] = useState(false);
  const [requestIsError, setRequestIsError] = useState<Error | null>(null);

  const {
    data: sectionNames,
    isLoading: isSectionLoading,
    isError: isSectionError,
  } = useFetch<SectionName>(SECTION_NAMES_URL);

  const {
    data: fileResources,
    isLoading: isFileResourcesLoading,
    isError: isFileResourcesError,
  } = useFetch<FileResource>(FILE_RESOURCES_URL);

  const {
    data: departments,
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  } = useFetch<Department>(DEPARTMENTS_URL);

  const {
    data: natures,
    isLoading: _isNaturesLoading,
    isError: isNaturesError,
  } = useFetch<Nature>(`${NATURES_URL}/${activeCostCenter || "103"}`);

  const {
    data: userSectionMappings,
    isLoading: isUserSectionMappingsLoading,
    isError: isUserSectionMappingsError,
  } = useFetch<UserSection>(USER_SECTION_MAPPINGS_URL);

  const {
    forexInformation,
    isLoading: _forexIsLoading,
    error: _forexIsError,
  } = useForex();

  const fetchBalanceHelper = async (
    costCenter: string,
    period: string,
    nature: string,
  ) => {
    setIsBalanceLoading(true);
    setBalanceError(null);
    try {
      const balanceResponse = await fetch(
        BALANCE_URL(costCenter, period, nature),
      );
      if (!balanceResponse.ok)
        throw new Error(`HTTP error! status: ${balanceResponse.status}`);
      const balance: Balance[] = await balanceResponse.json();
      return balance;
    } catch (err) {
      setBalanceError(
        err instanceof Error ? err : new Error("Failed to fetch balance."),
      );
      return null;
    } finally {
      setIsBalanceLoading(false);
    }
  };

  const allRequiredFieldsAreFilled = () => {
    const {
      formNumber: _formNumber,
      prNumber: _prNumber,
      ...filteredSecondStep
    } = secondStepInputs;
    const {
      formNumber: __formNumber,
      prNumber: __prNumber,
      ...defaultSecondStep
    } = DEFAULT_VALUES.secondStep;

    const currentValues = {
      firstStep: firstStepInputs,
      secondStep: filteredSecondStep,
    };

    const comparisonDefaults = {
      firstStep: DEFAULT_VALUES.firstStep,
      secondStep: defaultSecondStep,
    };

    const someRequiredFieldsAreEmpty =
      currentValues.firstStep.name === comparisonDefaults.firstStep.name ||
      currentValues.firstStep.section ===
        comparisonDefaults.firstStep.section ||
      currentValues.firstStep.nrp === comparisonDefaults.firstStep.nrp ||
      currentValues.firstStep.ext === comparisonDefaults.firstStep.ext ||
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

  const handleSubmit = async () => {
    setRequestIsProcessing(true);
    const payload: SubmitPayload = {
      firstStep: firstStepInputs,
      secondStep: secondStepInputs,
      thirdStep: thirdStepInputs,
      fourthStep: fourthStepInputs,
      fifthStep: fifthStepInputs,
    };
    try {
      const submitResponse = await fetch(SUBMIT_URL, submitRequest(payload));
      const submitResponseBody: SubmitResponse = await submitResponse.json();
      if (submitResponse.ok) {
        globalThis.alert(
          `${submitResponseBody.message}\n
          No. Form : ${submitResponseBody.noForm}\n
          No. PR : ${submitResponseBody.noPR}\n
          ID Trace : ${submitResponseBody.traceId}`,
        );
        // console.log(submitResponseBody);
        navigate(`/request/${submitResponseBody.traceId}`);
      } else {
        globalThis.alert(
          `Protocol Failure: Your request reeached the server, but the content of your submission was rejected!\n
          Err ${submitResponse.status} : ${submitResponseBody.message}`,
        );
      }
    } catch (err) {
      const error: Error = new Error(
        `Transport Failure: Your request did not reached the server. Please contact the administrator of this problem.\n(${err}).`,
      );
      setRequestIsError(error);
    } finally {
      setRequestIsProcessing(false);
    }
  };

  return (
    <Primitive
      isLoading={[
        isSectionLoading,
        isFileResourcesLoading,
        isDepartmentsLoading,
        isUserSectionMappingsLoading,
        requestIsProcessing,
      ]}
      isErr={[
        isSectionError,
        isFileResourcesError,
        isDepartmentsError,
        isNaturesError,
        balanceError,
        isUserSectionMappingsError,
        requestIsError,
      ]}
      componentName="Submit.tsx"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap gap-8">
          <FirstStep
            progressSetter={setProgress}
            firstStepInputsGetter={firstStepInputs}
            firstStepInputsInputsSetter={setFirstStepInputs}
            firstStepInputsDefaultValue={DEFAULT_VALUES.firstStep}
            sectionNames={sectionNames}
            fileResources={fileResources}
            departments={departments}
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
            forexInformation={forexInformation}
            departments={departments}
            natures={natures}
            setActiveCostCenter={setActiveCostCenter}
            fetchBalanceHelper={fetchBalanceHelper}
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
              userSectionMappings={userSectionMappings}
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
              handleSubmit={handleSubmit}
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
