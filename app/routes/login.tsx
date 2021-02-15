import { json, redirect } from "@remix-run/data";
import { Action, Form, Loader, useRouteData } from "@remix-run/react";
import { getSession, commitSession } from "../sessionStorage";

export let action: Action = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));
  const body = new URLSearchParams(await request.text());
  const email = body.get("email");
  const password = body.get("password");

  if (password !== process.env.PASSWORD || email !== process.env.EMAIL) {
    session.flash("error", "Invalid email/password");
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  session.set("loggedIn", true);

  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export let loader: Loader = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));
  if (session.has("loggedIn")) {
    return redirect("/dashboard");
  }

  let data = { error: session.get("error") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

export default function Admin() {
  const { error } = useRouteData();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full py-12 px-6">
        <p className="mb-4 text-center text-sm text-gray-900">
          Login to your account
        </p>
        <Form className="space-y-4 relative" method="post">
          <div className="rounded-md shadow-sm overflow-hidden">
            <input
              className="border-gray-300 placeholder-gray-500 relative block w-full px-3 py-2 border text-gray-900 rounded-t-md focus:outline-none focus:border-blue-300 focus:z-10 sm:text-sm"
              type="text"
              name="email"
              placeholder="Email"
            />
            <input
              className="border-gray-300 placeholder-gray-500 relative block w-full px-3 py-2 border text-gray-900 rounded-b-md focus:outline-none focus:border-blue-300 focus:z-10 sm:text-sm -mt-px"
              type="password"
              name="password"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-gray-800 text-gray-200 w-full py-2"
          >
            Log in
          </button>
          {error ? (
            <div className="absolute text-red-600 left-24">{error}</div>
          ) : null}
        </Form>
      </div>
    </div>
  );
}
