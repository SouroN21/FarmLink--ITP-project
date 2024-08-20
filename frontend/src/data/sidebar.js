import { FaTh, FaRegChartBar, FaCommentAlt , FaCalendarAlt , FaListAlt } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";
import { MdCreate } from "react-icons/md";
import { TbBusinessplan } from "react-icons/tb";

const menu = [
  {
    title: "Dashboard",
    icon: <FaTh />,
    path: "/dashboard",
  },
  {
    title: "Add Product",
    icon: <BiImageAdd />,
    path: "/add-product",
  },
  {
    title: "Orders",
    icon: <TbBusinessplan />,
    path: "/my-orders",
  },
  {
    title: "Account",
    icon: <FaRegChartBar />,
    childrens: [
      {
        title: "Profile",
        path: "/profile",
      },
      {
        title: "Edit Profile",
        path: "/edit-profile",
      },
    ],
  },
  {
    title: "Find an Expert",
    icon: <FaCalendarAlt />,
    path: "/expertlist",
  },
  {
    title: "Appointment List",
    icon: <FaListAlt />,
    path: "/appointment-list",
  },
  {
    title: "Create A Bidding Post",
    icon: <MdCreate />,
    path: "/addBidding",
  },
  {
    title: "Report Bug",
    icon: <FaCommentAlt />,
    path: "/contact-us",
  },
];

export default menu;