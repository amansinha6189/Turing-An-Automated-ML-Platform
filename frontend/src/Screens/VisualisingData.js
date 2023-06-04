import React , {useState, useEffect} from 'react'
import axios from 'axios'
import {Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement,PointElement,LineElement, RadialLinearScale,Filler} from 'chart.js' 
import { Bar , Bubble, Doughnut, Line, Pie, Scatter, PolarArea, Radar} from  'react-chartjs-2'
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Row,
    Col,
  } from 'reactstrap';
  import PropTypes from 'prop-types';
  import BarChartIcon from '@mui/icons-material/BarChart';
  import PieChartIcon from '@mui/icons-material/PieChart';
  import TimelineIcon from '@mui/icons-material/Timeline';
  import DonutLargeIcon from '@mui/icons-material/DonutLarge';
  import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
  import BubbleChartIcon from '@mui/icons-material/BubbleChart';
  import AutoGraphIcon from '@mui/icons-material/AutoGraph';
  import RadarIcon from '@mui/icons-material/Radar';
  import {csv} from "csvtojson";
  import Papa from "papaparse";
  import randomColor from 'randomcolor';
// import {makeStyles} from '@mui/styles';


 ChartJS.register(
    RadialLinearScale,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler,
 );



const VisualisingData = () => {

    const [chart,setChart]=useState([])
    const [data, setData] = useState([]);
    const [graphType, setGraphType] = useState("");
    const [xColumn, setXColumn] = useState('')
    const [yColumn, setYColumn] = useState('')
    const [columns, setColumns] = useState([]);
    const [l, setL] = useState(0)

    const handleXColumnChange = (value) => {
        setXColumn(value);
      };
    
      const handleYColumnChange = (value) => {
        setYColumn(value);
      };

    
useEffect(() => {
        const fetchData = async () => {
            const response = await axios.post("http://127.0.0.1:8000/api/getData/");
            const csvData = response.data;
            const jsonData = await new Promise((resolve) =>
              Papa.parse(csvData, {
                header: true,
                complete: (results) => resolve(results.data),
              })
            );
            setData(jsonData);
            setColumns(Object.keys(jsonData[0]));
            setL(jsonData.length)
          };
    fetchData();
},[])
const colors = new Array(5000).fill().map(() => randomColor());
console.log(colors.slice(1, l))
console.log(l)

const chartOptions = {
    responsive: true,
  };


console.log(columns)

console.log("chart", chart);
 
const generateChartData = () => {
    const labels = data.map((row) => row[xColumn]);
    const dataValues = data.map((row) => row[yColumn]);
    console.log(labels);
    console.log(dataValues);

    switch (graphType) {
      case "bar":
        return {
          labels,
          datasets: [
            {
              label: xColumn,
              backgroundColor: colors.slice(0, l).map((color) => `${color}3A`),
              borderColor: colors.slice(0, l),
              borderWidth: 2,
              data: dataValues,
            },
          ],
        };
      case "line":
        return {
          labels,
          datasets: [
            {
              label: xColumn,
              backgroundColor: colors.slice(0, l).map((color) => `${color}3A`),
              borderColor: colors.slice(0, l),
              borderWidth: 2,
              fill: false,
              data: dataValues,
            },
          ],
        };
        case "pie":
      return {
        labels,
        datasets: [
          {
            label: "Pie chart",
            backgroundColor: colors.slice(0, l).map((color) => `${color}3A`),
            borderColor: colors.slice(0, l),
            borderWidth: 2,
            data: dataValues,
          },
        ],
      };
    case "doughnut":
      return {
        labels,
        datasets: [
          {
            label: "<CHART_LABEL>",
            backgroundColor: colors.slice(0, l).map((color) => `${color}3A`),
            borderColor: colors.slice(0, l),
            borderWidth: 2,
            data: dataValues,
          },
        ],
      };
    case "scatter":
      return {
        labels,
        datasets: [
          {
            label: "<CHART_LABEL>",
            backgroundColor: colors.slice(0, l).map((color) => `${color}5A`),
            borderColor: colors.slice(0, l),
            borderWidth: 5,
            data: dataValues,
          },
        ],
      };
    case "polarArea":
      return {
        labels,
        datasets: [
          {
            label: "<CHART_LABEL>",
            backgroundColor: colors.slice(0, l).map((color) => `${color}3A`),
            borderColor: colors.slice(0, l),
            borderWidth: 2,
            data: dataValues,
          },
        ],
      };
    case "bubble":
      return {
        labels,
        datasets: [
          {
            label: "<CHART_LABEL>",
            backgroundColor: colors.slice(0, l).map((color) => `${color}3A`),
            borderColor: colors.slice(0, l),
            borderWidth: 5,
            data: dataValues,
          },
        ],
      };
    case "radar":
      return {
        labels,
        datasets: [
          {
            label: "<CHART_LABEL>",
            backgroundColor: colors.slice(0, l).map((color) => `${color}3A`),
            borderColor: colors.slice(0, l),
            borderWidth: 4,
            data: dataValues,
          },
        ],
      };
    case "horizontalBar":
      return {
        labels,
        datasets: [
          {
            label: "<CHART_LABEL>",
            backgroundColor: "<CHART_BACKGROUND_COLOR>",
            data: dataValues,
          },
        ],
      }
      // Add more cases for other chart types
      default:
        return {};
    }
  };



  
// -------------------- dropdown work --------------------
    const [graphDropdownOpen, setGraphDropdownOpen] = useState(false);
    const [xDropdownOpen, setXDropdownOpen] = useState(false);
    const [yDropdownOpen, setYDropdownOpen] = useState(false);
    const [selectedGraphOption, setSelectedGraphOption] = useState('');
  
    const graphToggle = () => setGraphDropdownOpen(prevState => !prevState);
    const XToggle = () => setXDropdownOpen(prevState => !prevState);
    const YToggle = () => setYDropdownOpen(prevState => !prevState);
  
    const handleSelectGraphOption = (option) => {
      setSelectedGraphOption(option);
      setGraphType(option)
      console.log(selectedGraphOption);
    };


  return (
    <div> 
    
            <Row className="d-flex justify-content-between align-items-center">
                <Col md = {4}>
                    <Dropdown isOpen={graphDropdownOpen} toggle={graphToggle}>
                    <DropdownToggle className="bg-dark text-white">
                        {selectedGraphOption || `Choose a Graph`}
                    </DropdownToggle>
                    <DropdownMenu dark>
                        <DropdownItem onClick={() => handleSelectGraphOption('line')}>Line Graph <TimelineIcon /></DropdownItem>
                        <DropdownItem onClick={() => handleSelectGraphOption('bar')}>Bar Graph <BarChartIcon /></DropdownItem>
                        <DropdownItem onClick={() => handleSelectGraphOption('doughnut')}>Doughnut Graph <DonutLargeIcon/></DropdownItem>
                        <DropdownItem onClick={() => handleSelectGraphOption('pie')}>Pie Graph 
                        <PieChartIcon/></DropdownItem>
                        <DropdownItem onClick={() => handleSelectGraphOption('polarArea')}>Polar Area Graph
                        <PieChartIcon/></DropdownItem>
                        <DropdownItem onClick={() => handleSelectGraphOption('scatter')}>Scatter Plot
                        <ScatterPlotIcon/></DropdownItem>
                        <DropdownItem onClick={() => handleSelectGraphOption('bubble')}>Bubble Chart
                        <BubbleChartIcon/></DropdownItem>
                        <DropdownItem onClick={() => handleSelectGraphOption('radar')}>Radar Chart
                        <RadarIcon/></DropdownItem>
                    </DropdownMenu>
                    </Dropdown>
                </Col>
                <Col md = {4}>
                    <Dropdown isOpen={xDropdownOpen} toggle={XToggle}>
                    <DropdownToggle className="bg-dark text-white">
                        {xColumn || `Choose X Column`}
                    </DropdownToggle>
                    <DropdownMenu dark>
                        {columns.map((column) => (
                            <DropdownItem value = {column} onClick={() => handleXColumnChange(column)}>{column}</DropdownItem>
                        ))}
                    </DropdownMenu>
                    </Dropdown>
                </Col>
                <Col md = {4}>
                    <Dropdown isOpen={yDropdownOpen} toggle={YToggle}>
                    <DropdownToggle className="bg-dark text-white">
                        {yColumn || `Choose Y Column`}
                    </DropdownToggle>
                    <DropdownMenu dark>
                        {columns.map((column) => (
                            <DropdownItem value = {column} onClick={() => handleYColumnChange(column)}>{column}</DropdownItem>
                        ))}
                    </DropdownMenu>
                    </Dropdown>
                </Col>
                
            </Row>
        
       
        
        <Row>
            {/* <Col></Col> */}
            <div >
              <Col>
              {selectedGraphOption === 'line' ? 
                      <div>
                          <Line
                          data ={generateChartData()}
                          height={100}
                          options={chartOptions}
                          />
                      </div>
                      : 
                      selectedGraphOption === 'bar'?  
                      <div>
                          <Bar
                          data ={generateChartData()}
                          height={100}
                          options={chartOptions}
                          />
                      </div>
                      :
                      selectedGraphOption === 'doughnut'?
                      
                      <div style={{ width: "650px", height: "650px" }}>
                          <Doughnut
                          data ={generateChartData()}
                          height={50}
                          options={chartOptions}
                          />
                      </div>
                      :
                      selectedGraphOption === 'pie'?
                      <div style={{ width: "650px", height: "650px" }}>
                          <Pie
                          data ={generateChartData()}
                          height={100}
                          options={chartOptions}
                          />
                      </div>
                      :
                      selectedGraphOption === 'polarArea'?
                      <div style={{ width: "650px", height: "650px" }}>
                          <PolarArea
                          data ={generateChartData()}
                          height={400}
                          options={chartOptions}
                          />
                      </div>
                      :
                      selectedGraphOption === 'scatter'?
                      <div style={{ width: "650px", height: "650px" }}>
                          <Scatter
                          data ={generateChartData()}
                          height={400}
                          options={chartOptions}
                          />
                      </div>
                      :
                      selectedGraphOption === 'bubble'?
                      <div style={{ width: "650px", height: "650px" }}>
                          <Bubble
                          data ={generateChartData()}
                          height={400}
                          options={chartOptions}
                          />
                      </div>
                      :
                      selectedGraphOption === 'radar'?
                      <div style={{ width: "650px", height: "650px" }}>
                          <Radar
                          data ={generateChartData()}
                          height={400}
                          options={chartOptions}
                          />
                      </div>
                      :
                      <div></div>
          }
              </Col>
            </div>
            
            {/* <Col></Col> */}
        </Row>
        
    </div>
  )
}

export default VisualisingData 