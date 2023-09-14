import {displayErrorMessage, displaySuccessMessage} from "../utils/swal";
import React, {useEffect, useState} from "react";
import {Navbar} from "../Navbar/Navbar";
import {Button, ButtonToolbar, Form, Modal, Table} from 'rsuite';
import axios from "axios";
import {headers, url} from "../environment";
const {Column, HeaderCell, Cell} = Table;

const CompactCell = props => <Cell {...props} style={{padding: 4}}/>;
const CompactHeaderCell = props => <HeaderCell {...props} style={{padding: 4}}/>;

function Dashboard() {
    const defaultColumns = [
        {
            key: 'id', label: 'Id', fixed: true, width: 50
        },
        {
            key: 'serverName', label: 'Nom du Serveur', fixed: true, width: 120
        },
        {
            key: 'serverSize', label: 'Taille du Serveur (en GO)', fixed: true, width: 200
        },
        {
            key: 'action', label: 'Action', fixed: true, width: 700
        }
    ];

    const [servers, setServers] = useState([]);

    // Table
    const [compact] = useState(true);
    const [bordered,] = useState(true);
    const [noData] = React.useState(false);
    const [autoHeight] = useState(true);
    const [columnKeys] = useState(defaultColumns.map(column => column.key));
    const columns = defaultColumns.filter(column => columnKeys.some(key => key === column.key));
    const CustomCell = compact ? CompactCell : Cell;
    const CustomHeaderCell = compact ? CompactHeaderCell : HeaderCell;

    // Modal create server
    const [openModal, setOpenModal] = React.useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    // Form add a server
    const [serverName, setServerName] = React.useState("");
    const [serverSize, setServerSize] = React.useState("");

    useEffect(() => {
        getServers();
    }, []);


    return (<div>
        <Navbar/>
        <ButtonToolbar>
            <Button onClick={handleOpenModal}>
                Créer un serveur</Button>
        </ButtonToolbar>
        <div style={{height: autoHeight ? 'auto' : 400, margin: '50px'}}>
            <Table
                loading={false}
                height={300}
                hover={true}
                showHeader={true}
                autoHeight={true}
                data={noData ? [] : servers}
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

        <Modal open={openModal} onClose={handleCloseModal}>
            <Modal.Header>
                <Modal.Title>Modal Title</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group controlId="serverName">
                    <Form.ControlLabel>Nom du serveur</Form.ControlLabel>
                    <Form.Control name="serverName" onChange={(e) => setServerName(e)} autoComplete="off" />
                    <Form.HelpText>Champ requis</Form.HelpText>
                </Form.Group>
                <Form.Group controlId="serverSize">
                    <Form.ControlLabel>Stockage</Form.ControlLabel>
                    <Form.Control name="serverSize" type="number"  onChange={(e) => setServerSize(e)} autoComplete="off" />
                    <Form.HelpText>Champ requis</Form.HelpText>
                </Form.Group>
                <Form.Group>
                    <ButtonToolbar>
                        <Button appearance="primary">Submit</Button>
                        <Button appearance="default">Cancel</Button>
                    </ButtonToolbar>
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => createServer()} appearance="primary">
                    Ok
                </Button>
                <Button onClick={handleCloseModal} appearance="subtle">
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    </div>);


    function createServer() {
        axios.post(`${url}/server`, {
            serverName,
            serverSize,
            user_id: localStorage.getItem('id')
        })
            .then(() => {
                displaySuccessMessage('Le serveur a bien été créé');
                getServers();
                handleCloseModal();
            })
            .catch(error => {
                displayErrorMessage('Une erreur s\'est produite lors de la création du serveur', error);
                handleCloseModal();
            });
    }
    function getServers() {
        setServers([]);

        axios.get(`${url}/server`)
            .then((res) => {
                const servers = res.data.data.servers;

                const userId = localStorage.getItem('id');
                axios.get(`${url}/user/${userId}`, {
                    headers: headers
                })
                    .then((res) => {
                        const userIsAdmin = res.data.data.user[0].isadmin;
                        let userServers = userIsAdmin ? servers : servers.filter(s => s.user_id.toString() === userId);

                        userServers = userServers.map(server => ({
                            ...server,
                            action: (
                                <div>
                                    <Button appearance="link" onClick={() => deleteServer(server)}>
                                        Supprimer le serveur
                                    </Button>
                                </div>
                            )
                        }));
                        setServers(userServers);
                    });
            });
    }

    function deleteServer(server) {
        const apiUrl = `${url}/server/${server.id}`;

        axios.delete(apiUrl, {
            headers: headers,
        })
            .then(() => {
                displaySuccessMessage('Le serveur a bien été supprimé');
                const servers = this.servers.filter(s => s.id !== server.id);
                setServers(servers);
            })
            .catch(error => {
                displayErrorMessage('Une erreur s\'est produite dans la suppression du serveur', error);
            });
    }

}
export { Dashboard };