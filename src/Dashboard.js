import { Navbar } from "./Navbar";
import './Dashboard.css';
import edit from "./editer.png"
import { Toggle } from 'rsuite';

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