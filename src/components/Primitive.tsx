import ForexInformation from "./ForexInformation";
import { Link } from "react-router-dom";

interface PrimitiveProps {
  children: React.ReactNode;
}

const NAVIGATIONS = [
  { name: "Webform", link: "/" },
  { name: "Home", link: "/" },
  { name: "Submit Form", link: "/submit" },
  { name: "Approval Menu", link: "#" },
  { name: "Budget", link: "#" },
  { name: "Account", link: "#" },
];

const Primitive = ({ children }: PrimitiveProps) => {
  return (
    <div className="bg-yellow-600/25 min-h-screen pb-16">
      <nav className="pl-2 lg:pl-4 xl:pl-6 2xl:pl-8 | flex justify-between gap-2 bg-black text-white sticky inset-0">
        <div className="gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 | my-1 lg:my-2 xl:my-3 2xl:my-4 | flex flex-wrap items-center text-center ">
          {NAVIGATIONS.map((navigation, index) => {
            return (
              <Link
                to={navigation.link}
                key={index}
                className="hover:text-yellow-300 transition"
              >
                {navigation.name}
              </Link>
            );
          })}
        </div>
        <div className="flex flex-wrap">
          <ForexInformation />
          <div className="px-2 lg:px-4 xl:px-6 2xl:px-8 | bg-black hover:bg-white hover:text-black active:bg-gray-800 active:text-white | flex items-center">
            <p className="select-none">User</p>
          </div>
        </div>
      </nav>
      <main className="mx-4 lg:mx-8 xl:mx-12 2xl:mx-16 | mt-4 lg:mt-8 xl:mt-12 2xl:mt-16 | bg-white p-4">
        {children}
      </main>
    </div>
  );
};

export default Primitive;
