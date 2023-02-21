import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { dataService } from "../services/getData";

export const GetDataContext = createContext();
export const GetDataProvider = ({ children }) => {
  const [getData, setGetData] = useState({});

  useEffect(()=> {
    async function loadData(){
        const response = await dataService()
        if (response){
            console.log(response)
            setGetData(response.data)
        }
    }
    loadData()
  }, [])
  return <GetDataContext.Provider value={{getData}}>{children}</GetDataContext.Provider>;
};
