import { Navbar } from "../Navbar/Navbar";
import '../Dashboard/Dashboard';
import edit from "../img/editer.png"
import { Toggle } from 'rsuite';
import "./Dashboard.css"

function Dashboard() {
    return (
        <>
            <Navbar />
            <div className="main">
                <div className="box">
                    <div className="box-container">
                        <div>NOM</div>
                        <div>IP</div>
                        <div>nb GO</div>
                        <div>Date </div>
                        <div className="edit">
                            <img src={edit} alt="edit-icon" className="edit-icon" />
                            <Toggle />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export { Dashboard };