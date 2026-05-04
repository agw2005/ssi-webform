const handleLoginSSO = () => {
  const ssoURL = new URL(
    `${globalThis.location.origin}/ums/login`,
  );
  ssoURL.searchParams.set(
    "return_url",
    "https://intranet3.ssi.asiasharp.com/ums/login",
  );
  ssoURL.searchParams.set(
    "system",
    "webform",
  );

  console.log(ssoURL.toString());

  globalThis.location.href = ssoURL.toString();
};

export default handleLoginSSO;
