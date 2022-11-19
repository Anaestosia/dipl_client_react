import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import AddBox from '@material-ui/icons/AddBox';
import CardBody from "../../../components/Card/CardBody";
import GridContainer from "../../../components/Grid/GridContainer";
import CircularProgress from '@material-ui/core/CircularProgress';
import AchievementService from "../../../API/AchievementService";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";


import Snackbar from '@material-ui/core/Snackbar';

import WorkerAchievementService from "../../../API/WorkerAchievementService";


export default function AchivModal({open, setOpen, w, setWaAdded, waAdded}) {

    const [wa, setWa] = useState([])
    const [load, setLoad] = useState(true)

    const [openSuccess, setOpenSuccess] = useState(false)
    const [openError, setOpenError] = useState(false)
    const [achs, setAchs] = useState([])
    const [achivId, setAchivId] = useState(1)


    useEffect(()=>{
        setLoad(true)
        const fetchAchs = async ()=>{
            try{
                const response = await AchievementService.getAll()
                console.log(response.data.data.data)
                setAchs(response.data.data.data)
                setLoad(false)
            }
            catch(e){
                console.log(e)
                setLoad(false)
            }
        }
        fetchAchs()

    },[w])

    const notify_success = ()=>{
        setOpenSuccess(true)
        setTimeout( ()=>{
                setOpenSuccess(false)
            }, 4000
        );
    }

    const notify_error = ()=>{
        setOpenError(true)
        setTimeout( ()=>{
                setOpenError(false)
            }, 4000
        );
    }

    const addAch = ()=>{
        const createAch = async ()=>{
            try{
                let ach = {worker_id: w.id, achiv_id: achivId}
                const response = await WorkerAchievementService.createAch(ach)
                console.log(response.data, "HERE", "\n\n")
                if(response.data.status === 'error')
                {
                    notify_error()
                }
                else
                {
                    if(waAdded)
                    {setWaAdded(false)}
                    else
                    {setWaAdded(true)}
                    notify_success()
                }
            }
            catch(e){
                notify_error()
            }
        }
        createAch()
    }

    return (
        <>
            {
                w ?
                    load ?
                        <CardBody >
                            <GridContainer >
                                <CircularProgress color="inherit" style={{marginLeft: "500px", marginTop: "50px"}} />
                            </GridContainer>
                        </CardBody>
                        :
                        <div>
                            <Dialog
                                open={open}
                                onClose={()=>setOpen(false)}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">{"Добавить достижение " + w.attributes.first_name+" "+w.attributes.second_name}</DialogTitle>
                                <DialogContent>

                                    <FormControl >
                                        <InputLabel id="demo-controlled-open-select-label">Достижение</InputLabel>
                                        <Select
                                            labelId="demo-controlled-open-select-label"
                                            id="demo-controlled-open-select"
                                            value={achivId}
                                            onChange={e=>setAchivId(e.target.value)}
                                            style={{width: "380px"}}
                                        >
                                            {
                                                achs.map((a)=>
                                                    <MenuItem value={a.id}>
                                                        {a.attributes.name}-{a.attributes.points}
                                                    </MenuItem>
                                                )
                                            }
                                        </Select>
                                    </FormControl>

                                </DialogContent>
                                <DialogActions>
                                    <IconButton size="small" color="primary" aria-label="upload picture" onClick={()=>addAch()} component="label">
                                        <AddBox />
                                    </IconButton>
                                    <Snackbar anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }} message="Готово" open={openSuccess}  onClose={()=>setOpenSuccess(false)} />

                                    <Snackbar anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}  open={openError}  onClose={()=>setOpenError(false)} message="Ошибка при содании, проверьте уникальность достижения среди активных" />


                                    <Button onClick={()=>setOpen(false)} color="primary" autoFocus>
                                        Закрыть
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    :
                    null
            }
        </>
    );
}
