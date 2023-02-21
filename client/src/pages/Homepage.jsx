import React, { useEffect } from 'react';
import { Box, Container,Text } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login';
import SignUp from '../components/Authentication/SignUp';
import { useNavigate } from 'react-router-dom';

export default function Homepage() {

  const navigate = useNavigate();

  useEffect(()=>{

    const user= JSON.parse(localStorage.getItem("userInfo"));

    if(user) navigate("/chats");

  },[navigate]);



  return (

    <Container maxW='xl' centerContent >

      <Box d="flex" justifyContent="center" p={3} w="100%" m="40px 0 15px 0" borderRadius="lg" borderWidth="1px" bg="white">

        <Text fontSize="4xl"fontFamily="Work sans" color="black" >Chat Box</Text>

      </Box>

      <Box bg="white" w="100%" p={4} borderRadius="1g" borderWidth="1px" >

        <Tabs variant='soft-rounded' >
          <TabList mb="1em">
            <Tab width="50%" >Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
                    <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>




      </Box>
      
      
      
      </Container>
  )
}
