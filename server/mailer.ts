import mailer from "@neabyte/deno-mailer";

// Test with `deno run --env --allow-env --allow-read --allow-net mailer.ts`

interface SendEmailOptions {
  requestorEmail: string;
  requestorName: string;
  traceId: string;
  requestSubject: string;
  supervisorAction: string;
  supervisorName: string;
  currentStatus: string;
}

interface EmailContent {
  requestorName: string;
  traceId: string;
  requestSubject: string;
  supervisorAction: string;
  supervisorName: string;
  currentStatus: string;
}

const senderUser = String(Deno.env.get("SENDER_EMAIL_USER"));
const senderAddr = String(Deno.env.get("SENDER_EMAIL_ADDR"));
const senderPass = String(Deno.env.get("SENDER_EMAIL_PASS"));
const appName = "PRISM";
const companyName = "PT. Foxconn Technology Indonesia";

// SMTP configuration (Gmail)
const transporter = mailer.transporter({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    type: "password",
    user: senderAddr,
    pass: senderPass,
  },
});

const sendEmail = async (options: SendEmailOptions) => {
  const contentConfig: EmailContent = {
    requestorName: options.requestorName,
    traceId: options.traceId,
    requestSubject: options.requestSubject,
    supervisorAction: options.supervisorAction,
    supervisorName: options.supervisorName,
    currentStatus: options.currentStatus,
  };

  const rawContent = await Deno.readTextFile(
    `${Deno.cwd()}/public/content.html`,
  );
  const content = Object.entries(contentConfig).reduce(
    (acc, [key, value]) => acc.replaceAll(`{{${key}}}`, value),
    rawContent,
  )
    .replaceAll("{{appName}}", appName)
    .replaceAll("{{companyName}}", companyName);

  try {
    const result = await transporter.send({
      from: `"${senderUser}" <${senderAddr}>`,
      // to: options.receiverEmail,
      to: `danialag2005@gmail.com`, // (Testing) Send email to `danialag2005@gmail.com` instead
      bcc: ``, // (Testing) Send to supervisor for testing
      subject: `PRISM: ${options.currentStatus} ${options.traceId}`,
      text: content, // If no HTML content is provided, will fall back to plain text.
      html: content,
    });

    console.log(result.acceptedRecipients);
    console.log(result.envelope);
    console.log(result.messageId);
    console.log(result.rejectedRecipients);
    console.log(result.response);
  } catch (err) {
    console.error(err);
  }
};

export default sendEmail;

// const main = () => {
//   const emailConfig: SendEmailOptions = {
//     receiverEmail: "danialag2005@gmail.com",
//     requestorName: "Yusup Al",
//     traceId: "13185",
//     requestSubject:
//       "Installation new internet line for migration network from Sharp to Foxconn",
//     supervisorAction: "Approved",
//     supervisorName: "SUWARSIH",
//     currentStatus: "Final Approved",
//   };

//   sendEmail(emailConfig);
// };
// main();
