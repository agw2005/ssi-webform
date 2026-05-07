import { Link } from "react-router-dom";
import LoadingFallback from "../components/reusable/LoadingFallback.tsx";
import Primitive from "../components/reusable/Primitive.tsx";
import useAuth from "../hooks/useAuth.tsx";
import type { TraceApproveRequests, TraceRequestsCount } from "@scope/server";
import { useReducer, useRef, useState } from "react";
import stringContainsRedLight from "../helper/stringContainsRedLight.ts";
import formatNumberToString from "../helper/formatNumberToString.ts";
import capitalize from "../helper/capitalize.ts";
import { formatDate } from "../helper/formatDate.ts";
import { resultStyling } from "../helper/resultStyling.ts";
import Button from "../components/reusable/Button.tsx";
import TextInput from "../components/reusable/inputs/TextInput.tsx";
import PagingButton from "../components/reusable/PagingButton.tsx";
import NumberInput from "../components/reusable/inputs/NumberInput.tsx";
import DateRangeInput from "../components/reusable/inputs/DateRangeInput.tsx";
import SelectionInput from "../components/reusable/inputs/SelectionInput.tsx";
import { useDebounce } from "../hooks/useDebounce.tsx";
import usePurchasingRequests from "../hooks/usePurchasingRequests.tsx";
import { APIs } from "../helper/apis.ts";
import Dialog, { toggleDialog } from "../components/reusable/Dialog.tsx";

const COLUMNS = [
  "ID Trace",
  "Subject",
  "Amount",
  "Requestor",
  "Type",
  "Step",
  "Status",
  "Submit Date",
  "Remarks",
  "File",
];

const RESULTS = ["All Results", "Approved", "In Progress", "Rejected"];

interface Filters {
  status: string;
  pagingRange: number;
  startingDate: string;
  endingDate: string;
  search: string;
  currentPage: number;
}

type FilterAction =
  | { type: "SET_FIELD"; field: keyof Filters; value: unknown }
  | { type: "RESET_FILTERS" }
  | { type: "SET_PAGE"; page: number };

const DEFAULT_FILTERS: Filters = {
  status: "",
  pagingRange: 20,
  startingDate: "",
  endingDate: "",
  search: "",
  currentPage: 1,
};

const SupervisorType = (type: "A" | "R" | "ADM") => {
  switch (type) {
    case "A":
      return "Approver";
    case "R":
      return "Releaser";
    case "ADM":
      return "Administrator";
    default:
      return "";
  }
};

const FilterReducer = (state: Filters, action: FilterAction) => {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
        currentPage: 1,
      };
    case "SET_PAGE":
      return { ...state, currentPage: action.page };
    case "RESET_FILTERS":
      return DEFAULT_FILTERS;
    default:
      return state;
  }
};

