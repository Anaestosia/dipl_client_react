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
import WAModal from "./Modals/WAModal"
import { makeStyles } from '@material-ui/core/styles';


import CircularProgress from '@material-ui/core/CircularProgress';



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



const AdminDashboard = (props) =>{

    const { classes } = props;

    const [workers, setWorkers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [query, setQuery] = useState('')
    const [sort, setSort] = useState('')
    const searchedWorkers = useWorkers(workers, query, sort)


    useEffect(()=>{
        const fetchWorkers = async ()=>{
            try{
                const response = await WorkerService.getAll()
                console.log(response.data.data)
                setWorkers(response.data.data.data)
                setIsLoading(false)
            }
            catch(e){
                console.log(e) }
            setIsLoading(false)
        }
        fetchWorkers()



    },[])

    const [open, setOpen] = React.useState(false);
    const [worker, setWorker] = useState(null)

    const handleOpen = (w)=>{
        setWorker(w)
        setOpen(true)
    }

    return (
        <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
                <Card>
                    <CardHeader color="primary">
                        <GridContainer >
                            <GridItem xs={12} sm={5} md={5} >
                                <h4 className={classes.cardTitleWhite}>Все работники</h4>
                                <p className={classes.cardCategoryWhite}>
                                    Информация о работниках всех отделов
                                </p>
                            </GridItem>
                            <GridItem xs={12} sm={5} md={5}>
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


                                {
                                    searchedWorkers.length === 0 ?
                                        <>
                                        <Table
                                            tableHeaderColor="primary"
                                            tableHead={["№", "Email", "Полное имя", "Номер", "Опыт", "Должность", "Отдел",
                                                "Начальник", "Создан", "Рейтинг",
                                                <CheckBox color="primary"/>
                                            ]}
                                            tableData={[
                                                ["-","-","-","-","-","-","-","-","-","-","-",]
                                            ]}
                                        />
                                        </>
                                    :
                                        <Table
                                            tableHeaderColor="primary"
                                            tableHead={["№", "Email", <div style={{fontSize: "11px"}}>Полное имя</div>, "Номер", "Опыт", "Должность", "Отдел",
                                                "Начальник", "Создан",
                                                <Tooltip
                                                    id="tooltip-top"
                                                    title="Кол-во баллов / время в компании"
                                                    placement="top"
                                                    classes={{ tooltip: classes.tooltip }}
                                                >
                                                <div style={{fontSize: "12px"}}>
                                                    Рейт
                                                </div>
                                                </Tooltip>
                                                ,
                                                <Tooltip
                                                    id="tooltip-top"
                                                    title="Активные достижения"
                                                    placement="top"
                                                    classes={{ tooltip: classes.tooltip }}
                                                    style={{marginLeft: "13px"}}
                                                >
                                                    <CheckBox color="success" />
                                                </Tooltip>

                                            ]}
                                            tableData={
                                                searchedWorkers.map((w, idx)=>
                                                    [
                                                        idx+1,
                                                        <div style={{fontSize: "11px"}}>{w.attributes.email}</div>,
                                                        w.attributes.first_name+" "+w.attributes.second_name,
                                                        <div style={{fontSize: "11px"}}>{w.attributes.phone_number}</div>,
                                                        w.attributes.exp,
                                                        w.relationships.position.meta.position_name,
                                                        w.relationships.departament.meta.departament_name,
                                                        w.meta.chief_email,
                                                        w.attributes.created_at,
                                                        <b>{w.attributes.rating}</b>,
                                                        <IconButton color="primary" aria-label="upload picture" onClick={()=>{handleOpen(w)}} component="label">
                                                            <CheckBox />
                                                        </IconButton>
                                                    ]
                                                )
                                            }
                                        />

                                }
                            </CardBody>
                    }
                </Card>
            </GridItem>
            <WAModal open={open} setOpen={setOpen} w={worker} minPremium={0} />
        </GridContainer>
    )


}

export default withStyles(styles)(AdminDashboard);
