import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import ImageTool from "@editorjs/image";
import AttachesTool from "@editorjs/attaches";
import Embed from "@editorjs/embed";
import LinkTool from "@editorjs/link";

export default function Editor({ editorId, setSavedEditor }) {
  const editorRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  const initEditor = async () => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        minHeight: 40,
        placeholder: "Let's write an awesome story!",
        onChange: async () => {
          if (editorRef.current) {
            editorRef.current.save().then((outputData) => {
              setSavedEditor(outputData);
            });
          }
        },
        holder: editorId,
        tools: {
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: "http://localhost:8008/uploadFile", // Your backend file uploader endpoint
                byUrl: "http://localhost:8008/fetchUrl", // Your endpoint that provides uploading by Url
              },
            },
          },
          attaches: {
            class: AttachesTool,
            config: {
              endpoint: "http://localhost:8008/uploadFile",
            },
          },
          embed: {
            class: Embed,
            inlineToolbar: true,
          },
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "http://localhost:8008/fetchUrl",
            },
          },
        },
      });
      editorRef.current = editor;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initEditor();
    };

    if (isMounted) {
      init();

      return () => {
        if (editorRef.current) {
          editorRef.current.destroy();
        }
      };
    }
  }, [isMounted]);

  return (
    <div className="w-full">
      <div
        id={editorId}
        className="max-w-full font-light text-xs md:text-sm lg:text-xl leading-3"
      ></div>
    </div>
  );
}
