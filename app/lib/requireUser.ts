import { Session } from "@remix-run/core";
import { redirect } from "@remix-run/data";
import { getSession } from "../sessionStorage";

let requireUser = (
  loader: (arg0: any, arg1: Session) => any
) => async (loaderArg: { request: any }) => {
  let { request } = loaderArg;
  let session = await getSession(request.headers.get("Cookie"));
  return session.has("loggedIn")
    ? loader(loaderArg, session)
    : redirect("/login");
};

export default requireUser;
