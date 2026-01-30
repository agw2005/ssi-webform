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
    <div className="bg-yellow-600/25 min-h-screen">
      <nav className="flex justify-between bg-black text-white py-4 px-8 sticky inset-0">
        <div className="flex gap-10">
          {NAVIGATIONS.map((navigation, index) => {
            return (
              <a href={navigation.link} key={index}>
                {navigation.name}
              </a>
            );
          })}
        </div>
        <div className="flex gap-10">
          <button type="button">Show Forex</button>
          <button type="button">User</button>
        </div>
      </nav>
      <main className="m-16 bg-white p-4">{children}</main>
    </div>
  );
};

export default Primitive;
