import Primitive from "../components/reusable/Primitive.tsx";
import FirstStep from "../components/non-reusable/submit/FirstStep.tsx";
import SecondStep from "../components/non-reusable/submit/SecondStep.tsx";
import ThirdStep from "../components/non-reusable/submit/ThirdStep.tsx";
import FourthStep from "../components/non-reusable/submit/FourthStep.tsx";
import FifthStep from "../components/non-reusable/submit/FifthStep.tsx";
import { useRef, useState } from "react";
import {
  type Balance,
  type FifthStepInputs,
  type FileResource,
  type FirstStepInputs,
  type FourthStepInputs,
  type Nature,
  type SecondStepInputs,
  type SectionName,
  type SubmitPayload,
  submitRequest,
  type SubmitResponse,
  type ThirdStepInputs,
  type UserSection,
  type ValidCostCenter,
  type ValidDepartment,
} from "@scope/server-ssms";
import useFetch from "../hooks/useFetch.tsx";
import useForex from "../hooks/useForex.tsx";
import { useNavigate } from "react-router-dom";
import Dialog, { toggleDialog } from "../components/reusable/Dialog.tsx";
import Button from "../components/reusable/Button.tsx";
import { webformAPI } from "../helper/apis.ts";

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
    formNumber: "",
    prNumber: "",
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

  const [generalModalContent, setGeneralModalContent] = useState<
    React.ReactNode
  >();

  const {
    data: sectionNames,
    isLoading: isSectionLoading,
    isError: isSectionError,
  } = useFetch<SectionName>(webformAPI.SectionNames);

  const {
    data: fileResources,
    isLoading: isFileResourcesLoading,
    isError: isFileResourcesError,
  } = useFetch<FileResource>(webformAPI.FileResources);

  const {
    data: departments,
    isLoading: isDepartmentsLoading,
    isError: isDepartmentsError,
  } = useFetch<ValidDepartment>(
    webformAPI.Departments(firstStepInputs.fileResource),
  );

  const {
    data: costCenters,
    isLoading: isCostCentersLoading,
    isError: isCostCentersError,
  } = useFetch<ValidCostCenter>(
    webformAPI.CostCenters(
      firstStepInputs.fileResource,
      firstStepInputs.department === DEFAULT_VALUES.firstStep.department
        ? null
        : Number(firstStepInputs.department),
    ),
  );

  const {
    data: natures,
    isLoading: _isNaturesLoading,
    isError: isNaturesError,
  } = useFetch<Nature>(webformAPI.Natures(
    firstStepInputs.fileResource,
    firstStepInputs.department === DEFAULT_VALUES.firstStep.department
      ? null
      : Number(firstStepInputs.department),
    activeCostCenter,
  ));

  const {
    data: userSectionMappings,
    isLoading: isUserSectionMappingsLoading,
    isError: isUserSectionMappingsError,
  } = useFetch<UserSection>(webformAPI.SectionUserMappings);

  const {
    forexInformation,
    isLoading: _forexIsLoading,
    error: _forexIsError,
  } = useForex("Db");

  const generalModal = useRef<HTMLDialogElement>(null);

  const toggleGeneralModal = (
    dialogTitle: string,
    dialogSubtitle: string,
    dialogId: string,
    option: "Submit" | "Submit-success" | "Non-submit" = "Non-submit",
    submitSuccessData: [string, string, string] = ["", "", ""],
  ) => {
    const generalModalContent = (
      <div className="m-4 flex flex-col gap-8 items-end">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">{dialogTitle}!</h2>
          <p>{dialogSubtitle}.</p>
        </div>
        <div className="flex gap-2">
          <div onClick={() => toggleDialog(generalModal)}>
            <Button id={dialogId} label="OK" variant="black" />
          </div>
        </div>
      </div>
    );
    const submitModalContent = (
      <div className="m-4 flex flex-col gap-8 items-end">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">
            Are you sure you want to submit?
          </h2>
        </div>
        <div className="flex gap-2">
          <div onClick={() => toggleDialog(generalModal)}>
            <Button id="submit-no" label="No" variant="red" />
          </div>
          <div
            onClick={async () => {
              toggleDialog(generalModal);
              await handleSubmit();
            }}
          >
            <Button id="submit-yes" label="Yes" variant="green" />
          </div>
        </div>
      </div>
    );
    const submitSuccessModalContent = (
      <div className="m-4 flex flex-col gap-8 items-end">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">
            Successfully created the purchasing request!
          </h2>
          <ul>
            <li>
              <strong>No. Form</strong> : {submitSuccessData[0]}
            </li>
            <li>
              <strong>No. PR</strong> : {submitSuccessData[1]}
            </li>
            <li>
              <strong>ID Trace</strong> : {submitSuccessData[2]}
            </li>
          </ul>
        </div>
        <div className="flex gap-2">
          <div
            onClick={() => {
              toggleDialog(generalModal);
              navigate(`/request/${submitSuccessData[2]}`);
            }}
          >
            <Button id="submit-success-ok" label="OK" variant="black" />
          </div>
        </div>
      </div>
    );
    toggleDialog(generalModal);
    setGeneralModalContent(
      option === "Non-submit"
        ? generalModalContent
        : option === "Submit"
        ? submitModalContent
        : submitSuccessModalContent,
    );
  };

  const fetchBalanceHelper = async (
    costCenter: string,
    period: string,
    nature: string,
    fileResource: string,
    deptId: number,
  ) => {
    setIsBalanceLoading(true);
    setBalanceError(null);
    try {
      const balanceResponse = await fetch(
        webformAPI.Balance(fileResource, deptId, costCenter, nature, period),
      );
      if (!balanceResponse.ok) {
        throw new Error(`HTTP error! status: ${balanceResponse.status}`);
      }
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
      console.log(payload);
      const submitResponse = await fetch(
        webformAPI.SubmitRequest,
        submitRequest(payload),
      );
      const submitResponseBody: SubmitResponse = await submitResponse.json();
      if (submitResponse.ok) {
        setProgress([]);
        setFirstStepInputs(DEFAULT_VALUES.firstStep);
        setSecondStepInputs(DEFAULT_VALUES.secondStep);
        setThirdStepInputs(DEFAULT_VALUES.thirdStep);
        setFourthStepInputs(DEFAULT_VALUES.fourthStep);
        setFifthStepInputs(DEFAULT_VALUES.fifthStep);

        setTimeout(() => {
          toggleGeneralModal("", "", "", "Submit-success", [
            submitResponseBody.noForm,
            submitResponseBody.noPR,
            submitResponseBody.traceId,
          ]);
        }, 250);
      } else {
        globalThis.alert(
          `Protocol Failure: Your request reached the server, but the content of your submission was rejected!\n
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
        isCostCentersLoading,
      ]}
      isErr={[
        isSectionError,
        isFileResourcesError,
        isDepartmentsError,
        isNaturesError,
        balanceError,
        isUserSectionMappingsError,
        requestIsError,
        isCostCentersError,
      ]}
      componentName="Submit.tsx"
      pageTitle="Submit PR"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap gap-8">
          <FirstStep
            alertUnfilledForm={() =>
              toggleGeneralModal(
                "One or more required fields are empty",
                "Please fill them out before proceeding",
                "unfilled-forms-detected",
              )}
            progressSetter={setProgress}
            firstStepInputsGetter={firstStepInputs}
            firstStepInputsInputsSetter={setFirstStepInputs}
            firstStepInputsDefaultValue={DEFAULT_VALUES.firstStep}
            sectionNames={sectionNames}
            fileResources={fileResources}
            departments={departments}
          />
          {evaluateConstraint(progress, PROGRESS_CONSTRAINT.FIRST_STEP)
            ? (
              <SecondStep
                alertUnfilledForm={() =>
                  toggleGeneralModal(
                    "One or more required fields are empty",
                    "Please fill them out before proceeding",
                    "unfilled-forms-detected",
                  )}
                progressSetter={setProgress}
                secondStepInputsGetter={secondStepInputs}
                secondStepInputsInputsSetter={setSecondStepInputs}
                secondStepInputsDefaultValue={DEFAULT_VALUES.secondStep}
              />
            )
            : (
              ""
            )}
        </div>
        {evaluateConstraint(progress, PROGRESS_CONSTRAINT.SECOND_STEP)
          ? (
            <ThirdStep
              alertUnfilledForm={() =>
                toggleGeneralModal(
                  "One or more required fields are empty",
                  "Please fill them out before proceeding",
                  "unfilled-forms-detected",
                )}
              alertNoBudget={() =>
                toggleGeneralModal(
                  "There is no budget for this nature",
                  "Please select a different nature",
                  "no-budget-detected",
                )}
              alertNoUsage={() =>
                toggleGeneralModal(
                  "No usage detected",
                  "You need to enter at least 1 usage before proceeding",
                  "no-usage-detected",
                )}
              progressSetter={setProgress}
              thirdStepInputsGetter={thirdStepInputs}
              thirdStepInputsInputsSetter={setThirdStepInputs}
              thirdStepInputsDefaultValue={DEFAULT_VALUES.thirdStep}
              forexInformation={forexInformation}
              costCenters={costCenters}
              natures={natures}
              setActiveCostCenter={setActiveCostCenter}
              fetchBalanceHelper={fetchBalanceHelper}
              submitterDepartmentName={firstStepInputs.fileResource}
              submitterDepartmentId={firstStepInputs.department}
            />
          )
          : (
            ""
          )}
        <div className="flex flex-wrap gap-8">
          {evaluateConstraint(progress, PROGRESS_CONSTRAINT.THIRD_STEP)
            ? (
              <FourthStep
                alertUnfilledForm={() =>
                  toggleGeneralModal(
                    "One or more required fields are empty",
                    "Please fill them out before proceeding",
                    "unfilled-forms-detected",
                  )}
                progressSetter={setProgress}
                fourthStepInputsGetter={fourthStepInputs}
                fourthStepInputsSetter={setFourthStepInputs}
                fourthStepInputsDefaultValue={DEFAULT_VALUES.fourthStep}
                userSectionMappings={userSectionMappings}
              />
            )
            : (
              ""
            )}
          {evaluateConstraint(progress, PROGRESS_CONSTRAINT.FOURTH_STEP)
            ? (
              <FifthStep
                alertUnfilledForm={() =>
                  toggleGeneralModal(
                    "One or more fields from across the steps may be empty",
                    "You need to fill them out before you can submit your PR",
                    "unfilled-forms-detected",
                  )}
                submissionConfirmation={() =>
                  toggleGeneralModal("", "", "", "Submit")}
                fifthStepInputsGetter={fifthStepInputs}
                fifthStepInputsSetter={setFifthStepInputs}
                fifthStepInputsDefaultValue={DEFAULT_VALUES.fifthStep}
                evaluateSubmission={allRequiredFieldsAreFilled}
              />
            )
            : (
              ""
            )}
        </div>
      </div>

      {
        /**
         * NOTE !
         * Multiple dialog elements did not work as expected.
         * Use dynamic rendering instead.
         */
      }
      <Dialog
        toggle={() => toggleDialog(generalModal)}
        ref={generalModal}
        position="-top-144"
      >
        {generalModalContent}
      </Dialog>
    </Primitive>
  );
};

export default Submit;
