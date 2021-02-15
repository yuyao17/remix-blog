import { useRouteData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/data";
import { supabase } from "../lib/initSupabase";
import { getSession } from "../sessionStorage";
import { Link } from "react-router-dom";
import * as React from "react";

type Data = {
  posts: {
    id: number;
    markdownText: string;
    title: string;
  }[];
  admin: boolean;
};

export let loader: LoaderFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));
  let { data: posts } = await supabase.from("posts").select("*");
  return { posts, admin: session.has("loggedIn") };
};

export let meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!",
  };
};

export default function Index() {
  let { posts, admin } = useRouteData<Data>();

  return (
    <div className="max-w-7xl m-auto">
      <h2>Welcome to Remix!</h2>
      <ul>
        {posts.map((post) => (
          <React.Fragment key={post.id}>
            <li>{post.title}</li>
            {admin ? <Link to={`/${post.id}/edit`}>Edit</Link> : null}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}
