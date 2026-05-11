import mailer from "@neabyte/deno-mailer";

// Run in server workspace
// deno run --allow-env --env-file=../.env --allow-read --allow-net ./testMailer.ts

const main = async () => {
  const senderUser = String(Deno.env.get("SENDER_EMAIL_USER"));
  const senderAddr = String(Deno.env.get("SENDER_EMAIL_ADDR"));
  const smtpAddr = String(Deno.env.get("SMTP_SERVER_ADDR"));
  const smtpUser = String(Deno.env.get("SMTP_SERVER_USER"));
  const smtpPass = String(Deno.env.get("SMTP_SERVER_PASS"));
  const smtpPort = Number(Deno.env.get("SMTP_SERVER_PORT"));
  const appName = "PRISM";
  const companyName = "PT. Foxconn Technology Indonesia";

  console.log(senderUser);
  console.log(senderAddr);
  console.log(smtpAddr);
  console.log(smtpUser);
  console.log(smtpPass);
  console.log(smtpPort);
  console.log(appName);
  console.log(companyName);

  try {
    const transporter = mailer.transporter({
      host: smtpAddr,
      port: smtpPort,
      secure: false,
      auth: (smtpPass && smtpUser)
        ? {
          type: "password",
          user: smtpUser,
          pass: smtpPass,
        }
        : undefined,
    });

    const rawContent = await Deno.readTextFile(
      `${Deno.cwd()}/public/content.html`,
    );

    const result = await transporter.send({
      from: `"${senderUser}" <${senderAddr}>`,
      // to: options.receiverEmail,
      to: `danialag2005@gmail.com`, // (Testing) Send email to `danialag2005@gmail.com` instead
      bcc: ``, // (Testing) Send to supervisor for testing
      subject: `PRISM: {options.currentStatus} {options.traceId}`,
      text: rawContent,
      html: rawContent,
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

await main();
