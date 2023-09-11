import DashBoard1 from './Reports/DashBoards/DashBoard1';
import DashboardButtons from './Forms/Perm/Shared/DashboardButtons';
import PermButtons from './Forms/Perm/Shared/PermButtons';
import './Home.css';
import { useState } from 'react';
import DashBoard2 from './Reports/DashBoards/DashBoard2';
import { useEffect } from 'react';

function Home() {

    let menu = window.localStorage.getItem('menus') || "";
    const [currentDashBoard, setCurrentDashBoard] = useState('DashBoard1');

    useEffect(() => {
        document.title = 'Dashboard';
    }, [])
    return (
        <>
            {menu?.includes("Admin") && <div style={{ textAlign: "center" }}>
                <PermButtons />
            </div>
            }
            <DashboardButtons menu={menu} setCurrentDashBoard={setCurrentDashBoard} />

            <div className='container-fluid'>
                {currentDashBoard==="DashBoard1" && menu?.includes("DashBoard1") && <div style={{ textAlign: 'center', marginTop: '30px', width: "96%", marginLeft: 'auto', marginRight: "auto" }}>
                    <DashBoard1 />
                </div>
                }
            </div>
            <div className='container-fluid'>
                {currentDashBoard==="DashBoard2" && menu?.includes("DashBoard2") && <div style={{ textAlign: 'center', marginTop: '30px', width: "96%", marginLeft: 'auto', marginRight: "auto" }}>
                    <DashBoard2 />
                </div>
                }
            </div>
        </>
    )
}

export default Home