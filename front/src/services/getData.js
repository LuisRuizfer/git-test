import axios from "axios";

const baseUrl = process.env.REACT_APP_BACKEND_URL

export async function dataService(){
    try {
        const responseInfo = await axios({
          url: `${baseUrl}/info`,
          method: "GET",
        });
        console.log(responseInfo.data);
        return responseInfo
      } catch (error) {
        console.log(error);
      }
}