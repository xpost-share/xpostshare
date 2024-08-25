"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { extractSlugFromURL } from "@/app/utils";
import { Avatar, Button } from "@material-tailwind/react";
import { FaCommentDots, FaStar, FaRegBookmark } from "react-icons/fa";

import DialogBuy from "@/app/ui/components/view/DialogBuy";

import { CgMenuLeft } from "react-icons/cg";

import dynamic from "next/dynamic";
let Output = dynamic(() => import("editorjs-react-renderer"), { ssr: false });

import Nav from "@/app/ui/components/nav/Nav";
import Image from "next/image";

export default function PostPage() {
  const params = usePathname();
  const slug = extractSlugFromURL(params);
  const [post, setPost] = useState<Post | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(!open);

  const isPostPriced = () => {
    if (post) {
      return post.total_price > 0;
    }
    return false;
  };

  const formatPrice = (price: number) => {
    if (!price) return "0.00";
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const fetchPostDetails = async (slug: string) => {
    const res = await fetch("/data/posts.json");
    const data = await res.json();
    const thisPost = data.data.find((post: Post) => post.slug === slug);
    setPost(thisPost);
  };

  useEffect(() => {
    fetchPostDetails(slug);
  }, [slug]);

  useEffect(() => {
    console.log("Post:", post);
  }, [post]);

  if (!post) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  const CustomListRenderer = ({
    data,
    style,
    classNames,
    config,
  }: {
    data: any;
    style: any;
    classNames: any;
    config: any;
  }) => {
    const isItOrdered = () => {
      return data.style === "ordered";
    };

    return isItOrdered() ? (
      <ol className="list-decimal pl-10 text-sm md:text-lg lg:text-xl font-light text-justify w-full break-words">
        {data.items.map((item: any, index: number) => (
          <li key={index} className={classNames.item}>
            {item}
          </li>
        ))}
      </ol>
    ) : (
      <ul className="list-disc pl-10 text-sm md:text-lg lg:text-xl font-light text-justify w-full break-words">
        {data.items.map((item: any, index: number) => (
          <li key={index} className={classNames.item}>
            {item}
          </li>
        ))}
      </ul>
    );
  };

  const renderers = {
    list: CustomListRenderer,
  };

  const style = {
    paragraph:
      "text-sm md:text-lg lg:text-xl font-light text-justify w-full break-words",
    header: {
      h1: "font-extrabold text-lg md:text-xl lg:text-2xl",
      h2: "font-bold text-base md:text-lg lg:text-xl",
      h3: "font-semibold text-sm md:text-base lg:text-lg",
      h4: "font-medium text-xs md:text-sm lg:text-base",
      h5: "font-normal text-xs md:text-sm lg:text-base",
      h6: "font-light text-xs md:text-sm lg:text-base",
    },
    list: {
      container:
        "list-disc pl-5 text-sm md:text-lg lg:text-xl font-light text-justify w-full break-words",
    },
  };

  return (
    <div>
      <Nav />
      <main className="min-h-screen w-full bg-white">
        <div className="fixed z-50 top-28 left-4">
          <CgMenuLeft
            size={30}
            className="cursor-pointer"
            // onClick={toggleMenu}
          />
          {/* {openMenu && (
            <div className="p-8 -translate-y-8 bg-white shadow-md max-w-80 w-80 rounded-sm flex items-start flex-col gap-4">
              <FaCircleArrowLeft
                size={30}
                className="cursor-pointer hover:opacity-70 transition-all duration-200 ease-in-out"
                onClick={toggleMenu}
              />
              <h1
                onClick={() => handleScrollTo("main-topic")}
                className={`${
                  mainTitle !== "" ? "text-black" : "text-gray-600"
                } text-base transition-all duration-200 ease-in-out font-extrabold leading-5 mb-1 break-words cursor-pointer hover:text-amber-600 line-clamp-2 w-full`}
              >
                {mainTitle !== "" ? mainTitle : "Main Topic"}
              </h1>
              <div className="flex flex-col items-start gap-1 w-full">
                {Object.keys(subTopics).map((subId) => (
                  <h2
                    key={subId}
                    onClick={() => handleScrollTo(subId)}
                    className={`text-sm transition-all duration-200 ease-in-out hover:text-amber-600 cursor-pointer font-semibold leading-5 break-words line-clamp-2 w-full ${
                      subTopics[subId]?.title ? "text-black" : "text-gray-600"
                    } `}
                  >
                    {subTopics[subId]?.title !== ""
                      ? subTopics[subId]?.title
                      : "Sub Topic " +
                        (Object.keys(subTopics).indexOf(subId) + 1)}
                  </h2>
                ))}
              </div>
            </div>
          )} */}
        </div>
        <DialogBuy open={open} handleOpen={handleOpen} post={post} />
        <div className="flex flex-col gap-12 pt-28 pb-16 mx-4 md:mx-[15%] lg:mx-[15%]">
          <h1 className="font-extrabold text-xl md:text-3xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="leading-3 font-light text-xs md:text-sm lg:text-xl text-justify w-full break-words">
            {post.summary}
          </p>
          <div className="p-5 flex flex-col gap-6 max-w-full mx-[1%] bg-white con rounded-sm">
            <div className="flex items-center justify-between">
              <div className="flex gap-5 items-center">
                <div className="flex items-center gap-3">
                  <Avatar
                    size="lg"
                    src={post.user.image}
                    placeholder="Avatar Placeholder"
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                    withBorder={true}
                    className="p-0.5"
                  />
                  <p className="text-base font-medium line-clamp-1">
                    {post.user.first_name}
                  </p>
                </div>
                <div className="h-10  w-[1px] bg-black rounded-xl" />
                <p className="text-base font-medium line-clamp-1">
                  {post.read_time} min read
                </p>
                <div className="h-10  w-[1px] bg-black rounded-xl" />
                <p className="text-base font-medium line-clamp-1">
                  {post.created_at.split(" ")[0]}
                </p>
              </div>
              <div className="flex items-center gap-5">
                <Button
                  color="green"
                  size="md"
                  variant="gradient"
                  onClick={handleOpen}
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  Buy
                </Button>
                {isPostPriced() ? (
                  <p className="text-base py-2 px-3 rounded-xl bg-amber-800/80 shadow-md font-medium line-clamp-1 text-white">
                    Rp{formatPrice(post.total_price)}
                  </p>
                ) : (
                  <p className="text-base py-2 px-3 rounded-xl bg-amber-800/80 shadow-md font-medium line-clamp-1 text-white">
                    Free
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-5 justify-center bg-[#FF8400]/10 px-10 py-3 mx-[25%] rounded-xl ">
              <FaRegBookmark className="text-2xl text-black-500" />
              <div className="flex items-center gap-2">
                <FaStar className="text-2xl text-yellow-600 drop" />
                <p className="text-sm text-black">{post.count.ratings}</p>
              </div>
              <div className="flex items-center gap-2">
                <FaCommentDots className="text-2xl text-cyan-300" />
                <p className="text-sm text-black">{post.count.comments}</p>
              </div>
            </div>
          </div>
          {post.sub_topics.map((topic, index) =>
            topic.is_premium ? (
              <div className="h-80 w-full bg-[#871400] relative">
                <div className="absolute top-0 left-1/2 transform z-10 -translate-x-1/2 -translate-y-1/2">
                  <div className="h-10 w-[calc(100vw-20px)] bg-[#871400]" />
                </div>
                <div className="flex flex-col gap-1 items-center justify-center h-full absolute w-[calc(100vw-20px)] left-1/2 transform -translate-x-1/2 bg-orange-500">
                  <p className="text-white text-3xl font-bold mb-5 drop-shadow-lg">
                    {topic.subtopic_header}
                  </p>
                  <p className="text-white text-6xl font-bold">
                    THIS SECTION IS LOCKED
                  </p>
                  <p className="text-white text-2xl font-medium">
                    Buy this section for Rp{formatPrice(topic.price)} to unlock
                  </p>
                  <Button
                    size="md"
                    color="green"
                    variant="gradient"
                    className="mt-3"
                    onClick={handleOpen}
                    placeholder=""
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    Buy
                  </Button>
                </div>
                <div className="absolute bottom-0 left-1/2 z-10 transform -translate-x-1/2 translate-y-1/2">
                  <div className="h-10 w-[calc(100vw-20px)] bg-[#871400]" />
                </div>
              </div>
            ) : (
              <div key={index} className="flex flex-col ">
                <h2 className="font-bold text-lg md:text-2xl lg:text-3xl">
                  {topic.subtopic_header}
                </h2>
                <div>
                  <Output
                    data={topic.content}
                    classNames={style}
                    renderers={renderers}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
