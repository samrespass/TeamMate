import { useState, useEffect } from "react";
import { Link, Navigate, LinkOverlay } from "react-router-dom";
import { IconButton, Box, Text, Button, Image } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, BellIcon } from "@chakra-ui/icons";
import Modal from "react-modal";
import axios from "axios";
import useLocalStorageState from "use-local-storage-state";
import NotificationsList from './NotificationsList'
import logo from "../images/teammate-logo.png";
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Stack
    } from '@chakra-ui/react'


function Header() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    // const [navigate, setNavigate] = useState(false);
    const [token, setToken] = useLocalStorageState("teammateToken", null);
    const [error, setError] = useState([]);
    const [notifications, setNotifications] = useState(null);
    const [alertIcon, setAlertIcon] = useState('teal')
    const [alert, setAlert] = useState('')

    useEffect(() => {
        axios
            .get(`https://teammate-app.herokuapp.com/notification/all/`, {
                headers: {
                    Authorization: `Token ${token}`,
                },
            })
            .then((res) => {
                console.log(res.data);
                setNotifications(res.data);
                console.log(notifications);
            });
    }, [token]);

    const handleOpenModal = () => {
        console.log("click open");
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        console.log("click close");
        setModalIsOpen(false);
    };

    useEffect(() => {
        if (notifications) {
        setAlert('red')
        setAlertIcon('white')
        }
        if (notifications && notifications.length === 0) {
        setAlert('')
        setAlertIcon('teal')
        }
    }, [notifications]);



    const handleLogOut = () => {
        axios
            .post(
                `https://teammate-app.herokuapp.com/auth/token/logout/`,
                {},
                { headers: { Authorization: `Token ${token}` } }
            )
            .then(() => {
                setToken(null);
                console.log("logout");
            })
            .catch((res) => {
                let error = res.message;
                console.log(error);
                setError(error);
            });
    };
    if (!token) {
        return <Navigate to="/" />;
    }

    return (
        <Box className="header">
            <IconButton
                variant="ghost"
                bg={alert}
                borderRadius="20px"
                fontSize="1.5em"
                p={2}
                m={0}
                w="24px"
                onClick={() => handleOpenModal()}
            >
                <BellIcon color={alertIcon} />
            </IconButton>
            <Box display='flex' justifyContent='center'> <Image
                    src={logo}
                    alt='TeamMate logo'
                    w='150px'
                />
                </Box>
            <Box display="flex" justifyContent="end" m={2} color="teal">
                <Button
                    colorScheme="teal"
                    variant="outline"
                    m={0}
                    h="24px"
                    p={2}
                >
                    <Link
                        to="/"
                        onClick={(e) => {
                            handleLogOut(e);
                        }}
                    >
                        Signout
                    </Link>
                </Button>
            </Box>


            <Modal isOpen={modalIsOpen} contentLabel="Notifications Modal" overlayClassName="modal-overlay" className="modal" handleCloseModal={handleCloseModal}>
            <IconButton onClick={()=>handleCloseModal()} className="close-modal-button" variant='outline' colorScheme='teal'><CloseIcon color='white'/></IconButton>
            
            <NotificationsList token={token} notifications={notifications}/>

            </Modal>

            
        

        </Box>
    );
}

export default Header;
