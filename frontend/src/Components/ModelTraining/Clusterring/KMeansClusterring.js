import React, { useState } from 'react'
import axios from 'axios'
import { Button } from 'react-bootstrap';

function KmeansClusterring() {
    const [randomState, setRandomState] = useState(null)
    const [init, setInit] = useState("k-means++")
    const [nClusters, setNClusters] = useState(8)
    

    const KmeansClusterringCall = async event => {
        event.preventDefault();
        const formData = new FormData();
      
        formData.append('random_state', randomState)
        formData.append('init', init)
        formData.append('n_clusters', nClusters)
        
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/handleKMeansClusterring/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
            console.log("Successfully Trained K Means Clusterring")
        }catch(error){
          console.log(error);
        }
      }
  return (
    <div>
      <Button className = 'btn  btn-block' onClick = {KmeansClusterringCall} type="submit" style = {{backgroundColor : 'rgb(53,58,63)'}}>K Means Clustering</Button>
    </div>
  )
}

export default KmeansClusterring
