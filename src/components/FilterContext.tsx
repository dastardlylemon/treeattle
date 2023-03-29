import { createContext, useContext, useState, ReactNode } from "react";
import { Genus, Owner } from "../types/filters";

interface FilterContextValue {
  genuses: Genus[];
  setGenuses: (genuses: Genus[]) => void;
  owner: Owner;
  setOwner: (owner: Owner) => void;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

function FilterContextProvider({ children }: { children?: ReactNode }) {
  const [genuses, setGenuses] = useState([
    Genus.ACER,
    Genus.PRUNUS,
    Genus.CRATAEGUS,
  ]);
  const [owner, setOwner] = useState(Owner.ALL);
  return (
    <FilterContext.Provider value={{ genuses, setGenuses, owner, setOwner }}>
      {children}
    </FilterContext.Provider>
  );
}

function useFilterContext() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error(
      "useFilterContext must be used within a FilterContextProvider"
    );
  }
  return context;
}

export { FilterContextProvider, useFilterContext };
