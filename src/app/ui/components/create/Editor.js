import { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Paragraph from "@editorjs/paragraph";
import List from "@editorjs/list";
import AttachesTool from "@editorjs/attaches";
import Embed from "@editorjs/embed";
import LinkTool from "@editorjs/link";
import ImageTool from "@editorjs/image";
import Marker from "@editorjs/marker";
import { title } from "process";

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
              console.log("Article data: ", outputData);
            });
          }
        },
        holder: editorId,
        tools: {
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          marker: {
            class: Marker,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+M",
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              unordered: true,
              ordered: true,
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                uploadByFile(file) {
                  return new Promise((resolve) => {
                    const reader = new FileReader();

                    reader.onload = function (event) {
                      const base64String = event.target.result;

                      // Store the Base64 string or Blob URL temporarily
                      const imageSource = base64String; // You can choose to store this in local storage, state, or wherever needed

                      // Return the Base64 string or Blob URL as the temporary URL
                      resolve({
                        success: 1,
                        file: {
                          url: imageSource, // This will be a Base64 string or Blob URL
                        },
                      });
                    };

                    reader.readAsDataURL(file); // Convert the file to a Base64 string
                  });
                },
                uploadByUrl(url) {
                  return new Promise((resolve) => {
                    // Store the URL temporarily
                    const imageUrl = url; // You can store this in local storage, state, or wherever needed

                    // Return the URL as the temporary file location
                    resolve({
                      success: 1,
                      file: {
                        url: imageUrl, // This will be the original URL
                      },
                    });
                  });
                },
              },
            },
          },
          attaches: {
            class: AttachesTool,
            config: {
              uploader: {
                uploadByFile(file) {
                  return new Promise((resolve) => {
                    const reader = new FileReader();

                    reader.onload = function (event) {
                      const base64String = event.target.result; 
                      
                      console.log(file);

                      // Store the Base64 string or Blob URL temporarily
                      const fileSource = base64String; // You can choose to store this in local storage, state, or wherever needed

                      // Return the Base64 string or Blob URL as the temporary URL
                      resolve({
                        success: 1,
                        file: {
                          url: fileSource, // This will be a Base64 string or Blob URL
                          name: file.name,
                          extension: file.type.split("/")[1],
                          size: file.size,
                        },
                      });
                    };

                    reader.readAsDataURL(file); // Convert the file to a Base64 string
                  });
                },
              },
            },
          },
          embed: {
            class: Embed,
            inlineToolbar: true,
            config: {
              services: {
                youtube: true,
                coub: true,
                facebook: true,
                instagram: true,
                twitter: true,
                codepen: true,
                codesandbox: true,
                github: true,
                twitch: true,
                vimeo: true,
              },
            },
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
    <div>
      <div id={editorId}></div>
    </div>
  );
}
