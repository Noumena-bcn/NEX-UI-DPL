import React, { useState, useEffect } from "react";
import { Button, Statistic, Progress, Grid } from "semantic-ui-react";

import { useStore } from "../store/useStore.jsx";
//// ---THIS ARE THE VARIABLES I ADDED IN useStore.jsx for interaction values --- ////
//const interaction_values = await fetchJSON("./models/Events/day_01/json/prod_values_01_a.json")
//vals_int : interaction_values.data,
////--------------------------------////

import DropdownIcons from "./DropdownIcons.jsx"
import { Doughnut, Bar } from "react-chartjs-2";


import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    PointElement,
    LineElement, 
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineController,
    BarController,
    plugins,
    Chart,
  } from 'chart.js';
import { Slider } from "@mui/material";


ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement, 
    Tooltip, 
    Legend,
    LineController,
    BarController
    );

export default function Charts(){

    ////--- Setup for flow chart init ---////
    //Interaction values
    const int_values = useStore((state) => state.vals_int);


    //# Tables
    const tableCount = 8; 

    //Parse Timestamp and convert to normal date
    const times = {};
    const times_male = {};
    const times_female = {};

    //Setup to extract interaction counts
    const multi_int_values = [];
    const multi_int_values_male = [];
    const multi_int_values_female = [];

    for (let i = 0; i < 11; i++){
        if (i < 10){
        times[`11:0${i}` ] = [];
        times_male[`11:0${i}`] = [];
        times_female[`11:0${i}`] = [];
        } else {

            times[`11:${i}` ] = [];
            times_male[`11:${i}`] = [];
            times_female[`11:${i}`] = [];

        }

    }

    int_values.forEach((int) => {

        const t_stam = int.timestamp; 
        const timeString = timestamp(t_stam);

        for (let i = 0; i < tableCount; i++ ){
            const table = int[`t_${i}`];;
            const [counts_male, counts_female, counts_ints ] = table.split(";");

            for (const time in times){
                if(timeString.includes(time)){
                    times[time].push(parseFloat(counts_ints));
                    times_male[time].push(parseFloat(counts_male));
                    times_female[time].push(parseFloat(counts_female));
                }
            }
        }
    });


    for (const time in times){

        //Interactions mass addition
        multi_int_values.push(times[time].reduce((total, num) => total + num, 0));
        multi_int_values_male.push(times_male[time].reduce((total, num) => total + num, 0));
        multi_int_values_female.push(times_female[time].reduce((total, num) => total +  num, 0));
        
    }

    ////--- Setup for flow chart ends---////


    ////---- Percentage Values Tables tab Init --- ////
    const percentageMale = [];
    const percentageFemale = [];
    
    for (let i = 0; i < multi_int_values_male.length; i++){

        const sumPerc = multi_int_values_male[i] + multi_int_values_female[i];
        const perc_male = ((multi_int_values_male[i] / sumPerc) * 100).toFixed(2);
        const perc_female = ((multi_int_values_female[i] / sumPerc) * 100).toFixed(2);
        
        percentageMale.push(perc_male);
        percentageFemale.push(perc_female);

    }

    //console.log(percentageDiffs)

    console.log(percentageMale)
    console.log(percentageFemale)
    ////---- Percentage Values Tables tab Ends--- ////


    ////--- Multi-Chart setup Init --- ////

    let labels_test = ['9:00am', 
    '10:00am', 
    '11:00am', 
    '12:00am', 
    '13:00am', 
    '14:00am', 
    '15:00am',
    '16:00am',
    '17:00am',
    '18:00am',
    '19:00am',
    ];

    ///--- Dummy Values in Case is needed ---////
    //const ln_male = [89, 32, 60, 31, 81, 60, 70, 60, 82, 19, 48]
    //const ln_female = [39, 32, 40, 11, 89, 20, 80, 65, 38, 80, 29]
    //const bar_ints = [20, 72, 80, 84, 64, 20, 85, 66, 85, 93, 35]


    //const ln_male = n_values_male
    //const ln_female = n_values_female
    //const bar_ints = n_values


    /// Interaction Values for Multichart
    const ln_male = multi_int_values_male
    const ln_female = multi_int_values_female
    const bar_ints = multi_int_values
    


    ////---Dual Range Slider MUI ---////
    const [ values, setValues ] = useState([0, 11]);
    let [ rangeval, setRangeval ] = useState(labels_test);
    let [ rangemale, setRangeMale ] = useState(ln_male)
    let [ rangefemale, setRangeFemale ] = useState(ln_female)
    let [ rangebars, setRangeBars] = useState(bar_ints)

    
    const handleSliderChange = (event, newValue) => {
        
        const newRangeVal = event.target.value
        let ranValInit = newRangeVal[0]
        let ranValEnd = newRangeVal[1]

        let rangeValue = labels_test.slice(ranValInit, ranValEnd)
        let rangeMale = ln_male.slice(ranValInit, ranValEnd)
        let rangeFemale = ln_female.slice(ranValInit, ranValEnd)
        let rangeBars = bar_ints.slice(ranValInit, ranValEnd)


        setValues(newValue);
        setRangeval(rangeValue);
        setRangeMale(rangeMale);
        setRangeFemale(rangeFemale);
        setRangeBars(rangeBars)
    
    }


    const data_multi = {
        labels: rangeval ,
        datasets: [
          {
            type: 'line',
            /* label: 'Dataset 1', */
            borderColor: 'rgba(62, 44, 176, 0.6)',
            borderWidth: 2,
            fill: false,
            data: rangemale,
          },
          {
            type: 'line',
            /* label: 'Dataset 2', */
            backgroundColor: 'rgba(230, 67, 102, 0.6)',
            borderColor: 'rgba(230, 67, 102, 0.6)',
            borderWidth: 2,
            data: rangefemale,
          },
          {
            type: 'bar',
            label: 'Dataset 3',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            data: rangebars,
          },
        ],
      };


    const options_multi = {
        plugins: {
            legend:{
                display: false,
            },
            
        },  
        animations:false,
    }

    ////--- Multi-Chart setup Ends --- ////


    return <>
    
    <div className="flow_pg"
                hidden={flow_btn}
                style={{
                    position:'absolute',
                    top:'20%', 
                    left:'0%',  
                    height:'80%', 
                    width:'75%',  
                    /* background:'red', 
                    opacity:'0.5' */
                }}
        >

            <div style={{position:'relative', left:'20%', height:'475px'}}>
                <Bar data={data_multi} options={options_multi} height={'280px'} width={'800px'}/>
                <Slider
                    size="small"
                    value={values}
                    sx = {{
                        color:'#FF6161',
                        '& .MuiSlider-thumb':{
                            backgroundColor: '#FFFFFF',
                        },
                        '& .MuiSlider-track': {
                            backgroundColor: '#676767',
                        },
                        '& .MuiSlider-rail': {
                            backgroundColor: '#ddd',
                        }
                    }}
                        onChange={handleSliderChange}
                        min={0}
                        max={11}
                        step={1}
                        marks={[{ value:0 }, {value: 11 }]}
                        getAriaLabel={(index) =>
                            index === 0 ? 'minimum' : 'maximum'
                    }
                    style={{width:'100%'}}/>

                <div style={{position:'relative', top:'5px', display:'flex', justifyContent:'space-around', alignContent:'center', width:'200px', height:'20px', color:'white', background:'transparent'}}>
                    
                    <div style={{position:'relative',top:'4px',width:'45px', height:'18px', background:'rgba(62, 44, 176, 0.6)', fontWeight:'bold', borderRadius:'8px', fontSize:'10px', textAlign:'center', margin: 'auto', padding:'2px'}}>
                        <p>Male</p>
                    </div>

                    <div style={{position:'relative',top:'4px', width:'45px', height:'18px', background:'rgba(230, 67, 102, 0.6)', fontWeight:'bold', borderRadius:'8px', fontSize:'10px', textAlign:'center',  margin: 'auto', padding:'2px'}}>
                        <p>Female</p>
                    </div>

                    <div style={{position:'relative',top:'4px', width:'60px', height:'18px', background:'rgba(230, 230, 230, 0.6)', fontWeight:'bold', borderRadius:'8px', fontSize:'10px', textAlign:'center',  margin: 'auto', padding:'2px'}}>
                        <p>Interaction</p>
                    </div>

                </div>
            </div>

        </div>    
    </>



}


function normalizeArray(arr, min, max){

    const normalized = [];
    const range = max - min; 

    for (let i = 0; i < arr.length; i++){
        const normalizedValue = (arr[i] - min) / range; 
        normalized.push((normalizedValue * 100).toFixed(2))
    }

    return normalized; 


}


function timestamp(t_stam){
    const date = new Date(t_stam * 1000 );
    const year = date.getFullYear(); 
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    const timestring = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return timestring

}