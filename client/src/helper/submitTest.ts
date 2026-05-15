import type { SubmitPayload, SubmitResponse, Usage } from "@scope/server";
import { submitRequest } from "@scope/server";
import { APIs } from "./apis.ts";

export const submitTest = async () => {
  const usage: Usage[] = [{
    costCenter: "104",
    budgetOrNature: "811052000",
    periode: "2025LH01",
    balance: "135.00",
    description: "Item 1",
    quantity: "1",
    unitPrice: "0",
    measure: "pcs",
    currency: "USD",
    vendor: "Test Vendor",
    reason: "Testing",
    estimatedDeliveryDate: "2026-05-15",
  }, {
    costCenter: "104",
    budgetOrNature: "811052000",
    periode: "2025LH01",
    balance: "135.00",
    description: "Item 2",
    quantity: "1",
    unitPrice: "0",
    measure: "pcs",
    currency: "USD",
    vendor: "Test Vendor",
    reason: "Testing",
    estimatedDeliveryDate: "2026-05-15",
  }, {
    costCenter: "104",
    budgetOrNature: "811052000",
    periode: "2025LH01",
    balance: "135.00",
    description: "Item 3",
    quantity: "1",
    unitPrice: "0",
    measure: "pcs",
    currency: "USD",
    vendor: "Test Vendor",
    reason: "Testing",
    estimatedDeliveryDate: "2026-05-15",
  }];

  const payload: SubmitPayload = {
    firstStep: {
      name: "Admin Test",
      section: "MIS",
      nrp: "999999",
      ext: "999",
      email: "webform_admin",
      fileResource: "MIS",
      department: "104", // IDSection
      form: "PR",
    },
    secondStep: {
      formNumber: "",
      prNumber: "",
      subject: "Admin Test PR",
      returnOnOutgoing: "This a test PR that is created by the Admin.",
    },
    thirdStep: {
      usages: usage,
    },
    fourthStep: {
      approver: ["RAHMAT PRIYO UTOMO"],
      releaser: ["RAHMAT PRIYO UTOMO", "RIDWAN WALANGADI", "HENDRY HARIADI"],
      administrator: ["SUWARSIH"],
    },
    fifthStep: {
      files: [],
    },
  };

  try {
    console.log(payload);
    const submitResponse = await fetch(
      APIs.SubmitRequest,
      submitRequest(payload),
    );
    const submitResponseBody: SubmitResponse = await submitResponse.json();
    console.log(submitResponseBody);
  } catch (err) {
    console.error(err);
  }
};
