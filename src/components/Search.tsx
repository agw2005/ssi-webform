const Search = () => {
  return (
    <div className="flex">
      <input
        type="search"
        id="search"
        name="search"
        placeholder="Search"
        className="border rounded-l-4xl h-10 py-2 px-4 outline-none"
      />
      <button
        type="button"
        className="py-2 px-4 h-10 border rounded-r-4xl hover:text-white hover:bg-black hover:border-black"
      >
        Search
      </button>
    </div>
  );
};

export default Search;
