import React, {useState, useEffect} from "react"
import CustomInput from "../../components/CustomInput/CustomInput";
import Button from "../../components/CustomButtons/Button";
import Search from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

const BidSort = ({sort,setSort})=> {

    return(
        <>
            <FormControl fullWidth >
                <InputLabel id="demo-simple-select-label" >Сортировка</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={sort}
                    label="Сортировка"
                    onChange={e => setSort(e.target.value) }
                >
                    <MenuItem value={"created_at"}>По дате создания</MenuItem>
                    <MenuItem value={"created_at_rev"}>По дате создания возр.</MenuItem>
                    <MenuItem value={"status"}>По статусу</MenuItem>
                </Select>
            </FormControl>
        </>
    )
}
export default BidSort
