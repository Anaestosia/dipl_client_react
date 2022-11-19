import React, {useContext, useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from "../../../components/Table/Table";
import WorkerAchievementService from "../../../API/WorkerAchievementService";
import CardAvatar from "../../../components/Card/CardAvatar";
import Badge from '@material-ui/core/Badge';
import Paid from '@material-ui/icons/Storage';
import CardBody from "../../../components/Card/CardBody";
import GridContainer from "../../../components/Grid/GridContainer";
import CircularProgress from '@material-ui/core/CircularProgress';
import {AuthContext} from "../../../contexts/AuthContext";
import Tooltip from "@material-ui/core/Tooltip";
import AttachMoney from '@material-ui/icons/AttachMoney';
import IconButton from "@material-ui/core/IconButton";
import BidService from "../../../API/BidService";
import Snackbar from '@material-ui/core/Snackbar';
import WorkerService from "../../../API/WorkerService";

export default function WAModal({open, setOpen, w, minPremium, waAdded, setWaAdded}) {

    const [wa, setWa] = useState([])
    const [sumPoint, setSum] = useState(0)
    const [load, setLoad] = useState(true)
    const [openSuccess, setOpenSuccess] = useState(false)
    const [openError, setOpenError] = useState(false)

    const {isAdmin, currentUserId} = useContext(AuthContext)


    useEffect(()=>{
        setLoad(true)
        const fetchWorkerAchievements = async ()=>{
            try{
                const response = await WorkerAchievementService.getActiveForUser(w.id)
                console.log(response.data.data.data)
                setWa(response.data.data.data)

                let res = response.data.data.data.reduce(function(sum, current) {
                    return sum + current.relationships.achievement.meta.points;
                }, 0);
                setSum(res)
                setLoad(false)
            }
            catch(e){
                console.log(e)
                setLoad(false)
            }
        }
        fetchWorkerAchievements()

    },[w,waAdded])


    const ifPointsGreaterMinScore = (sumPointWorker) => {
        if(sumPointWorker > minPremium.attributes.score){
            return true
        }
        else {
            return false
        }
    }


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

    const createBid = () => {

        const create = async ()=>{
            try{
                let bid = {worker_id: w.id, user_id: currentUserId, sum_points: sumPoint }
                const response = await BidService.create(bid)
                console.log(response.data)

                if(response.data.status === 'error')
                {
                    notify_error()
                }
                else
                {
                    notify_success()
                    const response = await WorkerService.deactiveAchsForWorker(w.id)
                    setWa([])
                    setSum(0)
                }
            }
            catch(e){
                notify_error()
            }
        }
        create()
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
            <DialogTitle id="alert-dialog-title">{"Активные достижения " + w.attributes.first_name+" "+w.attributes.second_name}</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">

                <CardAvatar profile style={{marginTop: "15px"}}>
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                        <img src={ w.meta.image_url} alt="..."  />
                    </a>
                </CardAvatar>

            <Table
            tableHeaderColor="primary"
            tableHead={["№", "Достижение", "Баллы","Создана", "Статус",
            ]}
            tableData={
                wa.map((a, idx)=>
                    [
                        idx+1,
                        a.relationships.achievement.meta.name,
                        a.relationships.achievement.meta.points,
                        a.attributes.created_at,
                        <div style={{color: "green"}}>Aктивная</div>
                    ]
                )
            }
            />
            </DialogContentText>
            </DialogContent>
            <DialogActions>


                {
                    isAdmin || !ifPointsGreaterMinScore(sumPoint) ?
                        null
                        :
                        <>
                        <Tooltip
                            id="tooltip-top"
                            title="Создать заявку на выплату премии"
                            placement="top"
                        >
                            <IconButton size="small" color="primary" aria-label="upload picture" onClick={()=>createBid()} component="label">
                                <AttachMoney />
                            </IconButton>
                        </Tooltip>

                    <Snackbar anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }} message="Готово" open={openSuccess}  onClose={()=>setOpenSuccess(false)} />

                    <Snackbar anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}  open={openError}  onClose={()=>setOpenError(false)} message="Ошибка при содании, попробуйте позже" />
                        </>
                }


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
