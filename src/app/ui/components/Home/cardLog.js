import { Avatar } from "@material-tailwind/react";
import Link from "next/link";

import { CiStar } from "react-icons/ci";
import { FaRegCommentDots } from "react-icons/fa";

export default function CardLog({ post }) {
  return (
    <Link href={`/posts/${post.slug}`}>
      <div className="bg-white rounded-md shadow-lg postcard transition-all duration-600 cursor-pointer flex flex-col p-4">
        <div className="grid grid-cols-2 gap-5">
          <div className="w-full h-44">
            <img
              src={post.image_url}
              alt="Post image"
              className="rounded-md object-cover object-center h-full w-full"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-bold leading-7 mb-3 line-clamp-2">
              {post.title}
            </h1>
            <p className="text-xs font-extralight line-clamp-8 text-justify">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
              voluptatibus aut doloribus repudiandae iusto laboriosam,
              molestias, in numquam autem consectetur assumenda maxime quae
              consequuntur odit a totam beatae, eius commodi. Lorem ipsum dolor
              sit amet consectetur adipisicing elit. Magnam voluptatibus aut
              doloribus repudiandae iusto laboriosam, molestias, in numquam
              autem consectetur assumenda maxime quae consequuntur odit a totam
              beatae, eius commodi. Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Magnam voluptatibus aut doloribus repudiandae
              iusto laboriosam, molestias, in numquam autem consectetur
              assumenda maxime quae consequuntur odit a totam beatae, eius
              commodi.
            </p>
          </div>
        </div>
        <div className="flex justify-between mt-4 items-center gap-9">
          <div className="flex gap-2 items-center">
            <Avatar src={"/tst.jpg"} size="sm" />
            <div className="flex flex-col">
              <span className="text-xs font-bold line-clamp-1 w-32">
                {post.author_name}
              </span>
              <span className="text-xs font-extralight">{post.pub_date}</span>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="text-xl">{post.comments.length}</span>
              <FaRegCommentDots className="text-blue-400" size={25} />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl">4.5</span>
              <CiStar className="text-yellow-600" size={30} />
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-amber-400 border-2 rounded-full border-amber-400 px-2">
              Gore
            </span>
            <span className="text-amber-400 border-2 rounded-full border-amber-400 px-2">
              Gore
            </span>
            <span className="text-amber-400 border-2 rounded-full border-amber-400 px-2">
              Gore
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
