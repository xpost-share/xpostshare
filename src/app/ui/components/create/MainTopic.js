"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

import { Tooltip } from "@material-tailwind/react";
import { GoPlus } from "react-icons/go";

export default function MainTopic({ addSub, setTitle, setDesc }) {
  const [mainTopic, setMainTopic] = useState("");
  const [description, setDescription] = useState("");

  const handleTitle = (e) => {
    setMainTopic(e.target.value);
    setTitle(e.target.value);
  };

  const handleDesc = (e) => {
    setDescription(e.target.value);
    setDesc(e.target.value);
  };

  const [isFocused, setIsFocused] = useState(false);
  const divRef = useRef(null);

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

  function handleTextareaNavigation(e, currentId, targetId) {
    const textarea = e.target;
    const cursorPosition = textarea.selectionStart;

    const isAtFirstLine = cursorPosition === 0;
    const isAtLastLine = cursorPosition === textarea.value.length;

    if (e.key === "ArrowUp" && isAtFirstLine) {
      e.preventDefault();
      document.getElementById(targetId).focus();
    } else if (e.key === "ArrowDown" && isAtLastLine) {
      e.preventDefault();
      document.getElementById(targetId).focus();
    }
  }

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
      className={`p-3 flex flex-col gap-2 w-full relative ${
        isFocused ? "focused-outline" : ""
      }`}
      ref={divRef}
      onClick={() => setIsFocused(true)}
    >
      <textarea
        className="w-full outline-none p-1 font-extrabold text-xl md:text-3xl lg:text-5xl resize-none overflow-hidden"
        placeholder="MAIN TOPIC"
        id="main-topic"
        value={mainTopic}
        onChange={handleTitle}
        rows={1}
        onKeyDown={(e) => {
          handleTextareaNavigation(e, "main-topic", "description");
        }}
      ></textarea>
      <textarea
        className="w-full min-h-16 leading-3 outline-none p-1 font-light text-xs md:text-sm lg:text-xl resize-none overflow-hidden"
        placeholder="Tell me more about your topic..."
        id="description"
        value={description}
        onChange={handleDesc}
        rows={1}
        onKeyDown={(e) => {
          handleTextareaNavigation(e, "description", "main-topic");
        }}
      ></textarea>

      <div
        className={`absolute flex gap-3 bottom-0 z-10 left-1/2 transform -translate-x-1/2 translate-y-1/2 ${
          isFocused ? "block" : "hidden"
        }`}
      >
        <Tooltip
          placement="top"
          content="Add Sub Topic"
          color="lightBlue"
          size="regular"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <button
            className="rounded-full p-2 bg-green-500"
            onClick={() => addSub("main")}
          >
            <GoPlus size={20} color="white" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
