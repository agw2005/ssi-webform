import Primitive from "../components/Primitive.tsx";
import FilterSection from "../components/FilterSection.tsx";
import FilterStatus from "../components/FilterStatus.tsx";
import FilterEmployee from "../components/FilterEmployee.tsx";
import FilterDateRange from "../components/FilterDateRange.tsx";
import FilterPagingRange from "../components/FilterPagingRange.tsx";
import Search from "../components/Search.tsx";

const Home = () => {
  return (
    <Primitive>
      <div className="flex justify-between">
        <div className="flex gap-2">
          <FilterSection />
          <FilterStatus />
          <FilterEmployee />
          <FilterDateRange />
          <FilterPagingRange />
        </div>
        <Search />
      </div>
      <ul>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
        <li>z</li>
      </ul>
    </Primitive>
  );
};

export default Home;
