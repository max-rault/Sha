import axios from "axios";
import { Platform } from "react-native";
var url = 'http://localhost:3000'
if(Platform.OS === 'android' || Platform.OS ==='ios'){
  url = 'http://192.168.0.34:3000'
}
const api = axios.create({
  baseURL: url
})

export default api;