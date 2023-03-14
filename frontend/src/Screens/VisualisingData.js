// import React , {useState, useEffect} from 'react'
// import {Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement,PointElement,LineElement} from 'chart.js' 
// import { Bar , Doughnut, Line, Pie} from  'react-chartjs-2'
// import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
// import {makeStyles} from '@mui/styles';


//  ChartJS.register(
//     Tooltip,
//     Legend,
//     ArcElement,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     PointElement,
//     LineElement
//  );



// const VisualisingData = () => {

//     const [chart,setChart]=useState([])

//     var baseUrl= "https://api.coinranking.com/v2/coins?limit=10"
//     var proxyUrl = 'https://cors-anywhere.herokuapp.com/'
//     var apiKey = "coinranking8f75c71a36414a684b0d2c54e0fb81af40e7d0e2213e9a8b"

// useEffect(() => {
//     const fetchCoins = async () => {
//         await fetch(`${proxyUrl}${baseUrl}`,{
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-access-token': `${apiKey}`,
//                 'Access-Control-Allow-Origin':'*'
//             }
//         }).then((Response) => {
//             Response.json().then((json) => {
//                console.log(json) 
//                setChart(json.data)
//             })
//         }).catch(error => {
//             console.log(error);
//         })
//     }
//     fetchCoins()
// },[baseUrl,proxyUrl,apiKey])

// console.log("chart", chart);
 
// var data = {
//       labels: chart?.coins?.map(x => x.name),
//       datasets: [{
//         label: `${chart?.coins?.length} Coins Available`,
//         data: chart?.coins?.map(x => x.price),
//         backgroundColor:[
//             'rgba(255,99,132,0.2)',
//             'rgba(54,162,235,0.2)',
//             'rgba(255,206,86,0.2)',
//             'rgba(75,192,192,0.2)',
//             'rgba(153,102,255,0.2)',
//             'rgba(255,159,64,0.2)'
//         ],
//         borderColor: [
//         'rgb(255,99,132)',
//         'rgb(54,162,235)',
//         'rgb(255,206,86)',
//         'rgb(75,192,192)',
//         'rgb(153,102,255)',
//         'rgb(255,159,64)'
//         ],
//         borderWidth: 1
//       }]
//     }
// var options = {
//     maintainAspectRatio: false,
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       },
//       legend:{
//         labels:{
//             fontSize:26
//         }
//       }
//     }

//   const [selectedValue, setSelectedValue] = useState('');
//   // const 

//   const handleDropdownChange = (event) => {
//     setSelectedValue(event.target.value);
//     console.log(selectedValue);
//   };

//   return (
//     <div>
//     <div>
//     <FormControl style={{minWidth: 120}}>
//       <InputLabel>CHARTS</InputLabel>
//       <Select value={selectedValue} onChange={handleDropdownChange}>
//         <MenuItem value={'Bar'}>Bar Chart</MenuItem>
//         <MenuItem value={'Doughnut'}>Doughnut Chart</MenuItem>
//         <MenuItem value={'Line'}>Line Chart</MenuItem>
//         <MenuItem value={'Pie'}>Pie Chart</MenuItem>
//       </Select>
//     </FormControl>
// </div>
// <div>
//     <Bar
//     data ={data}
//     height={400}
//     options={options}
//     />
//     </div>
//     </div>
//   )
// }

// export default VisualisingData 