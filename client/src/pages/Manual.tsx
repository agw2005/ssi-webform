import Primitive from "../components/reusable/Primitive.tsx";
import step1 from "../assets/images/manual/step1.png";
import step2 from "../assets/images/manual/step2.png";
import step3 from "../assets/images/manual/step3.png";
import step4 from "../assets/images/manual/step4.png";
import step5 from "../assets/images/manual/step5.png";
import step6 from "../assets/images/manual/step6.png";
import step7 from "../assets/images/manual/step7.png";
import step8 from "../assets/images/manual/step8.png";
import step9 from "../assets/images/manual/step9.png";

const Manual = () => {
  return (
    <Primitive isLoading={[]} isErr={[]} componentName="Manual.tsx">
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
              <img src={step1} alt="step1.png" className="border-2 w-3xl" />
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
              <img src={step2} alt="step2.png" className="border-2 w-7xl" />
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
              <img src={step3} alt="step3.png" className="border-2 w-2xl" />
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
              <img src={step4} alt="step4.png" className="border-2 w-7xl" />
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
              <img src={step5} alt="step5.png" className="border-2 w-xl" />
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
              <img src={step6} alt="step6.png" className="border-2 w-7xl" />
            </li>
            <li>
              <p>
                <span className="text-blue-700">(Optional)</span> If there are
                any files you want to attach to this request, you can do so in{" "}
                <strong>Step 5</strong>.
              </p>
              <img src={step7} alt="step7.png" className="border-2 w-2xl" />
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
                <img src={step8} alt="step8.png" className="border-2 w-2xl" />
                <img src={step9} alt="step9.png" className="border-2 w-2xl" />
              </div>
            </li>
          </ol>
        </section>
        <section className="flex flex-col gap-2" id="approver">
          <h2 className="font-bold text-4xl underline underline-offset-4">
            Requesting a Purchase
          </h2>
          <p>
            The manual for approving requests is not yet available at this time.
          </p>
        </section>
      </div>
    </Primitive>
  );
};

export default Manual;
