const mysqlDateIsoStringToJSString = (isoString: string) => {
  // The SQL server uses timezone-less datetime.
  // Javascript cannot be timezone-less and will automatically correct the UTC to the local time.
  // This website is developed in Indonesia (UTC+7), and JS will add 7 to the hours which we don't want.
  const mysqlDate = new Date(isoString);
  const reverseUTCCorrection = -7;

  const pad = (n: number) => String(n).padStart(2, "0");
  const year = mysqlDate.getFullYear();
  const month = pad(mysqlDate.getMonth() + 1);
  const date = pad(mysqlDate.getDate());
  const hours = pad(mysqlDate.getHours() + reverseUTCCorrection);
  const minutes = pad(mysqlDate.getMinutes());
  const seconds = pad(mysqlDate.getSeconds());

  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
};

export default mysqlDateIsoStringToJSString;
