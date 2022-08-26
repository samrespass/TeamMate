import Header from "../components/HeaderMenu";
import Footer from "../components/FooterMenu";
import EditProfile from "../components/editProfile"
import { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import Modal from "react-modal";
import axios from "axios";
import { CloseIcon } from "@chakra-ui/icons";
import { BsPencil } from "react-icons/bs";
import { Text, Heading, Image, Icon, IconButton, Button, Box } from "@chakra-ui/react";
import noImage from "../images/no-image.jpg";

function UserProfile({ token, setToken }) {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useLocalStorageState("teammateUsername", null);
  const [history, setHistory] = useState(null)
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`https://teammate-app.herokuapp.com/${username}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
        console.log(res.data);
      });
  }, [token, username, modalIsOpen]);
  

  useEffect(() => {
    axios
      .get(`https://teammate-app.herokuapp.com/${username}/games/?my-games=MyPreviousGames`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((res) => {
        setHistory(res.data);
        console.log(res.data);
      });
  }, [token, username]);

  const handleOpenModal = (game) => {
    console.log("click modal open");
    setModalIsOpen(true);
    console.log(modalIsOpen);
};

const handleCloseModal = (game) => {
    console.log("click close");
    console.log(game);
    setModalIsOpen(false);
};

  return (
    <>
      <Header token={token} setToken={setToken} />

      <Box className="app-body">
        {user && 
          <>
            <Box className="profile-body">
            
              <Box className="user-name">
                <Heading size="2xl" color="white">
                  {user.username}
                  <IconButton
                    aria-label="ProfileEdit"
                    o
                    onClick={() => {
                      handleOpenModal();
                    }}
                    fontSize=".5em"
                    colorScheme="white"
                    border="none"
                    variant="ghost"
                    className="edit-profile"
                    icon={<Icon as={BsPencil} />}
                  />
                </Heading>
              </Box>
              <>
              <Box className="profile-pic" m={2}>
                <Image
                  src={user.profile.profile_image_file}
                  alt={user.username}
                  fallbackSrc={noImage}
                  borderRadius="full"
                  boxSize="150px"
                />
              </Box>
              <Box className="ranks">
                <Heading color="white">
                  NTRP: {user.profile.ntrp_rating}
                </Heading>
              </Box>
              {history && 
              <Box className="games">  {history.map((history) => (
          <Box className="game-item">
            <Text>{history.date}&nbsp;</Text>
            <Text>{history.location_info.park_name}</Text>
          </Box>
        ))}</Box>}</>
            </Box>
            <Modal
                isOpen={modalIsOpen}
                contentLabel="Edit Profile Modal"
                className="modal"
                overlayClassName="modal-overlay"
            >
            <Button
                    onClick={() => {
                        handleCloseModal();
                    }}
                    className="close-modal-button"
                    variant="ghost"
                    colorScheme="teal"
                >
                    <CloseIcon color="white" />
                </Button>
                <EditProfile token={token} setModalIsOpen={setModalIsOpen}/>
            </Modal>
          </>
        }
      </Box>

      <Footer />
    </>
  );
}

export default UserProfile;
