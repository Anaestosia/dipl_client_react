import {useMemo} from "react";

export const useSortedBids = (units, sort) => {
    const sortedUnits = useMemo(() => {
        if(sort) {
            if(!sort.localeCompare("status"))
            {
                return [...units].sort((a, b) =>
                    a.attributes.status - b.attributes.status ).reverse()
            }
            else if(!sort.localeCompare("created_at"))
            {
                return [...units].sort((a, b) => a.attributes.created_at.localeCompare(b.attributes.created_at)).reverse()
            }
            else if(!sort.localeCompare("created_at_rev"))
            {
                return [...units].sort((a, b) => a.attributes.created_at.localeCompare(b.attributes.created_at))
            }
        }
        return units;
    }, [sort, units])

    return sortedUnits;
}


export const useBids = (units, sort) => {
    const sortedUnits = useSortedBids(units, sort);

    return sortedUnits;
}
