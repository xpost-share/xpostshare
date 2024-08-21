"use client";

import { useState, useEffect, useRef } from "react";

import dynamic from "next/dynamic";
import Editor from "./Editor";

import { GoPlus } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";

import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Tooltip,
  Button,
} from "@material-tailwind/react";

export default function SubTopic({
  editorId,
  removeSubTopic,
  addSubTopic,
  setSubTopics,
}) {
  const [Title, setTitle] = useState("");
  const [savedEditor, setSavedEditor] = useState(null);

  const [isFocused, setIsFocused] = useState(false);
  const divRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const deleteSubTopic = () => {
    removeSubTopic(editorId);
    handleOpen();
  };

  const moveUp = () => {
    setSubTopics((prev) => {
      const subTopicKeys = Object.keys(prev);
      const index = subTopicKeys.indexOf(editorId);

      if (index === 0) return prev; // Already at the bottom, can't move down

      const newSubTopicKeys = [...subTopicKeys];
      const temp = newSubTopicKeys[index - 1];
      newSubTopicKeys[index - 1] = newSubTopicKeys[index];
      newSubTopicKeys[index] = temp;

      const newSubTopics = {};

      newSubTopicKeys.forEach((key) => {
        newSubTopics[key] = prev[key];
      });

      return newSubTopics;
    });
  };

  const moveDown = () => {
    setSubTopics((prev) => {
      const subTopicKeys = Object.keys(prev);
      const index = subTopicKeys.indexOf(editorId);

      if (index === subTopicKeys.length - 1) return prev; // Already at the bottom, can't move down

      const newSubTopicKeys = [...subTopicKeys];
      const temp = newSubTopicKeys[index + 1];
      newSubTopicKeys[index + 1] = newSubTopicKeys[index];
      newSubTopicKeys[index] = temp;

      const newSubTopics = {};

      newSubTopicKeys.forEach((key) => {
        newSubTopics[key] = prev[key];
      });

      return newSubTopics;
    });
  };

  useEffect(() => {
    if (Title || savedEditor) {
      setSubTopics((prev) => {
        const newSubTopics = { ...prev };

        newSubTopics[editorId] = {
          title: Title,
          content: savedEditor,
          price: prev?.price,
        };

        return newSubTopics;
      });
    }
  }, [Title, savedEditor]);
  useEffect(() => {
    const textareas = document.querySelectorAll("textarea");

    if (textareas) {
      const autoResize = (event) => {
        const textarea = event.target;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      };

      textareas.forEach((textarea) => {
        textarea.addEventListener("input", autoResize);
      });

      return () => {
        textareas.forEach((textarea) => {
          textarea.removeEventListener("input", autoResize);
        });
      };
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`p-3 flex flex-col gap-1 w-full relative ${
        isFocused ? "focused-outline" : ""
      }`}
      ref={divRef}
      onClick={() => setIsFocused(true)}
    >
      <textarea
        className="w-full outline-none border-b-2 focus:border-black p-1 font-extrabold text-base md:text-xl lg:text-2xl resize-none overflow-hidden"
        placeholder="SUB TOPIC"
        id="sub-topic"
        value={Title}
        onChange={(e) => setTitle(e.target.value)}
        rows={1}
      ></textarea>

      <Editor editorId={editorId} setSavedEditor={setSavedEditor} />

      <div
        className={`absolute flex gap-10 bottom-0 z-10 left-1/2 transform -translate-x-1/2 translate-y-1/2 ${
          isFocused ? "block" : "hidden"
        }`}
      >
        <Tooltip
          placement="top"
          content="Add Sub Topic"
          className="text-black bg-white/80 shadow-md"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <button
            className="rounded-full p-1 bg-green-500"
            onClick={() => addSubTopic(editorId)}
          >
            <GoPlus size={20} color="white" />
          </button>
        </Tooltip>
      </div>

      <div
        className={`absolute flex flex-col gap-2 bg-white p-2 shadow-md right-0 z-10 top-1/2 transform -translate-y-1/2 translate-x-[110%] ${
          isFocused ? "block" : "hidden"
        }`}
      >
        <Dialog
          open={open}
          handler={handleOpen}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
        >
          <DialogHeader>Delete this Sub Topic.</DialogHeader>
          <DialogBody>
            Are you sure you want to delete this Sub Topic? This action cannot
            be undone.
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleOpen}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="green" onClick={deleteSubTopic}>
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </Dialog>

        <Tooltip
          placement="top"
          content="Move Up"
          className="text-black bg-white/80 shadow-md"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <button
            className="bg-amber-500 shadow-sm rounded-full p-1"
            onClick={moveUp}
          >
            <FaLongArrowAltUp size={20} color="white" />
          </button>
        </Tooltip>
        <Tooltip
          placement="top"
          content="Move Down"
          className="text-black bg-white/80 shadow-md"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <button
            className="bg-amber-500 shadow-sm rounded-full p-1"
            onClick={moveDown}
          >
            <FaLongArrowAltDown size={20} color="white" />
          </button>
        </Tooltip>

        <Tooltip
          placement="top"
          content="Remove Sub Topic"
          className="text-black bg-white/80 shadow-md"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <button
            className="bg-red-500 text-white rounded-full p-1"
            onClick={handleOpen}
          >
            <MdDelete size={20} color="white" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
