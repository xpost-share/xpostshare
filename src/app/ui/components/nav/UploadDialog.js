"use client";

import { useState, useEffect } from "react";
import { TagsInput } from "react-tag-input-component";

import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Tooltip,
} from "@material-tailwind/react";

import { FaAngleLeft } from "react-icons/fa";
import { IoImages } from "react-icons/io5";

export default function UploadDialog({
  mainTitle,
  mainDesc,
  subTopics,
  changePrice,
}) {
  const [activeTab, setActiveTab] = useState("sub");
  const [open, setOpen] = useState(false);

  const [coverImage, setCoverImage] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [recievePrice, setRecievePrice] = useState(0);
  const [buyerPrice, setBuyerPrice] = useState(0);

  const [isFocused, setIsFocused] = useState(false);

  const len = Object.keys(subTopics).length;

  const isNotAllFilled = () => {
    const mainTopic = mainTitle.trim() === "" || mainDesc.trim() === "";

    const subTopic = () => {
      if (len === 1) return true;

      return Object.keys(subTopics).some((key) => {
        if (key === "default") return false;

        const topic = subTopics[key];

        // Check if title is empty
        const isTitleEmpty = !topic.title || topic.title.trim() === "";

        // Check if content is empty
        const isContentEmpty = () => {
          const cont =
            !topic.content ||
            (Object.keys(topic.content).length === 0 &&
              topic.content.constructor === Object);

          if (!cont) {
            return topic.content.blocks.length === 0;
          }

          return cont;
        };

        return isTitleEmpty || isContentEmpty();
      });
    };

    if (len === 1) return mainTopic;

    return mainTopic || subTopic();
  };

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => setIsFocused(false);

  const handlePriceChange = (e, id) => {
    let value = e.target.value;

    if (value === "") value = "0";

    if (/^\d*\.?\d*$/.test(value)) {
      changePrice(id, parseFloat(value));

      const totalPrice = Object.keys(subTopics).reduce(
        (sum, key) => sum + (subTopics[key].price || 0),
        0
      );

      setRecievePrice(totalPrice);

      setBuyerPrice(totalPrice + totalPrice * 0.25);
    }
  };

  const handleOnePriceChange = (e, which) => {
    if (/^\d*\.?\d*$/.test(e.target.value) && e.target.value !== "") {
      if (which === "recieve") {
        setRecievePrice(parseFloat(e.target.value));
        setBuyerPrice(
          parseFloat(e.target.value) + parseFloat(e.target.value) * 0.25
        );
      } else {
        setBuyerPrice(parseFloat(e.target.value));
        setRecievePrice(parseFloat(e.target.value) / 1.25);
      }
    } else {
      setRecievePrice(0);
      setBuyerPrice(0);
    }
  };

  const formatPrice = (price) => {
    if (!price) return "0.00";
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.includes("image")) {
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload an image file");
    }
  };

  const handleOpen = () => setOpen(!open);

  const handlePostUpload = () => {
    if (!coverImage) {
      alert("Please upload a cover image");
      return;
    }

    const subWithOutDefault = Object.keys(subTopics).reduce((acc, key) => {
      if (key !== "default") {
        acc[key] = subTopics[key];
      }

      return acc;
    }, {});

    const data = {
      title: mainTitle,
      description: mainDesc,
      cover: coverImage,
      tags: selectedTags,
      subTopics: subWithOutDefault,
      priceMethod: activeTab,
      recievePrice: recievePrice,
      buyerPrice: buyerPrice,
    };

    console.log(data);
  };

  const sections = [
    {
      label: "Sub Topics",
      value: "sub",
      bodi: (
        <div className="w-full flex flex-col gap-4 min-h-96">
          <div
            className={`max-h-[20rem] h-[20rem] overflow-y-auto flex flex-col gap-2 items-center ${
              len === 1 ? "justify-center" : ""
            }
          }`}
          >
            {Object.keys(subTopics).map((key) => {
              const { title } = subTopics[key];

              if (len === 1) {
                return (
                  <h1
                    key="default"
                    className="text-xl text-black font-bold cursor-pointer hover:text-amber-500/90 duration-300 transition-colors ease-linear"
                    onClick={handleOpen}
                  >
                    Add a sub topic
                  </h1>
                );
              }
              if (key !== "default" || (title && title.trim() !== "")) {
                return (
                  <div
                    key={key}
                    className="w-full py-2 px-5 bg-white border-b-2 border-black/50  flex justify-between gap-3 items-center rounded-md"
                  >
                    <h1
                      className={`text-base font-medium  w-[90%] line-clamp-2 break-words ${
                        !title || title.trim() === ""
                          ? "text-gray-600"
                          : "text-black"
                      }`}
                    >
                      {!title || title.trim() === "" ? "Sub Topic " + 1 : title}
                    </h1>
                    <input
                      type="text"
                      value={
                        isFocused
                          ? subTopics[key].price
                          : formatPrice(subTopics[key].price)
                      }
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      onChange={(e) => handlePriceChange(e, key)}
                      className="py-1.5 overflow-x-auto px-4 bg-[rgba(255,160,8,0.07)] w-[30%] outline-[#ff9d0079] text-black outline outline-2 rounded-full"
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
          <div className="bg-amber-300/10 p-5 rounded-3xl shadow-sm w-full flex items-center justify-evenly">
            <div className="flex flex-col items-center gap-2">
              <label htmlFor="price" className="text-lg text-black font-bold">
                You Recieved
              </label>
              <input
                id="price"
                value={formatPrice(recievePrice)}
                type="text"
                disabled={true}
                className="w-full rounded-full bg-[#FFFFF0] outline outline-2 outline-[#848408] text-sm py-1.5 px-4 text-black"
                placeholder="Input Price"
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <label htmlFor="buy" className="text-lg text-black font-bold">
                Buyer Pays
              </label>
              <input
                id="buy"
                value={formatPrice(buyerPrice)}
                disabled={true}
                type="text"
                className="w-full rounded-full bg-[#FFFFF0] outline outline-2 outline-[#848408] text-sm py-1.5 px-4 text-black"
                placeholder="Input Price"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "One Price",
      value: "one",
      bodi: (
        <div>
          <div className="bg-amber-300/10 p-5 rounded-3xl shadow-sm w-full flex items-center justify-evenly">
            <div className="flex flex-col items-center gap-2">
              <label htmlFor="price" className="text-lg text-black font-bold">
                You Recieved
              </label>
              <input
                type="text"
                value={isFocused ? recievePrice : formatPrice(recievePrice)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={(e) => handleOnePriceChange(e, "recieve")}
                className="w-full rounded-full bg-[#FFFFF0] outline outline-2 outline-[#848408] text-sm py-1.5 px-4 text-black"
              />
            </div>
            <div className="flex flex-col items-center gap-2">
              <label htmlFor="buy" className="text-lg text-black font-bold">
                Buyer Pays
              </label>
              <input
                id="buy"
                type="text"
                value={isFocused ? buyerPrice : formatPrice(buyerPrice)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={(e) => handleOnePriceChange(e, "buy")}
                className="w-full rounded-full bg-[#FFFFF0] outline outline-2 outline-[#848408] text-sm py-1.5 px-4 text-black"
              />
            </div>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div>
      <Dialog
        open={open}
        handler={handleOpen}
        size="xxl"
        className="py-5 px-10 bg-white/90 backdrop-blur-lg"
      >
        <DialogHeader className="flex items-start pb-0">
          <button
            onClick={handleOpen}
            className="p-1 border-2 border-black rounded-full hover:opacity-75 transition-opacity ease-in duration-400"
          >
            <FaAngleLeft size={20} />
          </button>
        </DialogHeader>
        <DialogBody className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-5 items-center mx-[10%]">
            <div
              onClick={() => document.getElementById("cover").click()}
              className="w-[30rem] bg-black/60 rounded-lg h-64 flex flex-col items-center justify-center gap-5 cursor-pointer "
            >
              {coverImage ? (
                <img
                  src={coverImage}
                  alt="cover"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <>
                  <IoImages size={60} color="white" />
                  <h1 className="text-xl text-white font-bold">
                    Click to upload cover image
                  </h1>
                </>
              )}
              <input
                id="cover"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <div className="w-full flex flex-col gap-7 ">
              <h1 className="text-3xl line-clamp-2 leading-9 w-full font-bold text-black">
                {mainTitle}
              </h1>
              <p className="w-full font-light leading-5 line-clamp-6 text-justify text-xl text-black">
                {mainDesc}
              </p>
              <TagsInput
                value={selectedTags}
                onChange={setSelectedTags}
                name="tags"
                placeHolder="Add a tag"
              />
            </div>
          </div>
          <div className="flex flex-col items-center w-full h-full gap-5">
            <div className="w-full bg-white/5 shadow-md py-4 SubTopBg rounded-md">
              <Tabs value={activeTab}>
                <TabsHeader
                  className="rounded-none border-b flex justify-center border-blue-gray-50 bg-transparent p-0"
                  indicatorProps={{
                    className:
                      "bg-transparent mx-[20%] border-b-4 border-amber-700 shadow-none rounded-none",
                  }}
                >
                  {sections.map(({ label, value }) => (
                    <Tab
                      key={value}
                      value={value}
                      onClick={() => setActiveTab(value)}
                      className={`
                                          ${
                                            activeTab === value
                                              ? "text-amber-700 text-2xl"
                                              : "text-xl font-bold"
                                          }
                                           hover:text-amber-400 transition-all duration-300 ease-out
                                        `}
                    >
                      {label}
                    </Tab>
                  ))}
                </TabsHeader>
                <TabsBody>
                  {sections.map(({ value, bodi }) => (
                    <TabPanel key={value} value={value}>
                      {bodi}
                    </TabPanel>
                  ))}
                </TabsBody>
              </Tabs>
            </div>
            <Button
              color="blue"
              buttonType="filled"
              size="lg"
              block={false}
              rounded={true}
              ripple="light"
              className="w-full"
              onClick={handlePostUpload}
            >
              Upload
            </Button>
          </div>
        </DialogBody>
      </Dialog>
      {isNotAllFilled() ? (
        <Tooltip
          placement="bottom"
          content="Fill all fields to upload"
          className="text-black bg-white/80 shadow-md"
          size="regular"
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0, y: 25 },
          }}
        >
          <button
            disabled={true}
            className="bg-blue-400 opacity-50 text-white text-lg py-1 px-3 rounded-xl font-medium upBtn transition-shadow duration-500 ease-out"
          >
            Upload
          </button>
        </Tooltip>
      ) : (
        <button
          className="bg-blue-400 text-white text-lg py-1 px-3 rounded-xl font-medium upBtn transition-shadow duration-500 ease-out"
          onClick={handleOpen}
        >
          Upload
        </button>
      )}
    </div>
  );
}
