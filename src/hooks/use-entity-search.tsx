import { useEffect,useState } from "react";
import { PAGINATION } from "@/config/constants";
import { set } from "date-fns";


interface UseEntitySearchProps<T extends {
    search: string;
    page: number
}> {
    params: T;
    setParams: (params: T) => void;
    debounceMs? : number;
}


export function useEntitySearch<T extends {
    search: string;
    page: number
}>({
    params,
    setParams,
    debounceMs = 300
}:UseEntitySearchProps<T>) {
    const [debouncedSearch,setDebouncedSearch] = useState(params.search);
    useEffect(() => {
        if(debouncedSearch === "" && params.search !== "") {
            setDebouncedSearch("");
            setParams({...params,search:"",page:PAGINATION.DEFAULT_PAGE});
            return;
        }
        const timer = setTimeout(() => {
            if(params.search !== debouncedSearch) {
                setParams({...params,search:debouncedSearch,page:PAGINATION.DEFAULT_PAGE});
            }
        },debounceMs);
        return () => clearTimeout(timer);
    },[debouncedSearch,params,setParams,debounceMs]);
    
    useEffect(() => {
        setDebouncedSearch(params.search);
    },[params.search]);
    

    return {
        searchValue : debouncedSearch,
        onSearchChange : setDebouncedSearch
    }
}