import React, {useEffect, useState} from "react";
import {Navbar} from "../Navbar/Navbar";
import {Button, Table} from 'rsuite';
import axios from "axios";
import {headers, url} from "../environment";
import {displayErrorMessage, displaySuccessMessage} from "../utils/swal";
const {Column, HeaderCell, Cell} = Table;

const CompactCell = props => <Cell {...props} style={{padding: 4}}/>;
const CompactHeaderCell = props => <HeaderCell {...props} style={{padding: 4}}/>;

function Admin() {
    const defaultColumns = [
        {
            key: 'id', label: 'Id', fixed: true, width: 50
        },
        {
            key: 'name', label: 'Prenom', fixed: true, width: 120
        },
        {
            key: 'forename', label: 'Nom', fixed: true, width: 120
        },
        {
            key: 'email', label: 'Mail', fixed: true, width: 250
        },
        {
            key: 'isadmin', label: 'Administrateur', fixed: true, width: 120
        },
        {
            key: 'status', label: 'Compte activé', fixed: true, width: 120
        },
        {
            key: 'creationDate', label: 'Date de création du compte', fixed: true, width: 120
        },
        {
            key: 'action', label: 'Action', fixed: true, width: 700
        }
    ];

    const [users, setUsers] = useState([]);
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
    }, []);


    return (<div>
        <Navbar/>
        <div style={{height: autoHeight ? 'auto' : 400}}>
            <Table
                loading={false}
                height={300}
                hover={true}
                showHeader={true}
                autoHeight={true}
                data={noData ? [] : users}
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
        axios.get(`${url}/user`, {
            headers: headers
        })
        .then((res) => {
            const users =res.data.data.users;
            users.map(user => {
                user.action=
                    <div>
                    <Button appearance="link" onClick={() => updateRole(user)}>
                        {user.isadmin ? 'Retirer les droits' : 'Donner les droits'}
                    </Button>
                    <Button appearance="link" onClick={() => updateStatus(user)}>
                        {user.status ? 'Désactiver le compte' : 'Activer le compte'}
                    </Button>
                    <Button appearance="link" onClick={() => deleteUser(user)}>
                       Supprimer le compte
                    </Button>
                </div>
            });
            setUsers(users);
        });

        function updateRole(user) {
            const apiUrl = `${url}/user/${user.id}`;

            axios.put(apiUrl, {
                isadmin: !user.isadmin,
                // isadmin: user.isadmin === 0 ? 1 : 0,
            }, {
                headers: headers,
            })
                .then(() => {
                    displaySuccessMessage(`Le role de l'utilisateur ${ user.name } ${ user.forename } a bien été mis à jour`);
                })
                .catch(error => {
                    displayErrorMessage('Une erreur s\'est produite dans la mise à jour de l\'utilisateur', error);
                });
        }

        function updateStatus(user) {
            const apiUrl = `${url}/user/${user.id}`;

            axios.put(apiUrl, {
                status: !user.status,
                // isadmin: user.isadmin === 0 ? 1 : 0,
            }, {
                headers: headers,
            })
                .then(() => {
                    displaySuccessMessage(`Le status de l'utilisateur ${ user.name } ${ user.forename } a bien été mis à jour`);
                })
                .catch(error => {
                    displayErrorMessage('Une erreur s\'est produite dans la mise à jour de l\'utilisateur', error);
                });
        }

        function deleteUser(user) {
            const apiUrl = `${url}/user/${user.id}`;

            axios.delete(apiUrl, {
                headers: headers,
            })
                .then(() => {
                    displaySuccessMessage(`L'utilisateur ${ user.name } ${ user.forename } a bien été supprimé`);
                })
                .catch(error => {
                    displayErrorMessage('Une erreur s\'est produite dans la suppression de l\'utilisateur', error);
                });
        }
    }
}
export { Admin };