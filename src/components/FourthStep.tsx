import { useState } from "react";
import EmployeeSectionMappings from "../dummies/Approval.json";
import TipBox from "./TipBox";

const FourthStep = () => {
  const [approverSection, setApproverSection] = useState<string | undefined>(
    undefined,
  );
  const [approverName, setApproverName] = useState<string | undefined>(
    undefined,
  );
  const [releaserSection, setReleaserSection] = useState<string | undefined>(
    undefined,
  );
  const [releaserName, setReleaserName] = useState<string | undefined>(
    undefined,
  );
  const [administratorSection, setAdministratorSection] = useState<
    string | undefined
  >(undefined);
  const [administratorName, setAdministratorName] = useState<
    string | undefined
  >(undefined);

  return (
    <div className="rounded-2xl bg-green-100 p-8 flex flex-col gap-4 flex-1 w-full">
      <h1 className="text-3xl font-bold text-green-600">Step 4</h1>
      <TipBox
        label={`Special Releaser will available if you have \"Red Light\"`}
        color="green"
        colorIntensity="900"
      />
      <TipBox
        label={`Check again your approver before you submit your PR Form`}
        color="green"
        colorIntensity="900"
      />
      <div className="flex flex-col">
        <div className="h-8 lg:h-9 xl:h-10 | flex">
          <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-tl-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-green-600 bg-green-600 text-white select-none">
            Approver*
          </div>
          <select
            name="approver-section"
            id="approver-section"
            className="text-xs lg:text-sm xl:text-base | w-full h-full px-4 border border-green-600 text-green-600 bg-white/50 outline-none flex-1"
            onChange={(e) => {
              if (approverName !== undefined) {
                setApproverName("");
              }
              const newApproverSection = e.target.value;
              setApproverSection(newApproverSection);
            }}
            value={approverSection}
          >
            <option value="" disabled selected>
              Select Section
            </option>
            {EmployeeSectionMappings.map((approver, index) => {
              return (
                <option key={index} value={approver.section}>
                  {approver.section}
                </option>
              );
            })}
          </select>
          <select
            name="approver-name"
            id="approver-name"
            className="text-xs lg:text-sm xl:text-base | w-full rounded-tr-xl h-full px-4 border border-green-600 text-green-600 bg-white/50 outline-none flex-1"
            onChange={(e) => {
              const newApproverName = e.target.value;
              setApproverName(newApproverName);
            }}
            value={approverName}
          >
            <option value="" disabled selected>
              Select Approver
            </option>
            {EmployeeSectionMappings.find(
              (approver) => approver.section === approverSection,
            )?.members.map((member, index) => {
              return (
                <option key={index} value={member}>
                  {member}
                </option>
              );
            })}
          </select>
        </div>
        <div className="text-xs lg:text-sm xl:text-base | w-full flex flex-wrap gap-2 min-h-10 font-bold rounded-b-xl justify-self-center border border-green-600 text-white select-none p-2">
          <div className="flex">
            <div className="text-xs lg:text-sm | font-normal bg-green-900 rounded-l-xl p-2 flex items-center">
              Danial Al Ghazali Walangadi (203)
            </div>
            <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
              X
            </div>
          </div>
          <div className="flex">
            <div className="text-xs lg:text-sm | font-normal bg-green-900 rounded-l-xl p-2 flex items-center">
              Danial Al Ghazali Walangadi (203)
            </div>
            <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
              X
            </div>
          </div>
          <div className="flex">
            <div className="text-xs lg:text-sm | font-normal bg-green-900 rounded-l-xl p-2 flex items-center">
              Danial Al Ghazali Walangadi (203)
            </div>
            <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
              X
            </div>
          </div>
          <div className="flex">
            <div className="text-xs lg:text-sm | font-normal bg-green-900 rounded-l-xl p-2 flex items-center">
              Danial Al Ghazali Walangadi (203)
            </div>
            <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
              X
            </div>
          </div>
          <div className="flex">
            <div className="text-xs lg:text-sm | font-normal bg-green-900 rounded-l-xl p-2 flex items-center">
              Danial Al Ghazali Walangadi (203)
            </div>
            <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
              X
            </div>
          </div>
          <div className="flex">
            <div className="text-xs lg:text-sm | font-normal bg-green-900 rounded-l-xl p-2 flex items-center">
              Danial Al Ghazali Walangadi (203)
            </div>
            <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
              X
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="h-8 lg:h-9 xl:h-10 | flex">
          <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-tl-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-green-600 bg-green-600 text-white select-none">
            Releaser*
          </div>
          <select
            name="releaser-section"
            id="releaser-section"
            className="text-xs lg:text-sm xl:text-base | w-full h-full px-4 border border-green-600 text-green-600 bg-white/50 outline-none flex-1"
            onChange={(e) => {
              if (releaserName !== undefined) {
                setReleaserName("");
              }
              const newReleaserSection = e.target.value;
              setReleaserSection(newReleaserSection);
            }}
            value={releaserSection}
          >
            <option value="" disabled selected>
              Select Section
            </option>
            {EmployeeSectionMappings.map((releaser, index) => {
              return (
                <option key={index} value={releaser.section}>
                  {releaser.section}
                </option>
              );
            })}
          </select>
          <select
            name="releaser-name"
            id="releaser-name"
            className="text-xs lg:text-sm xl:text-base | w-full rounded-tr-xl h-full px-4 border border-green-600 text-green-600 bg-white/50 outline-none flex-1"
            onChange={(e) => {
              const newReleaserName = e.target.value;
              setReleaserName(newReleaserName);
            }}
            value={releaserName}
          >
            <option value="" disabled selected>
              Select Releaser
            </option>
            {EmployeeSectionMappings.find(
              (releaser) => releaser.section === releaserSection,
            )?.members.map((member, index) => {
              return (
                <option key={index} value={member}>
                  {member}
                </option>
              );
            })}
          </select>
        </div>
        <div className="text-xs lg:text-sm xl:text-base | w-full flex flex-wrap gap-2 min-h-10 font-bold rounded-b-xl justify-self-center border border-green-600 text-white select-none p-2">
          <div className="flex">
            <div className="text-xs lg:text-sm | font-normal bg-green-900 rounded-l-xl p-2 flex items-center">
              Danial Al Ghazali Walangadi (203)
            </div>
            <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
              X
            </div>
          </div>
          <div className="flex">
            <div className="text-xs lg:text-sm | font-normal bg-green-900 rounded-l-xl p-2 flex items-center">
              Danial Al Ghazali Walangadi (203)
            </div>
            <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
              X
            </div>
          </div>
          <div className="flex">
            <div className="text-xs lg:text-sm | font-normal bg-green-900 rounded-l-xl p-2 flex items-center">
              Danial Al Ghazali Walangadi (203)
            </div>
            <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
              X
            </div>
          </div>
          <div className="flex">
            <div className="text-xs lg:text-sm | font-normal bg-green-900 rounded-l-xl p-2 flex items-center">
              Danial Al Ghazali Walangadi (203)
            </div>
            <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
              X
            </div>
          </div>
          <div className="flex">
            <div className="text-xs lg:text-sm | font-normal bg-green-900 rounded-l-xl p-2 flex items-center">
              Danial Al Ghazali Walangadi (203)
            </div>
            <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
              X
            </div>
          </div>
          <div className="flex">
            <div className="text-xs lg:text-sm | font-normal bg-green-900 rounded-l-xl p-2 flex items-center">
              Danial Al Ghazali Walangadi (203)
            </div>
            <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
              X
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="h-8 lg:h-9 xl:h-10 | flex">
          <div className="text-xs lg:text-sm xl:text-base | font-bold rounded-tl-xl h-full justify-self-center border flex items-center px-2 border-r-0 border-green-600 bg-green-600 text-white select-none">
            Administrator*
          </div>
          <select
            name="administrator-section"
            id="administrator-section"
            className="text-xs lg:text-sm xl:text-base | w-full h-full px-4 border border-green-600 text-green-600 bg-white/50 outline-none flex-1"
            onChange={(e) => {
              if (administratorName !== undefined) {
                setAdministratorName("");
              }
              const newAdministratorSection = e.target.value;
              setAdministratorSection(newAdministratorSection);
            }}
            value={administratorSection}
          >
            <option value="" disabled selected>
              Select Section
            </option>
            {EmployeeSectionMappings.map((administrator, index) => {
              return (
                <option key={index} value={administrator.section}>
                  {administrator.section}
                </option>
              );
            })}
          </select>
          <select
            name="administrator-name"
            id="administrator-name"
            className="text-xs lg:text-sm xl:text-base | w-full rounded-tr-xl h-full px-4 border border-green-600 text-green-600 bg-white/50 outline-none flex-1"
            onChange={(e) => {
              const newAdministratorName = e.target.value;
              setAdministratorName(newAdministratorName);
            }}
            value={administratorName}
          >
            <option value="" disabled selected>
              Select Administrator
            </option>
            {EmployeeSectionMappings.find(
              (administrator) => administrator.section === administratorSection,
            )?.members.map((member, index) => {
              return (
                <option key={index} value={member}>
                  {member}
                </option>
              );
            })}
          </select>
        </div>
        <div className="text-xs lg:text-sm xl:text-base | w-full flex flex-wrap gap-2 min-h-10 font-bold rounded-b-xl justify-self-center border border-green-600 text-white select-none p-2">
          <div className="flex">
            <div className="text-xs lg:text-sm | font-normal bg-green-900 rounded-l-xl p-2 flex items-center">
              Danial Al Ghazali Walangadi (203)
            </div>
            <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
              X
            </div>
          </div>
          <div className="flex">
            <div className="text-xs lg:text-sm | font-normal bg-green-900 rounded-l-xl p-2 flex items-center">
              Danial Al Ghazali Walangadi (203)
            </div>
            <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
              X
            </div>
          </div>
          <div className="flex">
            <div className="text-xs lg:text-sm | font-normal bg-green-900 rounded-l-xl p-2 flex items-center">
              Danial Al Ghazali Walangadi (203)
            </div>
            <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
              X
            </div>
          </div>
          <div className="flex">
            <div className="text-xs lg:text-sm | font-normal bg-green-900 rounded-l-xl p-2 flex items-center">
              Danial Al Ghazali Walangadi (203)
            </div>
            <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
              X
            </div>
          </div>
          <div className="flex">
            <div className="text-xs lg:text-sm | font-normal bg-green-900 rounded-l-xl p-2 flex items-center">
              Danial Al Ghazali Walangadi (203)
            </div>
            <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
              X
            </div>
          </div>
          <div className="flex">
            <div className="text-xs lg:text-sm | font-normal bg-green-900 rounded-l-xl p-2 flex items-center">
              Danial Al Ghazali Walangadi (203)
            </div>
            <div className="text-xs lg:text-sm | bg-red-900 hover:bg-red-900/85 active:bg-red-900/70 | font-normal rounded-r-xl p-2 text-white">
              X
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none">
          Clear
        </div>
        <div className="bg-black hover:bg-black/70 active:bg-black/85 | px-4 py-2 border rounded-2xl border-black font-bold tracking-wide text-white select-none">
          Next
        </div>
      </div>
    </div>
  );
};

export default FourthStep;
