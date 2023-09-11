import { Routes, Route, useLocation } from "react-router-dom";

//Dig
import GPV from "./Components/Forms/DigEntries/GPV/GPV";

import CR1 from "./Components/Forms/AcEntries/CR1/CR1";
import CP from "./Components/Forms/AcEntries/CP/CP";
import CR from "./Components/Forms/AcEntries/CR/CR";
import Forgot from "./Components/Forgot/Forgot";
import AcStat from "./Components/Reports/AcReps/AcStat/AcStat";
import JV from "./Components/Forms/AcEntries/JV/JV";
import BR from "./Components/Forms/AcEntries/BR/BR";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
// import Test from './Components/Test';
import Home from "./Components/Home";
import PrintV from "./Components/Reports/Shared/PrintV";
import TrialBalance from "./Components/Reports/AcReps/Trial/Trial";
import Protected from "./Components/Protected/Protected";
import DailyReg from "./Components/Reports/AcReps/DailyReg/DailyReg";
import DailyRegAudit from "./Components/Reports/AcReps/DailyRegAudit/DailyRegAudit";
import CPB_Bals from "./Components/Reports/AcReps/CPB_Bals/CPB_Bals";
import CPBLeg from "./Components/Reports/AcReps/CPBLeg/CPBLeg";
import AgingDr from "./Components/Reports/AcReps/AgingDr/AgingDr";
import Recables from "./Components/Reports/AcReps/Recables/Recables";
import Payables from "./Components/Reports/AcReps/Payables/Payables";
import DashBoard from "./Components/Reports/DashBoards/DashBoard";
import ProdLeg from "./Components/Reports/StkReps/ProdLeg/ProdLeg";
import StkLevel from "./Components/Reports/StkReps/StkLevel/StkLevel";
import StkEval from "./Components/Reports/StkReps/StkEval/StkEval";
import IGP from "./Components/Forms/StkEntries/IGP/IGP";
import ProductCoding from "./Components/Forms/Accounts/ProductCoding/ProductCoding";
import PartyCoding from "./Components/Forms/Accounts/PartyCoding/PartyCoding";
import PartyTypeCoding from "./Components/Forms/Accounts/PartyTypeCoding/PartyTypeCoding";
import PartyOpening from "./Components/Forms/Accounts/PartyOpening/PartyOpening";
import CpbOpening from "./Components/Forms/Accounts/CpbOpening/CpbOpening";
import StockOpening from "./Components/Forms/Accounts/StockOpening/StockOpening";
import PoOpening from "./Components/Forms/Accounts/PoOpening/PoOpening";
import SaleCom from "./Components/Forms/Accounts/SaleCom/SaleCom";
import StkSal from "./Components/Reports/StkReps/StkSal/StkSal";
import StkPL from "./Components/Reports/StkReps/StkPL/StkPL";
import StkPur from "./Components/Reports/StkReps/StkPur/StkPur";
import Trial2 from "./Components/Reports/AcReps/Trial2/Trial2";
import AcPL from "./Components/Reports/AcReps/AcPL/AcPL";
import BS from "./Components/Reports/AcReps/BS/BS";
import ProdTypeCoding from "./Components/Forms/Accounts/ProdTypeCoding/ProdTypeCoding";
import BS2 from "./Components/Reports/AcReps/BS/BS2";
import Journal from "./Components/Prints/AcPrints/LegPrint";
import CHQPrint from "./Components/Prints/AcPrints/CHQPrint";
import Ana from "./Components/Reports/StkReps/Ana/Ana";
import IP from "./Components/IP";
import StkPendPO from "./Components/Reports/StkReps/StkPO/StkPendPO";
import Users from "./Components/Forms/Perm/Users/Users";
import UserRoles from "./Components/Forms/Perm/UserRoles/UserRoles";
import UserMenus from "./Components/Forms/Perm/UserMenus/UserMenus";
import UserRoleMenus from "./Components/Forms/Perm/UserRoleMenus/UserRoleMenus";
import PrintAcStat from "./Components/Prints/AcPrints/PrintAcStat/PrintAcStat";
import UserParties from "./Components/Forms/Perm/UserParties/UserParties";
import GetUserName from "./Components/GetUserName";
import ByPassCrLimit from "./Components/Forms/Perm/ByPassCrLimit/ByPassCrLimit";
import AcSettings from "./Components/Forms/Perm/AcSettings/AcSettings";
import BP from "./Components/Forms/AcEntries/BP/BP";
import AgingCr from "./Components/Reports/AcReps/AgingCr/AgingCr";
import IPAddresses from "./Components/Forms/Perm/IPAddresses/IPAddresses";
import TestForm from "./Components/Test/TestForm";
import FileUploader from "./Components/Forms/UploadFiles/FileUploader";
import SRV from "./Components/Forms/StkEntries/SRV/SRV";
import SV from "./Components/Forms/StkEntries/SV/SV";
import PRV from "./Components/Forms/StkEntries/PRV/PRV";
import PV from "./Components/Forms/StkEntries/PV/PV";
import CHQ from "./Components/Forms/AcEntries/CHQ/CHQ";
import PO from "./Components/Forms/StkEntries/PO/PO";
import DIGIGP from "./Components/Forms/DigEntries/DIGIGP/DIGIGP";
import DIGPack from "./Components/Forms/DigEntries/DIGPack/DIGPack";

