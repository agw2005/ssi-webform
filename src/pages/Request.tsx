import { useParams } from "react-router-dom";
import Primitive from "../components/Primitive";

const Request = () => {
  const params = useParams();

  return <Primitive>Request ID : {params.requestId}</Primitive>;
};

export default Request;
