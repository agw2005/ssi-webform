import mailer from "@neabyte/deno-mailer";
import { getLogger } from "@logtape/logtape";

const logger = getLogger("prism-server");

// Test with `deno run --env --allow-env --allow-read --allow-net mailer.ts`

interface SendEmailOptions {
  requestorEmail: string;
  requestorName: string;
  traceId: string;
  requestSubject: string;
  supervisorAction: string;
  supervisorName: string;
  currentStatus: string;
  accessId: string;
  requestLink: string;
}

interface EmailContent {
  requestorName: string;
  traceId: string;
  requestSubject: string;
  supervisorAction: string;
  supervisorName: string;
  currentStatus: string;
  requestLink: string;
}

const senderUser = String(Deno.env.get("SENDER_EMAIL_USER"));
const senderAddr = String(Deno.env.get("SENDER_EMAIL_ADDR"));
const smtpAddr = String(Deno.env.get("SMTP_SERVER_ADDR"));
const smtpUser = String(Deno.env.get("SMTP_SERVER_USER"));
const smtpPass = String(Deno.env.get("SMTP_SERVER_PASS"));
const smtpPort = Number(Deno.env.get("SMTP_SERVER_PORT"));
const appName = "PRISM";
const companyName = "PT. Foxconn Technology Indonesia";

const sendEmail = async (options: SendEmailOptions) => {
  logger.debug(`Value of senderUser is ${senderUser}`, {
    accessId: options.accessId,
  });
  logger.debug(`Value of senderAddr is ${senderAddr}`, {
    accessId: options.accessId,
  });
  logger.debug(`Value of smtpAddr is ${smtpAddr}`, {
    accessId: options.accessId,
  });
  logger.debug(`Value of smtpUser is ${smtpUser}`, {
    accessId: options.accessId,
  });
  logger.debug(`Value of smtpPass is ${smtpPass}`, {
    accessId: options.accessId,
  });
  logger.debug(`Value of smtpPort is ${smtpPort}`, {
    accessId: options.accessId,
  });
  logger.debug(`Value of appName is ${appName}`, {
    accessId: options.accessId,
  });
  logger.debug(`Value of companyName is ${companyName}`, {
    accessId: options.accessId,
  });

  try {
    const transporter = mailer.transporter({
      host: smtpAddr,
      port: smtpPort,
      secure: false, // If you encounter an `SMTP connection failed: received corrupt message of type InvalidContentType` then consider changing this value
      auth: (smtpPass && smtpUser)
        ? {
          type: "password",
          user: smtpUser,
          pass: smtpPass,
        }
        : undefined,
    });

    const contentConfig: EmailContent = {
      requestorName: options.requestorName,
      traceId: options.traceId,
      requestSubject: options.requestSubject,
      supervisorAction: options.supervisorAction,
      supervisorName: options.supervisorName,
      currentStatus: options.currentStatus,
      requestLink: options.requestLink,
    };

    logger.debug(`Value of requestorName is ${contentConfig.requestorName}`, {
      accessId: options.accessId,
    });
    logger.debug(`Value of traceId is ${contentConfig.traceId}`, {
      accessId: options.accessId,
    });
    logger.debug(`Value of requestSubject is ${contentConfig.requestSubject}`, {
      accessId: options.accessId,
    });
    logger.debug(
      `Value of supervisorAction is ${contentConfig.supervisorAction}`,
      {
        accessId: options.accessId,
      },
    );
    logger.debug(`Value of supervisorName is ${contentConfig.supervisorName}`, {
      accessId: options.accessId,
    });
    logger.debug(`Value of currentStatus is ${contentConfig.currentStatus}`, {
      accessId: options.accessId,
    });

    const rawContent = await Deno.readTextFile(
      `${Deno.cwd()}/public/content.html`,
    );
    const content = Object.entries(contentConfig).reduce(
      (acc, [key, value]) => acc.replaceAll(`{{${key}}}`, value),
      rawContent,
    )
      .replaceAll("{{appName}}", appName)
      .replaceAll("{{companyName}}", companyName);

    logger.debug(`Value of content is ${content}`, {
      accessId: options.accessId,
    });

    const result = await transporter.send({
      from: `"${senderUser}" <${senderAddr}>`,
      // to: options.receiverEmail,
      to: `danialag2005@gmail.com`, // (Testing) Send email to `danialag2005@gmail.com` instead
      bcc: `danial.agw.2005@gmail.com`, // (Testing) Send to supervisor for testing
      subject: `FTI - ${appName}: ${options.currentStatus} ${options.traceId}`,
      text: content, // If no HTML content is provided, will fall back to plain text.
      html: content,
    });

    logger.debug(
      `Value of result.acceptedRecipients is ${result.acceptedRecipients}`,
      {
        accessId: options.accessId,
      },
    );
    logger.debug(`Value of result.envelope is ${result.envelope}`, {
      accessId: options.accessId,
    });
    logger.debug(`Value of result.messageId is ${result.messageId}`, {
      accessId: options.accessId,
    });
    logger.debug(
      `Value of result.rejectedRecipients is ${result.rejectedRecipients}`,
      {
        accessId: options.accessId,
      },
    );
    logger.debug(`Value of result.response is ${result.response}`, {
      accessId: options.accessId,
    });

    return result;
  } catch (err) {
    logger.error(`Error during mailing: ${err}`, {
      accessId: options.accessId,
    });
  }
};

export default sendEmail;
