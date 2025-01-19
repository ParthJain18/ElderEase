
import { APIProvider } from "@vis.gl/react-google-maps";
import CustomMap from "../../components/GoogleMap/CustomMap";
import './map.css';


const Map = () => {
  return (
    <div className="app">
      <APIProvider apiKey='AIzaSyDMtSjiJQra0J_hm_0c4Jg9fVDEa81Nm-o'>
        <CustomMap />
      </APIProvider>
    </div>
  )
}

export default Map

