import marked from "marked";
import hljs from "highlight.js";
import { LinksFunction, redirect } from "@remix-run/core";
import { Action, useRouteData } from "@remix-run/react";

import styles from "url:../styles/dashboard.css";

import Editor from "../components/Editor";
import requireUser from "../lib/requireUser";
import { supabase } from "../lib/initSupabase";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export let loader = requireUser(async ({ params }, _) => {
  const post = await supabase.from("posts").select("*").eq("id", params.postId);

  if (!post || post.data?.length === 0) {
    throw Error("who are u");
  }

  return post.data;
});

export let action: Action = async ({ request, params }) => {
  const body = new URLSearchParams(await request.text());

  await supabase
    .from("posts")
    .update({
      title: body.get("title"),
      markdownText: body.get("mdContent"),
    })
    .eq("id", params.postId);

  return redirect("/");
};

marked.setOptions({
  langPrefix: "",
  highlight: (code, lang) => hljs.highlightAuto(code, [lang]).value,
});

export default function EditPost() {
  const data = useRouteData();

  return (
    <Editor
      markdownText={data[0].markdownText}
      title={data[0].title}
      action="update"
    />
  );
}
