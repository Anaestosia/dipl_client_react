/* eslint-disable */
import React, {useState, useEffect} from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
import AddAlert from "@material-ui/icons/AddAlert";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";
import Snackbar from '@material-ui/core/Snackbar';
import CheckBox from "@material-ui/icons/CheckBox";
import Cancel from "@material-ui/icons/Cancel";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import AchievementService from "../../API/AchievementService";
import AttachMoney from '@material-ui/icons/AttachMoney';
import Avatar from '@material-ui/core/Avatar';
import BidService from "../../API/BidService";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import WorkerService from "../../API/WorkerService";
import SearchedBar from "../../components/SortSearch/SearchedBar";
import SortBar from "../../components/SortSearch/SortBar";
import BidSort from "../../components/SortSearch/BidSort";
import {useBids} from "../../hooks/useBids";

const styles = {
    cardCategoryWhite: {
        "&,& a,& a:hover,& a:focus": {
            color: "rgba(255,255,255,.62)",
            margin: "0",
            fontSize: "14px",
            marginTop: "0",
            marginBottom: "0"
        },
        "& a,& a:hover,& a:focus": {
            color: "#FFFFFF"
        }
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        "& small": {
            color: "#777",
            fontSize: "65%",
            fontWeight: "400",
            lineHeight: "1"
        }
    }
};

const TableList = (props) => {
    const { classes } = props;
    const [ach, setAch] = useState([])
    const [isLoad, setIsLoad] = useState(true)
    const [bids, setBids] = useState([])

    const [openSuccess, setOpenSuccess] = useState(false)
    const [openError, setOpenError] = useState(false)
    const [sort, setSort] = useState("")
    const sortedBids = useBids(bids,sort)


    useEffect(()=>{
            const fetchBids = async ()=>{
                try{
                    const response = await BidService.getAll()
                    setBids(response.data.data.data)
                    console.log(response.data.data.data)
                    setIsLoad(false)
                }
                catch(e){
                    console.log(e)
                    setIsLoad(false)
                }
            }

            fetchBids()
        }
        ,[])

    const textStatus = (s) => {
        if(s === 0){
            return "Отказано"
        }else if(s === 1){
            return "Рассматривается"
        }else
        {
            return "Выплачена"
        }
    }

    const setColor = (s) => {
        if(s === 1){
            return "danger"
        } else if (s == 2 )
        {
            return "success"
        }else {
            return "info"
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

    const applyBid = (id) => {
        const apply = async ()=>{
            try{
                const response = await BidService.applyBid(id)
                console.log(response.data)

                if(response.data.status === 'error')
                {
                    notify_error()
                }
                else
                {
                    setBids(bids.map((obj)=>{

                        if(obj.id === id)
                        {
                            return response.data.data.data
                        }
                        return obj
                    }))
                    notify_success()
                }
            }
            catch(e){
                notify_error()
            }
        }
        apply()
    }

    const rejectBid = (id) => {
        const apply = async ()=>{
            try{
                const response = await BidService.rejectBid(id)
                console.log(response.data)

                if(response.data.status === 'error')
                {
                    notify_error()
                }
                else
                {
                    setBids(bids.map((obj)=>{

                        if(obj.id === id)
                        {
                            return response.data.data.data
                        }
                        return obj
                    }))
                    notify_success()
                }
            }
            catch(e){
                notify_error()
            }
        }
        apply()
    }



    return(
        <Card>
            <CardHeader color="success">
                <h4 className={classes.cardTitleWhite}>Заявки на премию</h4>
                <p className={classes.cardCategoryWhite}>
                    Заявки на зачисление премии работникам отделов
                </p>
            </CardHeader>
            <CardBody>
                <GridContainer >
                    <GridItem xs={12} sm={3} md={3}>
                        <BidSort sort={sort} setSort={setSort} />
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    {
                        isLoad ?
                            "Загрузка..."
                            :
                            sortedBids.length === 0 ?
                                "Заявок не найдено"
                                :
                            sortedBids.map((b)=>
                                <>
                                    <GridItem xs={12} sm={12} md={4}>
                                        <Card >
                                            <CardHeader color="info" stats icon style={{color: "black"}}>
                                                <GridContainer>
                                                    <GridItem xs={12} sm={3} md={3}>
                                                                <>
                                                                    <CardIcon color={setColor(b.attributes.status)} style={{color: "white"}}>
                                                                    <AttachMoney />
                                                                    </CardIcon>
                                                                    <Avatar
                                                                    style={{marginTop: "80px", marginLeft: "10px"}}
                                                                    src={b.relationships.worker.meta.w_image_url}
                                                                    />
                                                                </>


                                                    </GridItem>

                                                    <GridItem xs={12} sm={9} md={9}>
                                                        <p className={classes.cardCategory}>
                                                            Премия <b>{b.relationships.worker.meta.w_first_name} {b.relationships.worker.meta.w_second_name}</b>

                                                        </p>
                                                        В размере: <h2 className={classes.cardTitle}>{b.meta.amount}$</h2>
                                                    </GridItem>

                                                </GridContainer>
                                            </CardHeader>
                                            <CardBody>
                                                <GridContainer >
                                                    <GridItem xs={12} sm={5} md={5} >
                                                        Должность:
                                                    </GridItem>
                                                    <GridItem xs={12} sm={7} md={7} >
                                                        { b.relationships.worker.meta.w_position }
                                                    </GridItem>

                                                    <GridItem xs={12} sm={5} md={5} >
                                                        Статус:
                                                    </GridItem>
                                                    <GridItem xs={12} sm={7} md={7} >
                                                        { textStatus(b.attributes.status) }
                                                    </GridItem>

                                                    <GridItem xs={12} sm={5} md={5} >
                                                        Resolved:
                                                    </GridItem>
                                                    <GridItem xs={12} sm={7} md={7} >
                                                        { b.attributes.resolved_at ?
                                                            b.attributes.resolved_at
                                                            :
                                                            "-"
                                                        }
                                                    </GridItem>

                                                    <GridItem xs={12} sm={5} md={5} >
                                                        Создана:
                                                    </GridItem>
                                                    <GridItem xs={12} sm={7} md={7} >
                                                        { b.attributes.created_at}
                                                    </GridItem>

                                                </GridContainer>
                                            </CardBody>
                                            <CardFooter stats>
                                                {
                                                    b.attributes.status === 1 ?
                                                        <>
                                                            <Tooltip
                                                                id="tooltip-top"
                                                                title="Выплатить"
                                                                placement="top"
                                                                classes={{ tooltip: classes.tooltip }}
                                                            >
                                                                <IconButton size="lg" color="primary" aria-label="upload picture" onClick={()=>{applyBid(b.id)}} component="label">
                                                                    <CheckBox  color="primary" />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip
                                                                id="tooltip-top"
                                                                title="Отказать"
                                                                placement="top"
                                                                classes={{ tooltip: classes.tooltip }}
                                                            >
                                                                <IconButton size="lg" aria-label="upload picture" onClick={()=>{rejectBid(b.id)}} component="label">
                                                                    <Cancel  />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                        :
                                                        null
                                                }



                                            </CardFooter>
                                        </Card>
                                    </GridItem>
                                </>
                            )
                    }
                </GridContainer>
                <Snackbar anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }} message="Готово" open={openSuccess}  onClose={()=>setOpenSuccess(false)} />

                <Snackbar anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}  open={openError}  onClose={()=>setOpenError(false)} message="Ошибка при изменении, попробуйте позже" />
            </CardBody>
        </Card>
    );

}

export default withStyles(styles)(TableList);
