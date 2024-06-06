import React, { useEffect, useState } from "react";
import { Button, Container, Form, Image} from "react-bootstrap";
import { addDoc, collection } from "firebase/firestore";
import {useAuthState }from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, storage} from "../firebase";
import Navigation from "../components/Navigation";
import { getDownloadURL,ref,uploadBytes } from "firebase/storage";

export default function AddEntry() {
  const [user,loading] = useAuthState(auth)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate("")
  const [previewImage,setPreviewImage] = useState("https://zca.sg/img/placeholder")

  async function addPost() {
    const imageRefernce = ref(storage, `images/${image.name}`)
    console.log(imageRefernce)
    const response = await uploadBytes(imageRefernce,image)
    const imageUrl = await getDownloadURL (response.ref)
    await addDoc(collection(db,"restaurants"),{name,description, image: imageUrl}) 


    //await addDoc(collection(db,"posts"), {name,image})
    navigate("/")
  }

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login")
  }, [loading,user,navigate]);
 
  return (
    <>
      <Navigation></Navigation>
      <Container>
        <h1 style={{ marginBlock: "1rem" }}>Add Post</h1>
        <Form>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Lovely day"
              value={name}
              onChange={(text) => setName(text.target.value)}
            />
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Type of Cuisine, Best dishes etc"
              value={description}
              onChange={(text) => setDescription(text.target.value)}
            />
          </Form.Group>

          <Image src = {previewImage} style={{
            objectFit: "cover",
            width:"10rem",
            height:"10rem"
          }} />

          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="file"
              //placeholder="https://zca.sg/img/1"
              //value={image}
              //onChange={(text) => setImage(text.target.va]lue)}
              onChange={(e) => {
                const imageFile = e.target.files[0]
                setImage(imageFile);
                const previewImage = URL.createObjectURL(imageFile);
                setPreviewImage(previewImage);

              }}
              

            />
            <Form.Text className="text-muted">
              Make sure the url has a image type at the end: jpg, jpeg, png.
            </Form.Text>
          </Form.Group>
          <Button variant="primary" onClick={async (e) => addPost()}>
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
}
