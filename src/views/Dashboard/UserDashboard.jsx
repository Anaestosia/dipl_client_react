import React, {useState, useContext, useEffect} from "react";
import GridContainer from "../../components/Grid/GridContainer";
import GridItem from "../../components/Grid/GridItem";
import Card from "../../components/Card/Card";
import CardHeader from "../../components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import Table from "../../components/Table/Table";
import {useWorkers} from "../../hooks/useWorkers";
import SortBar from "../../components/SortSearch/SortBar";
import SearchedBar from "../../components/SortSearch/SearchedBar";
import WorkerService from "../../API/WorkerService";
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import CheckBox from "@material-ui/icons/CheckBox";
import ExposurePlus1 from "@material-ui/icons/ExposurePlus1";
import WAModal from "./Modals/WAModal"

import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import PremiumForScoreService from "../../API/PremiumForScoreService";

import CircularProgress from '@material-ui/core/CircularProgress';
import {AuthContext} from "../../contexts/AuthContext";
import AchivModal from "./Modals/AchivModal";



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

const UserDashboard = (props) =>{

    const { classes } = props;

    const {currentUserId} = useContext(AuthContext)

    const [workers, setWorkers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState('')
    const searchedWorkers = useWorkers(workers, query, sort)
    const [minPremium, setMinPremium] = useState(null)

    const [waAdded, setWaAdded] = useState(false)

    useEffect(()=>{
        const fetchWorkers = async ()=>{
            try{
                const response = await WorkerService.getByMangerId(currentUserId)
                console.log(response.data.data)
                setWorkers(response.data.data.data)
                setIsLoading(false)
            }
            catch(e){
                console.log(e) }
            setIsLoading(false)
        }
        const fetchMinPremium = async ()=>{
            try{
                const response = await PremiumForScoreService.getMinimalPremium()
                setMinPremium(response.data.data.data)
            }
            catch(e){
                console.log(e) }
        }
        fetchMinPremium()
        fetchWorkers()



    },[])

    const [open, setOpen] = React.useState(false);
    const [openAchiv, setOpenAchiv] = React.useState(false);
    const [worker, setWorker] = useState(null)

    const handleOpen = (w)=>{
        setWorker(w)
        setOpen(true)
    }

    const handleOpenAchiv = (w)=>{
        setWorker(w)
        setOpenAchiv(true)
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="primary">
                        <GridContainer >
                            <GridItem xs={12} sm={9} md={9} >
                                <h4 className={classes.cardTitleWhite}>Работники</h4>
                                <p className={classes.cardCategoryWhite}>
                                    Информация о работниках Вашего отдела
                                </p>
                            </GridItem>
                            <GridItem xs={12} sm={3} md={3}>
                                <p>
                                Баллы минимальной премии: <b>{minPremium ? minPremium.attributes.score : null}</b>
                                </p>
                            </GridItem>
                        </GridContainer>
                    </CardHeader>

                    {
                        isLoading ?
                            <>
                                <CardBody >
                                    <GridContainer >
                                        <CircularProgress color="inherit" style={{marginLeft: "500px", marginTop: "50px"}} />
                                    </GridContainer>
                                </CardBody>
                            </>
                            :

                            <CardBody>
                                <GridContainer >
                                    <GridItem xs={12} sm={2} md={2}>
                                        <SearchedBar  query={query} setQuery={setQuery} />
                                    </GridItem>
                                    <GridItem xs={12} sm={3} md={3}>
                                        <SortBar  sort={sort} setSort={setSort} />
                                    </GridItem>
                                </GridContainer>

                                <GridContainer >
                                    {
                                        searchedWorkers.map((w,idx)=>
                                            <GridItem xs={12} sm={4} md={4}>
                                             <Card >
                                                <CardActionArea>
                                                    <CardMedia
                                                        height="200px"
                                                        component="img"
                                                        src={w.meta.image_url}
                                                        title="Contemplative Reptile"
                                                        style={{
                                                            objectFit: "cover"
                                                        }}
                                                    />
                                                    <CardContent>
                                                        <Typography gutterBottom variant="h5" component="h2">
                                                            {w.attributes.first_name+" "+w.attributes.second_name}
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" component="p">

                                                            <GridContainer >
                                                                <GridItem xs={12} sm={4} md={4} style={{fontSize: "12px"}}>
                                                                    Позиция
                                                                </GridItem>
                                                                <GridItem xs={12} sm={8} md={8} style={{fontSize: "11px"}}>
                                                                    { w.relationships.position.meta.position_name}
                                                                </GridItem>

                                                                <GridItem xs={12} sm={4} md={4} style={{fontSize: "12px"}}>
                                                                    Email
                                                                </GridItem>
                                                                <GridItem xs={12} sm={8} md={8} style={{fontSize: "11px"}}>
                                                                    {w.attributes.email}
                                                                </GridItem>

                                                                <GridItem xs={12} sm={4} md={4} style={{fontSize: "12px"}}>
                                                                    Номер:
                                                                </GridItem>
                                                                <GridItem xs={12} sm={8} md={8} style={{fontSize: "11px"}}>
                                                                    {w.attributes.phone_number}
                                                                </GridItem>

                                                                <GridItem xs={12} sm={4} md={4} style={{fontSize: "12px"}}>
                                                                    Опыт:
                                                                </GridItem>
                                                                <GridItem xs={12} sm={8} md={8} style={{fontSize: "11px"}}>
                                                                    {w.attributes.exp}
                                                                </GridItem>

                                                                <GridItem xs={12} sm={4} md={4} style={{fontSize: "12px"}}>
                                                                    Создан:
                                                                </GridItem>
                                                                <GridItem xs={12} sm={8} md={8} style={{fontSize: "11px"}}>
                                                                    {w.attributes.created_at}
                                                                </GridItem>

                                                                <GridItem xs={12} sm={4} md={4} style={{fontSize: "12px"}}>
                                                                    Рейтинг:
                                                                </GridItem>
                                                                <GridItem xs={12} sm={8} md={8} style={{fontSize: "11px"}}>
                                                                    {w.attributes.rating}
                                                                </GridItem>
                                                            </GridContainer>
                                                        </Typography>
                                                    </CardContent>
                                                    <hr style={{marginLeft: "10px", marginRight: "10px"}}/>
                                                </CardActionArea>

                                                <CardActions>
                                                <Tooltip
                                                        id="tooltip-top"
                                                        title="Активные достижения"
                                                        placement="top"
                                                        classes={{ tooltip: classes.tooltip }}
                                                    >
                                                    <IconButton size="small" color="primary" aria-label="upload picture" onClick={()=>{handleOpen(w)}} component="label">
                                                        <CheckBox />
                                                    </IconButton>
                                                </Tooltip>

                                                <Tooltip
                                                    id="tooltip-top"
                                                    title="Добавить достижение"
                                                    placement="top"
                                                    classes={{ tooltip: classes.tooltip }}
                                                >
                                                    <IconButton size="small" color="primary" aria-label="upload picture" onClick={()=>{handleOpenAchiv(w)}} component="label">
                                                        <ExposurePlus1 />
                                                    </IconButton>
                                                </Tooltip>

                                                </CardActions>
                                            </Card>

                                            </GridItem>
                                                )
                                    }
                                </GridContainer>
                            </CardBody>
                    }
                </Card>
            </GridItem>
            <WAModal open={open} setOpen={setOpen} w={worker} minPremium={minPremium} waAdded={waAdded} setWaAdded={setWaAdded} />
            <AchivModal open={openAchiv} setOpen={setOpenAchiv} w={worker} setWaAdded={setWaAdded} waAdded={waAdded} />
        </GridContainer>
    )


}

export default withStyles(styles)(UserDashboard);
