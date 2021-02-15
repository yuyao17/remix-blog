import * as React from "react";
import { Form, usePendingFormSubmit } from "@remix-run/react";
import marked from "marked";

const verbify = (action: string) => action.slice(0, -1) + "ing...";

export default function Editor({
  markdownText,
  title,
  action,
}: {
  markdownText: string;
  title: string;
  action: "create" | "update";
}) {
  const [mdContent, setMdContent] = React.useState(markdownText);
  const pendingForm = usePendingFormSubmit();

  return (
    <div className="min-h-screen">
      <Form
        method="post"
        className="bg-gray-300 p-6 space-y-4 flex flex-col overflow-auto fixed top-0 bottom-0 w-72"
      >
        <div className="flex space-x-2">
          <input
            name="title"
            type="text"
            placeholder="Title"
            defaultValue={title}
            className="border-gray-200 rounded-md placeholder-gray-500 w-full px-3 py-2 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-md bg-blue-500 text-gray-100 hover:bg-blue-700"
            disabled={Boolean(pendingForm)}
          >
            {pendingForm ? verbify(action) : action}
          </button>
        </div>
        <textarea
          name="mdContent"
          className="w-full h-full rounded-md bg-transparent resize-none focus:outline-none"
          value={mdContent}
          onChange={(e) => setMdContent(e.currentTarget.value)}
        />
      </Form>
      <div className="p-6 ml-72">
        <div
          className="prose m-auto"
          dangerouslySetInnerHTML={{
            __html: marked(mdContent),
          }}
        />
      </div>
    </div>
  );
}
