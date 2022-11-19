import React, {useState, useEffect} from "react"
import TextField from "@material-ui/core/TextField";

const SearchedBar = ({query, setQuery})=> {

    return(
        <>
            <TextField
                size={"sm"}
                label="Поиск"
                type="search"
                variant="standard"
                className="text-white" style={{marginLeft: "10px"}}
                value={query}
                onChange={(e)=>{ setQuery(e.target.value) }}
            />
        </>
    )
}
export default SearchedBar
