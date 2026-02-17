const Search = () => {
  return (
    <div className="flex">
      <input
        type="search"
        id="search"
        name="search"
        placeholder="Search"
        className="text-xs lg:text-sm xl:text-base | h-8 lg:h-9 xl:h-10 | px-2 lg:px-3 xl:px-4 | border rounded-l-4xl py-2 outline-none"
      />
      <button
        type="button"
        className="text-xs lg:text-sm xl:text-base | h-8 lg:h-9 xl:h-10 | px-2 lg:px-3 xl:px-4 | py-2 border rounded-r-4xl hover:text-white hover:bg-black hover:border-black"
      >
        Search
      </button>
    </div>
  );
};

export default Search;
