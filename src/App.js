// import logo from './logo.svg';
import { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import "./Reports.css";
import AnimatedRoutes from "./AnimatedRoutes";
import { GlobalData } from "./Components/GlobalData";
import axios from "./Components/AxiosInstance";
import SideBar from "./Components/SideBar/SideBar";
import LoggedInUser from "./Components/Shared_Components/LoggedInUser";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [parties, setParties] = useState([]);
  //  const [proDescs, setProDescs] = useState([]);
  const [firm, setFirm] = useState([]);
  const [banks, setBanks] = useState([]);
  const [cashlist, setCashlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [prodTypes, setProdTypes] = useState([]);
  const [partyTypes, setPartyTypes] = useState([]);
  const [cpbballist, setCpbBalList] = useState([]);
  const [salemanlist, setSalemanList] = useState([]);
  const [acSettings, setAcSettings] = useState([]);
  const [digCateg, setDigCateg] = useState([]);
  const [token, setToken] = useState("");

  function getDataApi() {
    axios.get("api/date/session_date").then((response) => {
      localStorage.setItem("sDate", response.data[0]?.sDate?.slice(0, 10))
    });

    // axios.get("api/product/prodesclist").then((response) => {
    //   setProDescs(response.data);
    // });

    axios.get("api/perm/acsettings").then((response) => {
      setAcSettings(response.data);
    });
    axios.get("api/party/partieslist").then((response) => {
      setParties(response.data);
    });
    axios.get("api/firm").then((response) => {
      setFirm(response.data);
    });
    axios.get("api/digcateg").then((response) => {
      setDigCateg(response.data);
    });
    axios.get("api/bank/bankslist").then((response) => {
      response.data.length > 0
        ? setBanks(response.data)
        : console.log("banks list empty");
    });
    axios.get("api/party/cashlist").then((response) => {
      response.data.length > 0
        ? setCashlist(response.data)
        : console.log("cash list empty");
    });
    axios.get("api/product/productslist").then((response) => {
      response.data.length > 0
        ? setProducts(response.data)
        : console.log("products list empty");
    });
    axios.get("api/prodtype/prodtypeslist").then((response) => {
      response.data.length > 0
        ? setProdTypes(response.data)
        : console.log("product Types list empty");
    });
    axios.get("api/partytype/partytypeslist").then((response) => {
      response.data.length > 0
        ? setPartyTypes(response.data)
        : console.log("Party Types list empty");
    });
    axios.get("api/cpb/cpb_bal").then((response) => {
      response.data.length > 0
        ? setCpbBalList(response.data)
        : console.log("CPB list empty");
    });
    axios.get("api/party/salemanlist").then((response) => {
      response.data.length > 0
        ? setSalemanList(response.data)
        : console.log("Saleman list empty");
    });
  }

  function ClearApiData() {
    setParties([]);
    setFirm([]);
    setDigCateg([]);
    setBanks([]);
    setCashlist([]);
    setProdTypes([]);
    setPartyTypes([]);
    setCpbBalList([]);
    setSalemanList([]);
    localStorage.clear();
    console.log("cleared data");
  }

  const [menu, setMenu] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("menus")) {
      let MenuData = JSON.parse(localStorage.getItem("menus"));
      setMenu(MenuData);
      console.log(MenuData);

      let token = JSON.parse(localStorage.getItem("user"))?.Token;

      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
  }, []);

  useEffect(() => {
    console.log(menu.length);
    if (menu.length > 0) {
      console.log("data function called");
      getDataApi();
    }
  }, [menu]);

  return (
    <div className="App">
      <Router>
        <GlobalData.Provider
          value={{
            token,
            parties,
            firm,
            digCateg,
            banks,
            cashlist,
            products,
            cpbballist,
            prodTypes,
            partyTypes,
            salemanlist,
            acSettings
          }}
        >
          {/* <LoggedInUser /> */}
          <SideBar menu={menu} setMenu={setMenu} ClearApiData={ClearApiData} />
          <LoggedInUser getDataApi={getDataApi} />
          <AnimatedRoutes setMenu={setMenu} setToken={setToken} />
        </GlobalData.Provider>
      </Router>
    </div>
  );
}

export default App;
