import React, {useState} from "react";
import {getAuth, sendPasswordResetEmail, deleteUser  } from "firebase/auth";
import {Navbar} from "../Navbar/Navbar";
import {Table, Toggle, TagPicker, Button} from 'rsuite';
import {collection, query, where, getDocs} from "firebase/firestore";
import {db} from "../firebase/firebaseConfig";


const {Column, HeaderCell, Cell} = Table;
const data = [];

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
            key: 'date',
            label: 'Date',
            fixed: true,
            width: 70
        },
        {
            key: 'action',
            label: 'Action',
            fixed: true,
            width: 300

        }
    ];

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
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    }
}

// function sendPasswordResetEmail(userId) {
//     sendPasswordResetEmail(auth, email)
//         .then(() => {
//             // Password reset email sent!
//             // ..
//         })
//         .catch((error) => {
//             const errorCode = error.code;
//             const errorMessage = error.message;
//             // ..
//         });
// }

// function deleteUser(userId) {
//     deleteUser(user).then(() => {
//         // User deleted.
//     }).catch((error) => {
//         // An error ocurred
//         // ...
//     });
// }

export {Admin};