const Approve = () => {
  const uploadFileReference = useRef<HTMLDialogElement>(null);
  const [idTraceUploadDest, setIdTraceUploadDest] = useState<number | null>(
    null,
  );
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [bigFileWarning, setBigFileWarning] = useState<boolean>(false);
  const [uploadIsLoading, setUploadIsLoading] = useState<boolean>(false);

  const { authInfo, authIsLoading } = useAuth();

  const [filters, setFilters] = useReducer(FilterReducer, DEFAULT_FILTERS);

  const debouncedSearch = useDebounce(filters.search, 750);

  const params = new URLSearchParams();
  if (filters.status !== "All Results" && filters.status !== "") {
    params.set("status", filters.status);
  }
  if (filters.startingDate) params.set("startdate", filters.startingDate);
  if (filters.endingDate) params.set("enddate", filters.endingDate);
  if (authInfo) params.set("nrp", authInfo.nrp);
  if (debouncedSearch) params.set("search", debouncedSearch);
  params.set("page", String(filters.currentPage));
  params.set("pagination", String(filters.pagingRange));

  const {
    requestIsLoading,
    requestIsError,
    totalRequestsAtDatabase,
    requests,
  } = usePurchasingRequests<TraceApproveRequests, TraceRequestsCount>(
    APIs.ApproversRequest,
    APIs.ApproversRequestCount,
    params.toString(),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(totalRequestsAtDatabase / filters.pagingRange),
  );

  return (
    <Primitive
      isLoading={[authIsLoading]}
      isErr={[requestIsError]}
      componentName="Approve.tsx"
      pageTitle="Approval Menu"
    >
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 flex-wrap">
          <SelectionInput
            label="Status"
            name="filter-status"
            id="filter-status"
            variant="black"
            requiredInput={false}
            defaultDisabledValue="All Results"
            options={RESULTS}
            value={filters.status}
            onChangeHandler={(e) => {
              const newResult = e.target.value;
              setFilters({
                type: "SET_FIELD",
                field: "status",
                value: newResult,
              });
            }}
          />
          <DateRangeInput
            name="filter-date-range"
            id="filter-date-range"
            variant="black"
            firstDateRequiredInput={false}
            secondDateRequiredInput={false}
            startingDateValue={filters.startingDate}
            endingDateValue={filters.endingDate}
            startingDateOnChangeHandler={(e) => {
              setFilters({
                type: "SET_FIELD",
                field: "startingDate",
                value: e.target.value,
              });
            }}
            endingOnDateChangeHandler={(e) => {
              setFilters({
                type: "SET_FIELD",
                field: "endingDate",
                value: e.target.value,
              });
            }}
          />
          <div className="flex w-32">
            <NumberInput
              label="Items"
              name="paging-range"
              id="paging-range"
              requiredInput={false}
              variant="black"
              minimumValue={1}
              value={String(filters.pagingRange)}
              onChangeHandler={(e) => {
                setFilters({
                  type: "SET_FIELD",
                  field: "pagingRange",
                  value: Number(e.target.value),
                });
              }}
            />
          </div>
          <PagingButton
            name="paging-button"
            id="paging-button"
            variant="black"
            currentPage={filters.currentPage}
            totalPages={totalPages}
            onInputChangeHandler={(e) =>
              setFilters({ type: "SET_PAGE", page: Number(e.target.value) })}
          />
          <TextInput
            label="Search"
            name="search"
            id="search"
            variant="black"
            requiredInput={false}
            value={filters.search}
            onChangeHandler={(e) => {
              setFilters({
                type: "SET_FIELD",
                field: "search",
                value: e.target.value,
              });
            }}
          />
          <div
            onClick={() => {
              setFilters({ type: "RESET_FILTERS" });
            }}
          >
            <Button id="reset-filters" variant="black" label="Reset" />
          </div>
        </div>
        {requestIsLoading
          ? <LoadingFallback />
          : requests && requests.length === 0
          ? (
            <div className="font-bold text-2xl">
              There is no requests with You as the supervisor.
            </div>
          )
          : (
            <table className="table-auto border-collapse min-w-full max-w-full">
              <thead>
                <tr>
                  {COLUMNS.map((column, index) => {
                    return (
                      <th
                        key={index}
                        className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border p-2 bg-blue-800 text-white border-black"
                      >
                        {column}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {requests &&
                  requests.map((request, index) => {
                    return (
                      <tr key={index}>
                        <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap text-center border break-all p-2">
                          {request.IDTrace}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | border break-all p-2">
                          <Link
                            className="text-blue-700 underline"
                            to={`/request/${request.IDTrace}`}
                          >
                            {request.Subject}
                          </Link>{" "}
                          {stringContainsRedLight(String(request.Subject)) ||
                              stringContainsRedLight(String(request.Remarks))
                            ? (
                              <span className="text-red-500 font-bold drop-shadow">
                                Red Light
                              </span>
                            )
                            : (
                              ""
                            )}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border break-all p-2">
                          {formatNumberToString(request.Amount)}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border break-all p-2">
                          {capitalize(request.Requestor)}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border text-center break-all p-2">
                          {SupervisorType(
                            request.SupervisorType as "A" | "R" | "ADM",
                          )}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border text-center break-all p-2">
                          {request.SupervisorStep}
                        </td>
                        <td
                          className={`text-xs lg:text-sm xl:text-base | whitespace-nowrap border text-center p-2 ${
                            resultStyling(request.Result)
                          }`}
                        >
                          {request.Result === ""
                            ? "Awaiting Turn"
                            : request.Result}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border text-center p-2">
                          {formatDate(request.SubmitDate)}
                        </td>
                        <td className="text-xs lg:text-sm xl:text-base | whitespace-nowrap border min-w-16 text-center p-2">
                          {request.Remarks}
                        </td>
                        <td
                          className="text-xs lg:text-sm xl:text-base | bg-blue-300 hover:bg-blue-500 active:bg-blue-400 | whitespace-nowrap border text-center p-2 select-none"
                          onClick={() => {
                            setIdTraceUploadDest(request.IDTrace);
                            toggleDialog(uploadFileReference);
                          }}
                        >
                          +
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
      </div>
      <Dialog
        toggle={() => {
          toggleDialog(uploadFileReference);
          setBigFileWarning(false);
          setAttachedFiles([]);
        }}
        ref={uploadFileReference}
      >
        {uploadIsLoading
          ? (
            <div className="pr-32">
              <LoadingFallback />
            </div>
          )
          : (
            <div className="p-8 flex flex-col gap-2">
              <div className="flex items-start gap-4">
                <div className="h-64 w-lg max-h-64 max-w-lg overflow-clip overflow-y-auto border rounded-xl p-2">
                  {attachedFiles.map((file, index) => {
                    return (
                      <p
                        className="text-xs whitespace-nowrap overflow-hidden overflow-ellipsis select-none"
                        key={index}
                      >
                        <span
                          className="text-red-700 hover:text-red-500 active:text-red-600 | font-bold"
                          onClick={() => {
                            setAttachedFiles((prev) =>
                              prev.filter((_, prevIndex) => prevIndex !== index)
                            );
                          }}
                        >
                          X
                        </span>{" "}
                        {file.name}
                      </p>
                    );
                  })}
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="supervisor-file-upload"
                    className="bg-black hover:bg-black/70 active:bg-black/85 | text-white border px-4 py-2 rounded-2xl text-center"
                  >
                    <input
                      type="file"
                      name="supervisor-file-upload"
                      id="supervisor-file-upload"
                      hidden
                      onClick={() => setBigFileWarning(false)}
                      onChange={(e) => {
                        const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mb
                        const file = e.target.files && e.target.files[0];
                        const invalid = file === null || file === undefined ||
                          file.size > MAX_SIZE_BYTES;
                        if (!invalid) {
                          setAttachedFiles((prev) => [...prev, file]);
                        } else setBigFileWarning(true);
                        e.target.value = "";
                      }}
                    />
                    Insert attachment
                  </label>
                  <div
                    onClick={async () => {
                      setUploadIsLoading(true);
                      if (idTraceUploadDest === null) return;
                      const filesFormData = new FormData();
                      attachedFiles.forEach((file) =>
                        filesFormData.append("files", file)
                      );
                      try {
                        const _ = await fetch(
                          APIs.UploadFile(idTraceUploadDest),
                          {
                            method: "POST",
                            body: filesFormData,
                          },
                        );
                      } catch (err) {
                        const error: Error = new Error(
                          `Transport Failure: Your request did not reached the server. Please contact the administrator of this problem.\n(${err}).`,
                        );
                        console.error(error);
                      } finally {
                        toggleDialog(uploadFileReference);
                        setUploadIsLoading(false);
                        setAttachedFiles([]);
                      }
                    }}
                  >
                    <Button
                      id="supervisor-submit-file"
                      variant="green"
                      label={`Attach File to PR ${idTraceUploadDest}`}
                    />
                  </div>
                  {bigFileWarning && (
                    <p className="text-red-700">
                      You cannot upload<br />files that exceed 5Mb
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
      </Dialog>
    </Primitive>
  );
};

export default Approve;
