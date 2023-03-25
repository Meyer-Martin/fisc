import React, {useState} from "react";
import {getAuth, sendPasswordResetEmail, deleteUser  } from "firebase/auth";
import {Navbar} from "../Navbar/Navbar";
import {Table, Button} from 'rsuite';
import {collection, query, getDocs, doc, getDoc, updateDoc  } from "firebase/firestore";
import {db, auth} from "../firebase/firebaseConfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'


const {Column, HeaderCell, Cell} = Table;

const CompactCell = props => <Cell {...props} style={{padding: 4}}/>;
const CompactHeaderCell = props => <HeaderCell {...props} style={{padding: 4}}/>;

function Admin() {

    const defaultColumns = [
        {
            key: 'email',
            label: 'Email',
            fixed: true,
            width: 130
        },
        {
            key: 'dateCreationAccount',
            label: 'Date de création du compte',
            fixed: true,
            width: 120
        },
        {
            key: 'dateLastConnection',
            label: 'Date de dernière connexion',
            fixed: true,
            width: 120
        },
        {
            key: 'action',
            label: 'Action',
            fixed: true,
            width: 700

        }
    ];

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [compact] = useState(true);
    const [bordered,] = useState(true);
    const [noData, setNoData] = React.useState(false);
    const [autoHeight] = useState(true);
    const [columnKeys] = useState(defaultColumns.map(column => column.key));

    const columns = defaultColumns.filter(column => columnKeys.some(key => key === column.key));
    const CustomCell = compact ? CompactCell : Cell;
    const CustomHeaderCell = compact ? CompactHeaderCell : HeaderCell;

    getData();


    return (
        <div>
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
                        return (
                            <Column {...rest} key={key}>
                                <CustomHeaderCell>{label}</CustomHeaderCell>
                                <CustomCell dataKey={key}/>
                            </Column>
                        );
                    })}
                </Table>
            </div>
        </div>
    );

    async function getData() {
        const q = query(collection(db, "users"));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const user = [{
                userId: doc.id,
                email: doc.data().email,
                dateCreationAccount: convertDate(doc.data().dateCreationAccount),
                dateLastConnection: 'zdazdzad',
                action: <div>
                    <Button appearance="link" onClick={() => sendPasswordReset(doc.data().email)}>
                        <FontAwesomeIcon icon={faEnvelope} />
                    </Button>

                    <Button appearance="link" onClick={() => toggleRole(doc.id)}>
                        {
                        doc.data().role === 'ADMIN' ? 'Retirer les droits' : 'Donner les droits'
                        }
                    </Button>
                    <Button appearance="link" onClick={() => removeUser(doc.data().user)}>Supprimer le compte</Button>
                </div>
            }];
            setData(user);
        });
    }
}

function convertDate(date) {
    return date.toDate().toLocaleDateString();
}

function sendPasswordReset(email) {
    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log('email sent')
        })
        .catch((error) => {
            console.error(error)
        });
}

async function toggleRole(userId) {
    console.log(userId);
    // Get role from userId
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const role = docSnap.data().role;
        if (role === 'ADMIN') {
            await updateDoc(docRef, {
                role: 'USER'
            });
        } else if (role === 'USER') {
            await updateDoc(docRef, {
                role: 'ADMIN'
            });
        }
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}

function removeUser(user) {
    deleteUser(user).then(() => {
        console.log('user deleted')
    }).catch((error) => {
        console.error(error)
    });
}

export {Admin};