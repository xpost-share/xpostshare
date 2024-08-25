"use client";

import { useEffect, useState, useMemo } from "react";

import { IoChevronBackCircleOutline } from "react-icons/io5";

import Image from "next/image";

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

export default function DialogBuy({ open, handleOpen, post }) {
  const [topicsChecker, setTopicsChecker] = useState(() =>
    post.sub_topics.map((topic) => ({
      id: topic.id,
      subTopic: topic,
      isCheck: true,
    }))
  );
  const [selectedTopics, setSelectedTopics] = useState(post.sub_topics);

  const handleCheck = (id) => {
    const newTopicsChecker = topicsChecker.map((topic) => {
      if (topic.id === id) {
        return {
          ...topic,
          isCheck: !topic.isCheck,
        };
      }

      return topic;
    });

    const selected = newTopicsChecker.filter((topic) => topic.isCheck);
    setSelectedTopics(selected.map((topic) => topic.subTopic));
    setTopicsChecker(newTopicsChecker);
  };

  const TotalPrice = useMemo(() => {
    console.log("selectedTopics: ", selectedTopics);
    return selectedTopics.reduce((total, topic) => total + topic.price, 0);
  }, [selectedTopics]);

  const handleSelectX = (condition) => {
  
    const newTopicsChecker = topicsChecker.map((topic) => {
      return {
        ...topic,
        isCheck: condition,
      };
    });

    setSelectedTopics(newTopicsChecker.map((topic) => topic.subTopic));
    setTopicsChecker(newTopicsChecker);
  }

  return (
    <>
      <Dialog
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        size="xl"
        className="rounded-sm bg-[#F8C895]"
      >
        <DialogHeader className="flex justify-between items-center pt-5 mx-[1.5%]">
          <button
            onClick={handleOpen}
            className="hover:opacity-70 duration-300 transition-all ease-in"
          >
            <IoChevronBackCircleOutline size={40} />
          </button>
          <h1 className="text-4xl font-bold">CHECKOUT</h1>
          <IoChevronBackCircleOutline className="opacity-0" size={40} />
        </DialogHeader>
        <DialogBody className="flex justify-between items-center pb-10 pt-3">
          <div className="h-[500px] max-h-[500px] p-5 rounded-sm bg-white w-full mx-[2%] flex flex-col gap-3">
            <h1 className="text-2xl pl-2 font-semibold text-black">
              Sub Topics
            </h1>
            <div className="flex flex-col  max-h-[450px] gap-2 items-center overflow-y-auto p-1">
              {topicsChecker.map((topic) => (
                <div
                  key={topic.id}
                  className="w-full border-2 border-amber-700/50 flex items-center justify-between px-5 py-1.5 rounded-sm shadow-md"
                >
                  <h1 className="w-[50%] text-black break-words line-clamp-2 leading-5">
                    {topic.subTopic.subtopic_header}
                  </h1>
                  <h1 className="py-1 border-2 w-20 text-center overflow-hidden text-xs border-brown-400 px-3 bg-[#ffa00821] text-black rounded-full">
                    Rp{topic.subTopic.price.toLocaleString('de-DE')}
                  </h1>
                  <div
                    onClick={() => handleCheck(topic.id)}
                    className="relative w-5 h-5 border-2 flex items-center justify-center border-black/50 cursor-pointer rounded-md"
                  >
                    {topic.isCheck && (
                      <div
                        onClick={() => handleCheck(topic.id)}
                        className="w-5 h-5 rotate-45 absolute hover:bg-green-400 duration-200 transition-all ease-in bg-green-600 outline-1 outline-white outline rounded-sm"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-4 mx-1">
              <button onClick={() => handleSelectX(true)} className="hover:text-black transition duration-300 ease-in cursor-pointer">select all</button>
              <button onClick={() => handleSelectX(false)} className="hover:text-black transition duration-300 ease-in cursor-pointer">clear all</button>
            </div>
          </div>
          <div className="h-[500px] max-h-[500px] p-5 bg-white rounded-sm w-full mx-[2%] flex flex-col gap-3">
            <h1 className="text-2xl font-semibold text-black">Order Summary</h1>
            <div className="flex flex-col gap-2">
              <h1 className="text-lg text-black font-medium max-w-full break-words leading-5 line-clamp-2">
                {post.title}
              </h1>
              <div className="mt-1 w-full h-0.5 rounded-full bg-[#F8C895]" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold text-black">Sub Total</h1>
              <div className="flex flex-col overflow-y-auto p-1 h-[200px] gap-1">
                {selectedTopics.map((topic,idx) => (
                  <div key={topic.id} className="flex justify-between w-full max-w-full">
                    <h2 className="leading-4 text-black line-clamp-2 break-words w-[70%]">
                      {topic.subtopic_header}
                    </h2>
                    <h2 className="text-black">Rp{topic.price.toLocaleString('de-DE')}</h2>
                  </div>
                ))}
              </div>
              <div className="mt-1 w-full h-0.5 rounded-full bg-[#F8C895]" />
            </div>
            <div className="w-full flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-black">Total</h1>
              <h2 className="text-black">Rp{TotalPrice.toLocaleString('de-DE')}</h2>
            </div>
            <Button className="bg-[#871400]">BUY</Button>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
}
