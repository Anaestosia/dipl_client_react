import {useMemo} from "react";

export const useSortedWorkers = (units, sort) => {
    const sortedUnits = useMemo(() => {
        if(sort) {
            if(!sort.localeCompare("rating"))
            {
                return [...units].sort((a, b) =>
                    a.attributes.rating - b.attributes.rating ).reverse()
            }
            else if(!sort.localeCompare("created_at"))
            {
                return [...units].sort((a, b) => a.attributes.created_at.localeCompare(b.attributes.created_at)).reverse()
            }
            else if(!sort.localeCompare("created_at_rev"))
            {
                return [...units].sort((a, b) => a.attributes.created_at.localeCompare(b.attributes.created_at))
            }
            else return [...units].sort((a, b) => a.relationships.departament.meta.departament_name.localeCompare(b.relationships.departament.meta.departament_name))
        }
        return units;
    }, [sort, units])

    return sortedUnits;
}


export const useWorkers = (units, query, sort) => {
    const sortedUnits = useSortedWorkers(units, sort);

    const resultUnits = useMemo(() => {
        let q = query.toLowerCase()
        return sortedUnits.filter(unit =>
            unit.attributes.first_name.toLowerCase().includes(q)
            ||
            unit.attributes.second_name.toLowerCase().includes(q)
            ||
            unit.attributes.email.toLowerCase().includes(q)
            ||
            unit.relationships.departament.meta.departament_name.toLowerCase().includes(q)
            ||
            unit.relationships.position.meta.position_name.toLowerCase().includes(q)
            ||
            unit.meta.chief_email.toLowerCase().includes(q)
        )
    }, [query, sortedUnits])

    return resultUnits;
}