export default function AnimatedRoutes({ setMenu }) {
  const location = useLocation();

  return (
    <Routes key={location.pathname.split("/")[1]} location={location}>
      <Route path="/signup" element={<Register />} />
      <Route path="/login" element={<Login setMenu={setMenu} />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/cheque" element={<CHQPrint />} />
      <Route path="/accst" element={<PrintAcStat />} />

{/* Digital */}
      <Route path="/gpv/:id" element={<GPV />} />
      <Route path="/digigp/:id" element={<DIGIGP />} />
      <Route path="/digpack/:id" element={<DIGPack />} />

      {/* Reports Routes */}
      <Route path="/dailyreg" element={<Protected Component={DailyReg} />} />
      <Route
        path="/dailyregaudit"
        element={<Protected Component={DailyRegAudit} />}
      />
      <Route path="/dr" element={<Protected Component={DailyReg} />} />
      <Route path="/cpb_bals" element={<Protected Component={CPB_Bals} />} />
      <Route path="/cpbleg/:id" element={<Protected Component={CPBLeg} />} />
      <Route path="/agingdr" element={<Protected Component={AgingDr} />} />
      <Route path="/agingcr" element={<Protected Component={AgingCr} />} />
      <Route path="/recables" element={<Protected Component={Recables} />} />
      <Route path="/payables" element={<Protected Component={Payables} />} />
      <Route path="/prodleg" element={<Protected Component={ProdLeg} />} />
      <Route path="/stklevel" element={<Protected Component={StkLevel} />} />
      <Route path="/stkeval" element={<Protected Component={StkEval} />} />

      <Route path="/stksal" element={<Protected Component={StkSal} />} />
      <Route path="/stkpl" element={<Protected Component={StkPL} />} />
      <Route path="/stkpur" element={<Protected Component={StkPur} />} />
      <Route path="/stkpendpo" element={<Protected Component={StkPendPO} />} />

      <Route path="/trial" element={<Protected Component={TrialBalance} />} />
      <Route path="/trial2" element={<Protected Component={Trial2} />} />
      <Route path="/acpl" element={<Protected Component={AcPL} />} />
      <Route path="/bs" element={<Protected Component={BS} />} />
      <Route path="/bs2" element={<Protected Component={BS2} />} />
      <Route path="/acstat" element={<Protected Component={AcStat} />} />
      <Route
        path="/printv/:type/:vocno"
        element={<Protected Component={PrintV} />}
      />

      <Route path="/ana" element={<Protected Component={Ana} />} />

      <Route path="/users" element={<Protected Component={Users} />} />
      <Route path="/userroles" element={<Protected Component={UserRoles} />} />
      <Route path="/usermenus" element={<Protected Component={UserMenus} />} />
      <Route
        path="/userrolemenus"
        element={<Protected Component={UserRoleMenus} />}
      />
      <Route
        path="/userparties"
        element={<Protected Component={UserParties} />}
      />
      <Route
        path="/bypasscrlimit"
        element={<Protected Component={ByPassCrLimit} />}
      />
      <Route
        path="/ipaddress"
        element={<Protected Component={IPAddresses} />}
      />
      <Route
        path="/acsettings"
        element={<Protected Component={AcSettings} />}
      />

      <Route
        path="/getusername"
        element={<Protected Component={GetUserName} />}
      />

      {/* Reports Routes */}

      {/* Dashboard */}
      <Route path="/" element={<Protected Component={Home} />} />
      <Route path="/stkdash" element={<Protected Component={DashBoard} />} />

      {/* JV,BP,BR */}
      <Route path="/jv/:id" element={<Protected Component={JV} />} />
      <Route path="/br/:id" element={<Protected Component={BR} />} />
      <Route path="/bp/:id" element={<Protected Component={BP} />} />
      <Route path="/chq/:id" element={<Protected Component={CHQ} />} />
      <Route path="/cr1/:id" element={<Protected Component={CR1} />} />
      <Route path="/cr/:id" element={<Protected Component={CR} />} />
      <Route path="/cp/:id" element={<Protected Component={CP} />} />

      {/* Purchase */}
      <Route path="/po/:id" element={<Protected Component={PO} />} />
      <Route path="/pv/:id" element={<Protected Component={PV} />} />
      <Route path="/prv/:id" element={<Protected Component={PRV} />} />

      {/* Sale */}
      <Route path="/sv/:id" element={<Protected Component={SV} />} />
      <Route path="/srv/:id" element={<Protected Component={SRV} />} />
      <Route path="/igp/:id" element={<Protected Component={IGP} />} />
      <Route path="/testform" element={<Protected Component={TestForm} />} />

      {/* ProductCoding */}
      <Route
        path="/prodcoding"
        element={<Protected Component={ProductCoding} />}
      />
      {/* PartyCoding */}
      <Route
        path="/partycoding"
        element={<Protected Component={PartyCoding} />}
      />
      {/* PartyCoding */}

      {/* Partytype */}
      <Route
        path="/partytypecoding"
        element={<Protected Component={PartyTypeCoding} />}
      />
      <Route
        path="/prodtypecoding"
        element={<Protected Component={ProdTypeCoding} />}
      />
      {/* Partytype */}
      <Route path="/salecom" element={<Protected Component={SaleCom} />} />
      <Route path="/ip" element={<Protected Component={IP} />} />

      {/* Party Openong */}
      <Route
        path="/partyopening"
        element={<Protected Component={PartyOpening} />}
      />
      {/* CBP Opening */}
      <Route
        path="/cbpopening"
        element={<Protected Component={CpbOpening} />}
      />
      {/* Stock Opening */}
      <Route
        path="/stockopening"
        element={<Protected Component={StockOpening} />}
      />
      {/* Stock Opening */}
      <Route path="/poopening" element={<Protected Component={PoOpening} />} />

      <Route
        path="/fileuploader"
        element={<Protected Component={FileUploader} />}
      />
    </Routes>
  );
}
