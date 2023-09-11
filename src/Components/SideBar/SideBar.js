//import useState hook to create menu collapse state
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

//import react pro sidebar components
import {
  ProSidebar,
  Menu,
  SubMenu,
  MenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";

//import icons from react icons
import {
  FaWarehouse,
  FaPlus,
  FaBook,
  FaShoppingBag,
  FaBars,
  FaCalculator,
  FaAngleRight,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import {
  FiHome,
  FiLogOut,
  FiArrowLeftCircle,
  FiArrowRightCircle,
} from "react-icons/fi";
// import { RiPencilLine } from "react-icons/ri";
// import { BiCog } from "react-icons/bi";

//import sidebar css from react-pro-sidebar module and our custom css
import "react-pro-sidebar/dist/css/styles.css";
import "./SideBar.css";
import { GlobalData } from "../GlobalData";
// import { Collapse } from "react-bootstrap";

const SideBar = ({ menu, setMenu, ClearApiData }) => {
  const navigate = useNavigate();
  const [menuwidth, setMenuWidth] = useState(0);
  const contextdata = useContext(GlobalData);

  function SignOut() {
    if (localStorage.getItem("user")) {
      localStorage.clear();
      setMenu([]);
      ClearApiData()
      navigate("/login");
    }
  }

  //create initial menuCollapse state using useState hook
  const [menuCollapse, setMenuCollapse] = useState(true);

  //create a custom function that will change menucollapse state from false to true and true to false
  const menuIconClick = () => {
    //condition checking to change state from true to false and vice versa
    // menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
    if (menuCollapse === true) {
      setMenuCollapse(false);
      setMenuWidth(0);
    } else {
      setMenuCollapse(true);
      setMenuWidth(1);
    }
  };
  useEffect(() => {
    if (menuCollapse === true) {
      setMenuWidth(0);
    } else {
      setMenuWidth(1);
    }
  }, [menuCollapse]);

  // function RoutingFun(url) {
  //     console.log(url);
  //     window.open(url, "_blank")
  // }

  return (
    <>
      <div onClick={menuIconClick} className="mobile_btn">
        <FaBars onClick={menuIconClick} />
      </div>
      <div
        id="header"
        style={{ width: `${menuwidth !== 0 ? "200px" : "41px"}` }}
      >
        {/* collapsed props to change menu size using menucollapse state */}
        <ProSidebar collapsed={menuCollapse} style={{ background: "orange" }}>
          <SidebarHeader>
            <div className="logotext">
              {/* small and big change using menucollapse state */}
              <p>{menuCollapse ? contextdata.firm[0]?.Abbr : contextdata.firm[0]?.label }</p>
            </div>
            <div className="closemenu" onClick={menuIconClick}>
              {/* changing menu collapse icon on click */}
              {menuCollapse ? <FiArrowRightCircle /> : <FiArrowLeftCircle />}
            </div>
          </SidebarHeader>
          <SidebarContent>
            <Menu iconShape="square">
              {localStorage.getItem("user") && (
                <MenuItem active={false} icon={<FiHome />}>
                  Dashboard
                  <Link to="/" />
                </MenuItem>
              )}
              {localStorage.getItem("user") && menu.includes("Coding") && (
                <SubMenu
                  title="Coding"
                  icon={<FaPlus />}
                  className="hover_underline"
                >
                  {menu.includes("Party Coding") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Party Coding
                      <Link to="/partycoding" />
                    </MenuItem>
                  )}
                  {menu.includes("Product Coding") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Product Coding
                      <Link to="/prodcoding" />
                    </MenuItem>
                  )}
                  {menu.includes("Party Type Coding") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Party Head Coding
                      <Link to="/partytypecoding" />
                    </MenuItem>
                  )}
                  {menu.includes("Product Type Coding") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Product Head Coding
                      <Link to="/prodtypecoding" />
                    </MenuItem>
                  )}
                  <SubMenu
                    title="Opening"
                    icon={<FaPlus className="plusiconleft" />}
                    className="hover_underline_submenu"
                  >
                    {menu.includes("Party Opening") && (
                      <MenuItem icon={<FaAngleRight />}>
                        Party Opening
                        <Link to="/partyopening" />
                      </MenuItem>
                    )}
                    {menu.includes("Cheques Opening") && (
                      <MenuItem icon={<FaAngleRight />}>
                        CPB Opening
                        <Link to="/cbpopening" />
                      </MenuItem>
                    )}
                    {menu.includes("Stock Opening") && (
                      <MenuItem icon={<FaAngleRight />}>
                        Stock Opening
                        <Link to="/stockopening" />
                      </MenuItem>
                    )}
                    {menu.includes("PO Opening") && (
                      <MenuItem icon={<FaAngleRight />}>
                        PO Opening
                        <Link to="/poopening" />
                      </MenuItem>
                    )}
                    {menu.includes("Sale Commission Rates") && (
                      <MenuItem icon={<FaAngleRight />}>
                        Sale Commission
                        <Link to="/salecom" />
                      </MenuItem>
                    )}
                  </SubMenu>
                </SubMenu>
              )}
              {localStorage.getItem("user") && menu.includes("A/C Forms") && (
                <SubMenu
                  title="A/C Forms"
                  icon={<FaBook />}
                  className="hover_underline"
                >
                  {menu.includes("Cheques(CPB)") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Party Cheques (CPB)
                      <Link to="/chq/0" />
                    </MenuItem>
                  )}
                  {menu.includes("JV") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Journal Voucher (JV)
                      <Link to="/jv/0" />
                    </MenuItem>
                  )}
                  {menu.includes("BR") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Bank Receipt (BR)
                      <Link to="/br/0" />
                    </MenuItem>
                  )}
                  {menu.includes("BP") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Bank Payment (BP)
                      <Link to="/bp/0" />
                    </MenuItem>
                  )}
                  {menu.includes("CR") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Cash Receipt (CR)
                      <Link to="/cr/0" />
                    </MenuItem>
                  )}
                  {menu.includes("CP") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Cash Payment (CP)
                      <Link to="/cp/0" />
                    </MenuItem>
                  )}
                </SubMenu>
              )}
              {localStorage.getItem("user") && menu.includes("Stk Forms") && (
                <SubMenu
                  // suffix={<span className="badge yellow">3</span>}
                  title="Stk Forms"
                  icon={<FaShoppingBag />}
                  className="hover_underline"
                >
                  {menu.includes("GPV") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Greige Purchase
                      <Link to="/gpv/0" />
                    </MenuItem>
                  )}
                  {contextdata?.acSettings[0]?.PurThroughPO && menu.includes("PO") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Purchase Order (PO)
                      <Link to="/po/0" />
                    </MenuItem>
                  )}
                  {menu.includes("Purchase") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Purchase (IGP)
                      <Link to="/pv/0" />
                    </MenuItem>
                  )}
                  {menu.includes("Pur Return") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Purchase Return
                      <Link to="/prv/0" />
                    </MenuItem>
                  )}
                  {menu.includes("Sale") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Sale (DO)
                      <Link to="/sv/0" />
                    </MenuItem>
                  )}
                  {menu.includes("Sale Return") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Sale Return
                      <Link to="/srv/0" />
                    </MenuItem>
                  )}
                  {menu.includes("IGP") && (
                    <MenuItem icon={<FaAngleRight />}>
                      IGP
                      <Link to="/igp/0" />
                    </MenuItem>
                  )}
                </SubMenu>
              )}
              {localStorage.getItem("user") && menu.includes("A/C Reports") && (
                <SubMenu
                  // suffix={<span className="badge yellow">3</span>}
                  title="A/c Reports"
                  icon={<FaCalculator />}
                  className="hover_underline"
                >
                  {menu.includes("A/C Statement") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Account Statement
                      <Link to="/acstat" />
                    </MenuItem>
                  )}
                  {menu.includes("Trial") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Trial Balance
                      <Link to="/trial" />
                    </MenuItem>
                  )}
                  {menu.includes("Trial 2") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Trial Balance 2
                      <Link to="/trial2" />
                    </MenuItem>
                  )}
                  {menu.includes("Daily Register") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Daily Register
                      <Link to="/dailyreg" />
                    </MenuItem>
                  )}
                  {menu.includes("Cheques Balances") && (
                    <MenuItem icon={<FaAngleRight />}>
                      CPB Balances
                      <Link to="/cpb_bals" />
                    </MenuItem>
                  )}
                  {menu.includes("Cheques Ledger") && (
                    <MenuItem icon={<FaAngleRight />}>
                      CPB Ledger
                      <Link to="/cpbleg/0" />
                    </MenuItem>
                  )}
                  {menu.includes("AgingDr") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Aging Receivables
                      <Link to="/agingdr" />
                    </MenuItem>
                  )}
                  {menu.includes("AgingCr") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Aging Payables
                      <Link to="/agingcr" />
                    </MenuItem>
                  )}
                  {menu.includes("Receivables") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Receivables
                      <Link to="/recables" />
                    </MenuItem>
                  )}
                  {menu.includes("Payables") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Payables
                      <Link to="/payables" />
                    </MenuItem>
                  )}
                  {menu.includes("A/C P/L") && (
                    <MenuItem icon={<FaAngleRight />}>
                      A/C P/L
                      <Link to="/acpl" />
                    </MenuItem>
                  )}
                  {menu.includes("Balance Sheet") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Balance Sheet
                      <Link to="/bs2" />
                    </MenuItem>
                  )}
                  {menu.includes("Analysis") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Analysis
                      <Link to="/ana" />
                    </MenuItem>
                  )}
                </SubMenu>
              )}

              {localStorage.getItem("user") && menu.includes("Stk Reports") && (
                <SubMenu
                  // suffix={<span className="badge yellow">3</span>}
                  title="Stk Reports"
                  icon={<FaWarehouse />}
                  className="hover_underline"
                >
                  {menu.includes("Product Ledger") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Product Ledger
                      <Link to="/prodleg" />
                    </MenuItem>
                  )}
                  {menu.includes("Stk Level") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Stock Level
                      <Link to="/stklevel" />
                    </MenuItem>
                  )}
                  {menu.includes("Stk Evaluation") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Stock Evaluation
                      <Link to="/stkeval" />
                    </MenuItem>
                  )}
                  {menu.includes("Stk Purchases") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Purchase Report
                      <Link to="/stkpur" />
                    </MenuItem>
                  )}
                  {menu.includes("Stk Sales") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Sale Report
                      <Link to="/stksal" />
                    </MenuItem>
                  )}
                  {menu.includes("Stk P/L") && (
                    <MenuItem icon={<FaAngleRight />}>
                      PL Report
                      <Link to="/stkpl" />
                    </MenuItem>
                  )}
                  {contextdata?.acSettings[0]?.PurThroughPO && menu.includes("Stk PO") && (
                    <MenuItem icon={<FaAngleRight />}>
                      Pending PO
                      <Link to="/stkpendpo" />
                    </MenuItem>
                  )}
                </SubMenu>
              )}

              {localStorage.getItem("user") && (
                <MenuItem onClick={SignOut} icon={<FiLogOut />}>
                  Logout
                </MenuItem>
              )}

              {!localStorage.getItem("user") && (
                <>
                  <MenuItem icon={<FaSignInAlt />}>Login</MenuItem>
                  <MenuItem icon={<FaUserPlus />}>Register</MenuItem>
                </>
              )}
            </Menu>
          </SidebarContent>
          {localStorage.getItem("user") && menu.includes("Daily Audit Register") && (
            <SidebarFooter>
              <Menu iconShape="square">
                <MenuItem icon={<FaCalculator />}>
                  Daily Audit Register
                  <Link to="/dailyregaudit" />
                </MenuItem>
              </Menu>
            </SidebarFooter>)
          }
        </ProSidebar>
      </div>
    </>
  );
};

export default SideBar;
