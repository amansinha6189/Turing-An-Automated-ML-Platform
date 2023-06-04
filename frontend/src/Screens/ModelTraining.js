import React, { useState } from 'react'
import axios from 'axios'
import { Button, Card, Col, Row } from 'react-bootstrap';
import RandomForestRegression from '../Components/ModelTraining/Regression/RandomForestRegression';
import LinearRegression from '../Components/ModelTraining/Regression/LinearRegression';
import LassoRegression from '../Components/ModelTraining/Regression/LassoRegression';
import DecisionTreeRegression from '../Components/ModelTraining/Regression/DecisionTreeRegression';
import RidgeRegression from '../Components/ModelTraining/Regression/RidgeRegression';
import KNeighborRegression from '../Components/ModelTraining/Regression/KNeighborRegression';
import LogisticRegression from '../Components/ModelTraining/Classification/LogisticRegression';
import SVMRegression from '../Components/ModelTraining/Regression/SVMRegression';
import SVMClassification from '../Components/ModelTraining/Classification/SVMClassification';
import KNeighborClassification from '../Components/ModelTraining/Classification/KNeighborClassification';
import NaiveByes from '../Components/ModelTraining/Classification/NaiveByes';
import RandomForestClassification from '../Components/ModelTraining/Classification/RandomForestClassification';
import DecisionTreeClassification from '../Components/ModelTraining/Classification/DecisionTreeClassification';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import KmeansClusterring from '../Components/ModelTraining/Clusterring/KMeansClusterring';

function ModelTraining() {

  const [targetType, setTargetType] = useState("NonCategorical")
  const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
  
    const toggle = () => setDropdownOpen(prevState => !prevState);
  
    const handleSelectOption = (option) => {
      setSelectedOption(option);
      console.log(selectedOption);
    };
   
  return (
    <div>
      <Row>
        <Col>
          { targetType == "NonCategorical" ?
          <div>
              <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <h3>Regression</h3>
              <DropdownToggle className="bg-dark text-white">
                  {selectedOption || `Choose a Regression Algorithm`}
              </DropdownToggle>
              <DropdownMenu dark>
                  <DropdownItem onClick={() => handleSelectOption('Linear Regression')}>Linear Regression</DropdownItem>
                  <DropdownItem onClick={() => handleSelectOption('Lasso Regression')}>Lasso Regression</DropdownItem>
                  <DropdownItem onClick={() => handleSelectOption('Ridge Regression')}>Ridge Regression </DropdownItem>
                  <DropdownItem onClick={() => handleSelectOption('Decision Tree Regression')}>Decision Tree Regression 
                  </DropdownItem>
                  <DropdownItem onClick={() => handleSelectOption('Random Forest Regression')}>Random Forest Regression
                  </DropdownItem>
                  <DropdownItem onClick={() => handleSelectOption('K Neighbor Regression')}>K Neighbor Regression
                  </DropdownItem>
                  <DropdownItem onClick={() => handleSelectOption('SVM Regression')}>SVM Regression
                  </DropdownItem>
              </DropdownMenu>
              </Dropdown>
          </div>
          : targetType == "Categorical" ?
          <div>
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <h3>Classification</h3>
          <DropdownToggle className="bg-dark text-white">
              {selectedOption || `Choose a Classification Algorithm`}
          </DropdownToggle>
          <DropdownMenu dark>
              <DropdownItem onClick={() => handleSelectOption('Logistic Regression')}>LogisticR egression</DropdownItem>
              <DropdownItem onClick={() => handleSelectOption('SVM Classification')}>SVM Classification</DropdownItem>
              <DropdownItem onClick={() => handleSelectOption('K Neighbor Classification')}>K Neighbor Classification </DropdownItem>
              <DropdownItem onClick={() => handleSelectOption('Naive Byes')}>Naive Byes
              </DropdownItem>
              <DropdownItem onClick={() => handleSelectOption('Random Forest Classification')}>Random Forest Classification
              </DropdownItem>
              <DropdownItem onClick={() => handleSelectOption('Decision Tree Classification')}>Decision Tree Classification
              </DropdownItem>
          </DropdownMenu>
          </Dropdown>
      </div>
    : <div>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <h3>Clusterring</h3>
        <DropdownToggle className="bg-dark text-white">
            {selectedOption || `Choose a Clusterring Algorithm`}
        </DropdownToggle>
        <DropdownMenu dark>
            <DropdownItem onClick={() => handleSelectOption('K Means Clusterring')}>K Means Clustering</DropdownItem>
            <DropdownItem onClick={() => handleSelectOption('DBSCAN')}>DBSCAN</DropdownItem>
            <DropdownItem onClick={() => handleSelectOption('Agglomerative Clustering')}>Agglomerative Clustering </DropdownItem>
            <DropdownItem onClick={() => handleSelectOption('Mean-Shift Clustering')}>Mean-Shift Clustering
            </DropdownItem>
        </DropdownMenu>
        </Dropdown>
      </div>
    }
          
        </Col>
        <Col md = {8} className = 'py-4'>
          <Card style={{
            display:"flex",
            alignContent: "center",
            justifyContent: "center",
            minHeight: '70vh',
            textAlign: 'center',
          }}
          >
            <div className='p-5 m-5'>
            { selectedOption == "Linear Regression" ? <LinearRegression /> 
                : selectedOption == "Lasso Regression" ? <LassoRegression />
                : selectedOption == "Ridge Regression" ? <RidgeRegression />
                : selectedOption == "Decision Tree Regression" ? <DecisionTreeRegression />
                : selectedOption == "Random Forest Regression" ? <RandomForestRegression />
                : selectedOption == "K Neighbor Regression" ? <KNeighborRegression />
                : selectedOption == "SVM Regression" ? <SVMRegression /> 
                
                : selectedOption == "Logistic Regression" ? <LogisticRegression />
                : selectedOption == "SVM Classification" ? <SVMClassification />
                : selectedOption == "K Neighbor Classification" ? <KNeighborClassification />
                : selectedOption == "Naive Byes" ? <NaiveByes />
                : selectedOption == "Random Forest Classification" ? <RandomForestClassification />
                : selectedOption == "Decision Tree Classification" ? <DecisionTreeClassification />

                : selectedOption == "K Means Clusterring" ? <KmeansClusterring /> 
                // : selectedOption == "DBSCAN" ? <DBSCAN /> 
                // : selectedOption == "Agglomerative Clustering" ? <AgglomerativeClustering /> 
                // : selectedOption == "Mean-Shift Clustering" ? <MeanShiftClustering />

                : "Select an Algorithm to get options for the Hyperparameter"}
            </div>      
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default ModelTraining
