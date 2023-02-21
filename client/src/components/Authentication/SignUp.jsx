import React, { useState } from "react";
import { VStack, FormControl, FormLabel, Input, Button, useToast } from "@chakra-ui/react";
import storage from "../../config/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import axios from "axios";
import {useNavigate} from "react-router-dom"



export default function SignUp() {


  const toast = useToast();
  const navigate= useNavigate();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);

  const postDetails = (pics) => {
    setLoading(true);


    if (pics === undefined) {
      toast({
        title: 'Please Select an Image.',
        status: 'warning',
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });

      return;
    }


    const fileName = new Date().getTime() + pics.name;


    const storageRef = ref(storage, `/chat-app/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, pics);

    uploadTask.on('state_changed',
      (snapshot) => {

        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
          default: new Error('Unknown state');
            break;
        }
      },
      (error) => {
        console.log('Error: ' + error);
      },
      () => {

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

          console.log(downloadURL);
          setPic(downloadURL);

          setLoading(false)

        });

      }
    );

  }


  const handleSubmit = async () => {

    setLoading(true)

    if (!name || !email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }


    try {

      const res = await axios.post("/api/auth/register",{name,email,password,pic});
      console.log(res.data);

      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 2000,
        isClosable: true,
        position:"bottom"
      });


      localStorage.setItem('userInfo',JSON.stringify(res.data));
      setLoading(false);
      navigate("/chats");

    }
    catch (err) {

      console.error(err);
      toast({
        title: 'Error Occured ! ',
        description: err.response.data.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position:"bottom"
      });

    }



  }


  return <VStack spacing="5px ">


    <FormControl mb="20px" >
      <FormLabel> Name</FormLabel>
      <Input type='text' placeholder="Enter Your Name" value={name} onChange={(e) => setName(e.target.value)} />
    </FormControl>

    <FormControl >
      <FormLabel>Email </FormLabel>
      <Input mb="20px" type='email' placeholder="Enter Your Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
    </FormControl>

    <FormControl  >
      <FormLabel>Password </FormLabel>
      <Input mb="20px" type='password' placeholder="Enter Your Password" value={password} onChange={(e) => setPassword(e.target.value)} />
    </FormControl>

    <FormControl id="pic"  >
      <FormLabel>Upload your Picture </FormLabel>
      <Input mb="20px" type="file" p={1.5} accept="image/*" onChange={(e) => postDetails(e.target.files[0])} />
    </FormControl>


    <Button size='md' height='48px' width='100%' colorScheme='blue' isLoading={loading} onClick={handleSubmit} >Sign Up </Button>


  </VStack>;
}
