"use client";

import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import { RiMenuUnfoldLine } from "react-icons/ri";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { CgMenuLeft } from "react-icons/cg";

import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { auth, db, storage } from "../../../../firebase";
import { getCurrentDate, slugifySentences } from "@/app/utils";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { count } from "console";

import MainTopic from "@/app/ui/components/create/MainTopic";
import Nav from "../../ui/components/nav/Nav";
import SubTopic from "@/app/ui/components/create/SubTopic";

// Default cover photo URL
const defaultCoverPhoto = "../../../../public/OIP.jfif";

interface SubTopic {
  title: string;
  content: object; // You can define a more specific type for content if you have one
  price: number;
}

export default function PostCreate() {
  const [userData, setUserData] = useState<any>({});
  const [coverPhoto, setCoverPhoto] = useState<string>(defaultCoverPhoto); // Initialize with default cover photo
  const [uploading, setUploading] = useState<boolean>(false);
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const toggleMenu = () => setOpenMenu(!openMenu);

  const [mainTitle, setMainTitle] = useState<string>("");
  const [mainDesc, setMainDesc] = useState<string>("");
  const [subTopics, setSubTopics] = useState<{ [key: string]: SubTopic }>({});
  const subTopicRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const mainRef = useRef<HTMLDivElement | null>(null);

  const subIds = Object.keys(subTopics);

  const addSubTopic = (targetId: string) => {
    const newId = `editor-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    console.log(subTopics);

    setSubTopics((prev) => {
      if (prev[targetId]) {
        const index = subIds.indexOf(targetId);

        if (index !== -1) {
          const newKeys = [
            ...subIds.slice(0, index + 1),
            newId,
            ...subIds.slice(index + 1),
          ];

          const reorderedSubTopics: { [key: string]: SubTopic } = {};
          newKeys.forEach((key) => {
            if (key === newId) {
              reorderedSubTopics[key] = {
                title: "",
                content: {},
                price: 0,
              };
            } else {
              reorderedSubTopics[key] = prev[key];
            }
          });

          return reorderedSubTopics;
        }
      }

      return {
        ...prev,
        [newId]: {
          title: "",
          content: {},
          price: 0,
        },
      };
    });

    subTopicRefs.current[newId] = null;
  };

  const removeSubTopic = (id: string) => {
    setSubTopics((prev) => {
      const newSubTopics = { ...prev };
      delete newSubTopics[id];
      return newSubTopics;
    });

    delete subTopicRefs.current[id];
  };

  const handleScrollTo = (id: string) => {
    if (id === "main-topic") {
      mainRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      subTopicRefs.current[id]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const changePrice = (id: string, price: number) => {
    setSubTopics((prev) => {
      const newSubTopics = { ...prev };
      newSubTopics[id].price = price;
      return newSubTopics;
    });
  }
  const PostContent = {
    mainTitle: mainTitle,
    mainDesc: mainDesc,
    subTopics: { default: { title: "", content: {}, price: 0 }, ...subTopics },
    changePrice: changePrice,
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      user ? setUserData(user) : router.back();
    });
  }, [router]);



  const handleFileReader = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (readerEvent) => {
        if (readerEvent.target && readerEvent.target.result) {
          setCoverPhoto(readerEvent.target.result as string);
        }
      };
    } else {
      // Set cover photo to default if no file is selected
      setCoverPhoto(defaultCoverPhoto);
    }
  };

  // const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setUploading(true);
  //   const docRef = await addDoc(collection(db, "posts"), {
  //     author_id: userData.uid,
  //     title,
  //     content,
  //     author_name: userData.displayName,
  //     pub_date: getCurrentDate(),
  //     slug: slugifySentences(title),
  //     comments: [],
  //   });

  //   if (coverPhoto !== defaultCoverPhoto) {
  //     // Only upload if cover photo is not default
  //     const imageRef = ref(storage, `posts/${docRef.id}/image`);
  //     await uploadString(imageRef, coverPhoto, "data_url").then(async () => {
  //       const downloadURL = await getDownloadURL(imageRef);
  //       await updateDoc(doc(db, "posts", docRef.id), {
  //         image_url: downloadURL,
  //       });
  //     });
  //   }

  //   setUploading(false);
  //   alert("Post created successfully!");
  //   router.push("/");
  // };

  return (
    <div>
      <Nav {...PostContent}/>
      <main ref={mainRef} className="bg-[#F6F1E9] min-h-screen flex min-w-full relative">
        <div className="fixed z-50 top-28 left-4">
          <CgMenuLeft
            size={30}
            className="cursor-pointer"
            onClick={toggleMenu}
          />
          {openMenu && (
            <div className="p-8 -translate-y-8 bg-white shadow-md max-w-80 w-80 rounded-sm flex items-start flex-col gap-4">
              <FaCircleArrowLeft
                size={30}
                className="cursor-pointer hover:opacity-70 transition-all duration-200 ease-in-out"
                onClick={toggleMenu}
              />
              <h1
                onClick={() => handleScrollTo("main-topic")}
                className={`${mainTitle !== "" ? 'text-black':'text-gray-600'} text-base transition-all duration-200 ease-in-out font-extrabold leading-5 mb-1 break-words cursor-pointer hover:text-amber-600 line-clamp-2 w-full`}
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
          )}
        </div>
        <div className="bg-white mt-28 mb-12 grid grid-cols-1 gap-3 shadow-md h-full w-full mx-4 md:mx-[15%] lg:mx-[15%] px-8 py-6">
          {/* <button className="bg-black text-white" onClick={saveAllEditors}>
            save
          </button> */}

            <MainTopic
              addSub={addSubTopic}
              setTitle={setMainTitle}
              setDesc={setMainDesc}
            />

          {subIds.map((subId) => (
            <div key={subId} ref={(el) => (subTopicRefs.current[subId] = el)}>
              <SubTopic
                editorId={subId}
                removeSubTopic={removeSubTopic}
                addSubTopic={addSubTopic}
                setSubTopics={setSubTopics}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
