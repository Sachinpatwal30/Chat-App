import React, { useState } from 'react'
import { VStack, FormControl, FormLabel, Input, Button, useToast } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";


export default function Login() {

    const toast = useToast();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);


    const handleClick = async ()=>{

        setLoading(true);

        if(!email || !password ){

            toast({
                title: 'Please Fill all fields.',
                status: 'warning',
                duration: 2000,
                isClosable: true,
                position: "bottom",
            });

            setLoading(false);
        }

        try{

            const res= await axios.post("/api/auth/login",{email,password});
            toast({
                title: 'Login Successful .',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: "bottom"
            });


            localStorage.setItem('userInfo', JSON.stringify(res.data));
            setLoading(false);
            navigate("/chats");

        }
        catch(error){

            console.error(error);
            toast({
                title: 'Invalid User ! ',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });


        }

setLoading(false);
    }

    const handleGuest = ()=>{

        setEmail("guest@gmail.com");
        setPassword("123");

    }

    return <VStack spacing="5px " >


        <FormControl >
            <FormLabel>Email </FormLabel>
            <Input mb="20px" type='email' placeholder="Enter Your Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormControl>

        <FormControl  >
            <FormLabel>Password </FormLabel>
            <Input mb="20px" type='password' placeholder="Enter Your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormControl>

        <Button size='md' height='48px' width='100%' colorScheme='blue' isLoading={loading} onClick={handleClick} >Login </Button>
        <Button size='md' height='48px' width='100%' colorScheme='red' onClick={handleGuest} >Get Guest Credentials </Button>


    </VStack >
}
