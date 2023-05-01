import React, {useState, useEffect} from "react";
import {sendPasswordResetEmail} from "firebase/auth";
import {Navbar} from "../Navbar/Navbar";
import {Table, Button} from 'rsuite';
import {collection, query, getDocs, doc, getDoc, updateDoc} from "firebase/firestore";
import {db, auth} from "../firebase/firebaseConfig";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEnvelope} from '@fortawesome/free-solid-svg-icons'
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";


const {Column, HeaderCell, Cell} = Table;

const CompactCell = props => <Cell {...props} style={{padding: 4}}/>;
const CompactHeaderCell = props => <HeaderCell {...props} style={{padding: 4}}/>;

function Admin() {
    const navigate = useNavigate();
    checkAdmin(navigate);
    const defaultColumns = [{
        key: 'email', label: 'Email', fixed: true, width: 130
    }, {
        key: 'dateCreationAccount', label: 'Date de création du compte', fixed: true, width: 120
    }, {
        key: 'dateLastConnection', label: 'Date de dernière connexion', fixed: true, width: 120
    }, {
        key: 'action', label: 'Action', fixed: true, width: 700

    }];

    const [data, setData] = useState([]);
    // const [loading, setLoading] = useState(false);
    const [compact] = useState(true);
    const [bordered,] = useState(true);
    const [noData] = React.useState(false);
    const [autoHeight] = useState(true);
    const [columnKeys] = useState(defaultColumns.map(column => column.key));

    const columns = defaultColumns.filter(column => columnKeys.some(key => key === column.key));
    const CustomCell = compact ? CompactCell : Cell;
    const CustomHeaderCell = compact ? CompactHeaderCell : HeaderCell;

    useEffect(() => {
        getData();
    } , []);


    return (<div>
        <Navbar/>
        <div style={{height: autoHeight ? 'auto' : 400}}>
            <Table
                loading={false}
                height={300}
                hover={true}
                showHeader={true}
                autoHeight={true}
                data={noData ? [] : data}
                bordered={true}
                cellBordered={bordered}
                headerHeight={40}
                rowHeight={46}
            >
                {columns.map(column => {
                    const {key, label, ...rest} = column;
                    return (<Column {...rest} key={key}>
                        <CustomHeaderCell>{label}</CustomHeaderCell>
                        <CustomCell dataKey={key}/>
                    </Column>);
                })}
            </Table>
        </div>
    </div>);

    async function getData() {
        const q = query(collection(db, "users"));

        const querySnapshot = await getDocs(q);
        const users = [];
        querySnapshot.forEach((doc) => {

            const user = {
                userId: doc.id,
                email: doc.data().email,
                dateCreationAccount: convertDate(doc.data().dateCreationAccount),
                dateLastConnection: convertDate(doc.data().lastConnection),
                action: <div>
                    <Button appearance="link" onClick={() => sendPasswordReset(doc.data().email)}>
                        <FontAwesomeIcon icon={faEnvelope}/>
                    </Button>

                    <Button appearance="link" onClick={() => toggleRole(doc.id)}>
                        {doc.data().role === 'ADMIN' ? 'Retirer les droits' : 'Donner les droits'}
                    </Button>
                    <Button appearance="link" onClick={() => toggleUser(doc.id)}>
                        {doc.data().status ? 'Désactiver le compte' : 'Activer le compte'}
                    </Button>
                </div>
            };
            users.push(user);
        });
        setData(users);
    }

    async function toggleRole(userId) {
        // Get role from userId
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const role = docSnap.data().role;
            if (role === 'ADMIN') {
                updateDoc(docRef, {
                    role: 'USER'
                })
                    .then(() => {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Droits retirés !',
                            showConfirmButton: false,
                            timer: 1000
                        })
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: 'error', title: 'Oops...', text: 'Une erreur est survenue \n' + error,
                        })
                    });
            } else if (role === 'USER') {
                updateDoc(docRef, {
                    role: 'ADMIN'
                })
                    .then(() => {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Droits donnés !',
                            showConfirmButton: false,
                            timer: 1000
                        })
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: 'error', title: 'Oops...', text: 'Une erreur est survenue \n' + error,
                        })
                    });
            }

            getData();
        } else {
            Swal.fire({
                icon: 'error', title: 'Oops...', text: 'Une erreur est survenue',
            })
        }
    }


    async function toggleUser(userId) {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const status = docSnap.data().status;
            if (status) {
                updateDoc(docRef, {
                    status: false
                })
                    .then(() => {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Compte désactivé !',
                            showConfirmButton: false,
                            timer: 1000
                        })
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: 'error', title: 'Oops...', text: 'Une erreur est survenue \n' + error,
                        })
                    });
            } else {
                updateDoc(docRef, {
                    status: true
                })
                    .then(() => {
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Compte activé !',
                            showConfirmButton: false,
                            timer: 1000
                        })
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: 'error', title: 'Oops...', text: 'Une erreur est survenue \n' + error,
                        })
                    });
            }

            getData();
        } else {
            Swal.fire({
                icon: 'error', title: 'Oops...', text: 'Une erreur est survenue',
            })
        }
    }
}

function convertDate(date) {
    return date.toDate().toLocaleDateString();
}


function sendPasswordReset(email) {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            Swal.fire({
                position: 'top-end', icon: 'success', title: 'Mail envoyé !', showConfirmButton: false, timer: 1000
            })
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error', title: 'Oops...', text: 'Une erreur est survenue \n' + error,
            })
        });
}

async function checkAdmin(navigate) {
    const uid = localStorage.getItem('uid');
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const role = docSnap.data().role;
        if (role !== 'ADMIN') {
            return redirectToHome(navigate);
        }
    } else {
        Swal.fire({
            icon: 'error', title: 'Oops...', text: 'Une erreur est survenue',
        })
    }
}

function redirectToHome(navigate) {
    navigate('/dashboard');
}

export {Admin};