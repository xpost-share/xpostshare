import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Label,
} from "@headlessui/react";
import { Avatar } from "@material-tailwind/react";

import { FaBookmark} from "react-icons/fa6";
import { BsFillPersonFill } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { IoLogOutSharp } from "react-icons/io5";

export default function AvtrDrop({ handleLogout, userName }) {
  return (
    <Menu>
      <MenuButton>
        <Avatar
          src="https://docs.material-tailwind.com/img/face-2.jpg"
          alt="avatar"
          className="avtr transition-shadow duration-500 ease-in-out"
        />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom end"
        className="w-64 origin-top-right z-50 rounded-sm border border-white/5 bg-white py-5 px-8 text-sm/6 text-white transition duration-100 ease-out mt-2 focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 drpdown"
      >
        <MenuItem disabled>
          <div className="flex items-center justify-between pb-2">
            <Avatar
              src="https://docs.material-tailwind.com/img/face-2.jpg"
              alt="avatar"
            />
            <span className="text-black text-lg text-truncate">{userName}</span>
          </div>
        </MenuItem>
        <div className="my-1 h-px bg-amber-500/50" />
        <MenuItem>
          <button className="group justify-between flex w-full items-center gap-2 rounded-sm py-1.5 px-1 data-[focus]:bg-black/10">
            <BsFillPersonFill
              size={40}
              className="bg-gray-500/20 rounded-full p-1"
              color="black"
            />
            <span className="text-black">Edit profile</span>
            <IoIosArrowForward color="black" size={20} />
          </button>
        </MenuItem>
        <MenuItem>
          <button className="group justify-between flex w-full items-center gap-2 rounded-sm py-1.5 px-1 data-[focus]:bg-black/10">
            <div className="bg-gray-500/20 rounded-full">
              <FaBookmark size={40} color="black" className="p-2" />
            </div>
            <span className="text-black">Saved post</span>
            <IoIosArrowForward color="black" size={20} />
          </button>
        </MenuItem>
        <MenuItem>
          <button
            onClick={handleLogout}
            className="group justify-between flex w-full items-center gap-2 rounded-sm py-1.5 px-1 data-[focus]:bg-black/10"
          >
            <IoLogOutSharp
              size={40}
              className="bg-gray-500/20 rounded-full p-1"
              color="black"
            />

            <span className="text-black">Sign out</span>
            <IoIosArrowForward color="black" size={20} />
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
