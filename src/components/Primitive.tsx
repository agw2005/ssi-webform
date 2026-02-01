import ForexInformation from "./ForexInformation";

interface PrimitiveProps {
  children: React.ReactNode;
}

const NAVIGATIONS = [
  { name: "Webform", link: "#" },
  { name: "Home", link: "#" },
  { name: "Submit Form", link: "#" },
  { name: "Approval Menu", link: "#" },
  { name: "Budget", link: "#" },
  { name: "Account", link: "#" },
];

const Primitive = ({ children }: PrimitiveProps) => {
  return (
    <div className="bg-yellow-600/25 min-h-screen pb-16">
      <nav className="flex justify-between bg-black text-white pl-8 sticky inset-0">
        <div className="flex gap-10 my-4">
          {NAVIGATIONS.map((navigation, index) => {
            return (
              <a href={navigation.link} key={index}>
                {navigation.name}
              </a>
            );
          })}
        </div>
        <div className="flex">
          <ForexInformation />
          <div className="px-8 hover:bg-white hover:text-black active:bg-gray-800 active:text-white flex items-center">
            <p className="select-none">User</p>
          </div>
        </div>
      </nav>
      <main className="mx-16 mt-16 bg-white p-4">{children}</main>
    </div>
  );
};

export default Primitive;
