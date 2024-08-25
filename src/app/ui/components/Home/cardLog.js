import { Avatar } from "@material-tailwind/react";
import Link from "next/link";
import { FaCommentDots, FaStar, FaDollarSign } from "react-icons/fa";

export default function CardLog({ post }) {
  const isPostPriced = () => {
    console.log("price: ", post.total_price);
    console.log("is ", post.total_price > 0);
    return post.total_price > 0;
  };

  const formatPrice = (price) => {
    if (!price) return "0.00";
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Link href={`/posts/${post.slug}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer p-5 flex flex-col gap-4">
        <div className="relative w-full h-52 overflow-hidden rounded-md">
          {isPostPriced() && (
            <div className="absolute top-2 right-2 z-10 bg-white/90 shadow-md text-black px-2 py-1 rounded-md flex items-center gap-1">
              <span className="text-sm font-medium">
                Rp {formatPrice(post.total_price)}
              </span>
            </div>
          )}
          <img
            src={post.image_banner}
            alt={post.title}
            className="object-cover object-center h-full w-full transition-transform duration-500 transform hover:scale-105"
          />
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-xl font-semibold leading-snug line-clamp-2">
            {post.title}
          </h1>
          <p className="text-sm text-gray-600 line-clamp-4 text-justify max-h-20 h-20">
            {post.summary}
          </p>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar
              src={post.user.image}
              size="sm"
              className="object-cover object-center p-0.5"
              withBorder={true}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium line-clamp-1">
                {post.user.first_name} {post.user.last_name}
              </span>
              <span className="text-xs text-gray-500">
                {post.created_at.split(" ")[0]}
              </span>
            </div>
          </div>

          <div className="text-sm font-medium text-blue-500">
            {post.read_time} min read
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1">
              <FaCommentDots className="text-blue-400" size={30} />
              <span className="text-base font-medium">
                {post.count.comments}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-500" size={30} />
              <span className="text-base font-medium">
                {post.count.ratings}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {post.categories.map((category) => (
            <span
              key={category.id}
              className="text-xs text-amber-700 border border-amber-700 rounded-full px-3 py-1"
            >
              {category.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
