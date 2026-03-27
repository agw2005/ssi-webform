import Primitive from "../components/reusable/Primitive.tsx";
import step1Requestor from "../assets/images/manual/step1-requestor.png";
import step2Requestor from "../assets/images/manual/step2-requestor.png";
import step3Requestor from "../assets/images/manual/step3-requestor.png";
import step4Requestor from "../assets/images/manual/step4-requestor.png";
import step5Requestor from "../assets/images/manual/step5-requestor.png";
import step6Requestor from "../assets/images/manual/step6-requestor.png";
import step7Requestor from "../assets/images/manual/step7-requestor.png";
import step8Requestor from "../assets/images/manual/step8-requestor.png";
import step9Requestor from "../assets/images/manual/step9-requestor.png";
import step1Approver from "../assets/images/manual/step1-approver.png";
import step2Approver from "../assets/images/manual/step2-approver.png";
import step3Approver from "../assets/images/manual/step3-approver.png";
import step4Approver from "../assets/images/manual/step4-approver.png";
import step5Approver from "../assets/images/manual/step5-approver.png";
import step6Approver from "../assets/images/manual/step6-approver.png";

const Manual = () => {
  return (
    <Primitive
      isLoading={[]}
      isErr={[]}
      componentName="Manual.tsx"
      pageTitle="Manual"
    >
      <div className="flex flex-col gap-32">
        <section className="flex flex-col gap-2">
          <h2 className="font-black text-4xl underline underline-offset-4">
            Table of Contents
          </h2>
          <ul className="list-disc list-inside">
            <li>
              <a href="#requestor" className="text-blue-700">
                Requesting a purchase
              </a>
            </li>
            <li>
              <a href="#approver" className="text-blue-700">
                Approving a request
              </a>
            </li>
          </ul>
        </section>
        <section className="flex flex-col gap-2" id="requestor">
          <h2 className="font-bold text-4xl underline underline-offset-4">
            Requesting a Purchase
          </h2>
          <ol className="list-decimal list-outside pl-6 space-y-4">
            <li>
              <p>
                Click <strong>Submit Form</strong> on the navigation bar.
              </p>
              <img
                src={step1Requestor}
                alt="step1-requestor.png"
                className="border-2 w-3xl"
              />
            </li>
            <li>
              <p>
                Fill the requestor data on the <strong>Step 1</strong> form.
                After that, click <strong>Next</strong>.<br />
                <span className="text-red-600">
                  The <strong>Your E-Mail</strong> field will automatically
                  append <strong>@ssi.sharp-world.com</strong>, so you only need
                  to specify the email's username.
                </span>
              </p>
              <img
                src={step2Requestor}
                alt="step2-requestor.png"
                className="border-2 w-7xl"
              />
            </li>
            <li>
              <p>
                Fill the initial information regarding the request on the{" "}
                <strong>Step 2</strong> form. After that, click{" "}
                <strong>Next</strong>.<br />
                <span className="text-red-600">
                  You do not need to fill the Form and PR number as they will be
                  generated post-submission.
                </span>
              </p>
              <img
                src={step3Requestor}
                alt="step3-requestor.png"
                className="border-2 w-2xl"
              />
            </li>
            <li>
              <p>
                Fill the purchasing data on the <strong>Step 3</strong> form.
                After that, click <strong>Add Usage</strong> to save the
                purchase. Do this for every purchase that this request will
                encompass.
                <br />
                You can view the requests you have saved in the table beside the
                form. You can also delete requests you have made.
                <br />
                <span className="text-red-600">
                  The <strong>Periode</strong> will be affixed to the current
                  time and date, and the <strong>Balance</strong> will show up
                  according to the selected <strong>Budget/Nature</strong> (and
                  by extension, the <strong>Cost Center</strong>).
                </span>
              </p>
              <img
                src={step4Requestor}
                alt="step4-requestor.png"
                className="border-2 w-7xl"
              />
            </li>
            <li>
              <p>
                Below the <strong>Step 3</strong> form, you can view the{" "}
                <strong>Budget Summary</strong> and <strong>Total Usage</strong>{" "}
                of your purchase requests.
                <br />
                Your will know if your request have exceeded the budget when it
                has an <span className="text-red-600 font-bold">[RL]</span>{" "}
                label.
                <br />
                All purchasing requests will be normalized to USD regardless of
                the selected currency.
                <br />
                <span className="text-red-600">
                  A red light label will also be added to the remarks and
                  subject of your request upon submission if your request does
                  exceed the budget.
                </span>
                <br />
                Click <strong>Next</strong> once you have done logging all the
                necessary purchase.
              </p>
              <img
                src={step5Requestor}
                alt="step5-requestor.png"
                className="border-2 w-xl"
              />
            </li>
            <li>
              <p>
                Select a supervisor to act as the <strong>Approver</strong>,{" "}
                <strong>Releaser</strong>, and <strong>Administrator</strong> of
                your request.
                <br />
                Select a section first using the left dropdown, then the name of
                the supervisor.
                <br />
                After that, click <strong>Next</strong>.
              </p>
              <img
                src={step6Requestor}
                alt="step6-requestor.png"
                className="border-2 w-7xl"
              />
            </li>
            <li>
              <p>
                <span className="text-red-700">(Optional)</span> If there are
                any files you want to attach to this request, you can do so in{" "}
                <strong>Step 5</strong>.
              </p>
              <img
                src={step7Requestor}
                alt="step7-requestor.png"
                className="border-2 w-2xl"
              />
            </li>
            <li>
              <p>
                After you have filled are the required input fields, you click
                on <strong>Submit</strong>.<br />
                A prompt will show to confirm if you want to submit the request.
                <br />
                Click on <strong>OK</strong> will redirect you to the loading
                screen (please do not close the window during this time).
                <br />
                After some time, you will receive a response from the server
                regarding your request. <br /> You can safely click{" "}
                <strong>OK</strong>, concluding the request workflow.
              </p>
              <div className="flex flex-col gap-2">
                <img
                  src={step8Requestor}
                  alt="step8-requestor.png"
                  className="border-2 w-2xl"
                />
                <img
                  src={step9Requestor}
                  alt="step9-requestor.png"
                  className="border-2 w-2xl"
                />
              </div>
            </li>
          </ol>
        </section>
        <section className="flex flex-col gap-2" id="approver">
          <h2 className="font-bold text-4xl underline underline-offset-4">
            Approving a Purchase
          </h2>
          <ol className="list-decimal list-outside pl-6 space-y-4">
            <li>
              <p>
                Click <strong>Approval Menu</strong> on the navigation bar.
              </p>
              <img
                src={step1Approver}
                alt="step1-approver.png"
                className="border-2 w-3xl"
              />
            </li>
            <li>
              <p>
                Login using your company-issued NRP and the password associated
                with that NRP. After that, click <strong>Sign in</strong>.
              </p>
              <img
                src={step2Approver}
                alt="step2-approver.png"
                className="border-2 w-3xl"
              />
            </li>
            <li>
              <p>
                You will be redirected to the <strong>Approval Menu</strong>.
                <br />
                Here, you can view the purchasing request that has you as one of
                its supervisor.
                <br />
                You can view what type of supervisor you are to the purchasing
                request through the <strong>Type</strong> column.
                <br />
                You can filter the contents by the status of your verdict,
                request submission date, etc.
                <br />
                Click on the subject of the purchasing request to access the
                details of the request, where you can <strong>
                  Approve
                </strong>{" "}
                or <strong>Reject</strong> the request.
              </p>
              <img
                src={step3Approver}
                alt="step3-approver.png"
                className="border-2 w-7xl"
              />
            </li>
            <li>
              <p>
                Inside the request interface, while logged in as the correct
                user, you can post a verdict, either <strong>Approve</strong> or{" "}
                <strong>Reject</strong> the request.
                <br />
                Furthermore, you can edit the remarks of the request. Just click
                on the <strong>Remarks</strong> field as start typing. You will
                need to save the new remark.
                <br />
                <span className="text-red-600">
                  Do note that once you have <strong>Approve</strong> or{" "}
                  <strong>Reject</strong> a request, you will no longer be able
                  to edit the remarks.
                </span>
              </p>
              <br />
              <p>
                <span className="font-bold text-green-600">
                  If the chosen verdict is Approve
                </span>
                , your result as the supervisor will be marked as{" "}
                <strong>Approved</strong> from the status{" "}
                <strong>In Progress</strong>.
                <br />
                The request will either move on to the next supervisor in the
                path or will be updated to <strong>Final Approved</strong> if
                there is no more supervisor left.
                <br />
                Serving the verdict will redirect you to the{" "}
                <strong>Approval Menu</strong>
              </p>
              <img
                src={step4Approver}
                alt="step4-approver.png"
                className="border-2 w-7xl"
              />
            </li>
            <li>
              <p>
                <span className="font-bold text-red-600">
                  If the chosen verdict is Reject
                </span>
                , you will activate a pop-up to select which items of the
                request you are rejecting (By the Items ID).
                <br />
                You must select at least 1 item of the request in order to
                reject the request.
                <br />
                Post-rejection, you will be redirected to the{" "}
                <strong>Approval Menu</strong> and the request will be labelled
                as rejected.
              </p>
              <img
                src={step5Approver}
                alt="step5-approver.png"
                className="border-2 w-7xl"
              />
              <br />
              <p>
                The rejected request will not have anyone as its supervisor
                anymore.
              </p>
              <img
                src={step6Approver}
                alt="step6-approver.png"
                className="border-2 w-7xl"
              />
            </li>
          </ol>
        </section>
      </div>
    </Primitive>
  );
};

export default Manual;
