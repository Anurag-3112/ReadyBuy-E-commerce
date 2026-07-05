import FilterBar from "../components/FilterBar";
import SearchInput from "../components/SearchInput";

const CategoryFilters = ({
    search,
    setSearch,
}) => {

    return (

        <FilterBar>

            <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search Categories..."
            />

        </FilterBar>

    );

};

export default CategoryFilters;