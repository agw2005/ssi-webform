import mailer from "@neabyte/deno-mailer";
import { getLogger } from "@logtape/logtape";
import { initialism } from "./helper/initialism.ts";

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

const companyEmailDomain = String(Deno.env.get("VITE_EMAIL_DOMAIN"));
const senderUsername = String(Deno.env.get("SENDER_EMAIL_USER"));
const senderLocalPart = String(Deno.env.get("SENDER_EMAIL_LOCAL_PART"));
const smtpTesterLocalPart = String(Deno.env.get("SMTP_TESTER_LOCAL_PART"));
const smtpAddr = String(Deno.env.get("SMTP_SERVER_ADDR"));
const smtpUser = String(Deno.env.get("SMTP_SERVER_USER"));
const smtpPass = String(Deno.env.get("SMTP_SERVER_PASS"));
const smtpPort = Number(Deno.env.get("SMTP_SERVER_PORT"));
const smtpRequireSecure = String(Deno.env.get("SMTP_SERVER_REQUIRE_SECURE"));
const companyLegalName = String(Deno.env.get("COMPANY_LEGAL_NAME"));
const companyTradeNameInitialized = initialism(
  String(Deno.env.get("COMPANY_TRADE_NAME")),
);
const appName = "PRISM";

const sendEmail = async (options: SendEmailOptions) => {
  logger.debug(`Value of senderUser is ${senderUsername}`, {
    accessId: options.accessId,
  });
  logger.debug(`Value of senderAddr is ${senderLocalPart}`, {
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
  logger.debug(`Value of companyName is ${companyLegalName}`, {
    accessId: options.accessId,
  });

  try {
    const transporter = mailer.transporter({
      host: smtpAddr,
      port: smtpPort,
      secure: smtpRequireSecure === "true" ? true : false, // If you encounter an `SMTP connection failed: received corrupt message of type InvalidContentType` then consider changing this value
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
      .replaceAll("{{companyName}}", companyLegalName);

    logger.debug(`Value of content is ${content}`, {
      accessId: options.accessId,
    });

    const result = await transporter.send({
      from: `"${senderUsername}" <${senderLocalPart}@${companyEmailDomain}>`,
      to: smtpTesterLocalPart
        ? `${smtpTesterLocalPart}@${companyEmailDomain}`
        : options.requestorEmail, // (Testing) Send to supervisor if testing
      subject:
        `${companyTradeNameInitialized} - ${appName}: ID Trace ${options.traceId}`,
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
