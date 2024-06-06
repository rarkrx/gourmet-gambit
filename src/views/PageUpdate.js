import React, { useEffect, useState } from "react";
import { Button, Container, Form , Image} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "../components/Navigation";
import {doc, getDoc, updateDoc, collection} from "firebase/firestore"
import { db,auth } from"../firebase"
import {useAuthState} from "react-firebase-hooks/auth"
import {storage} from "../firebase"
import { getDownloadURL,ref,uploadBytes } from "firebase/storage";

export default function PageUpdate() {
  const params = useParams();
  const id = params.id;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [user,loading] =useAuthState(auth)
  const navigate = useNavigate();  
  const [previewImage,setPreviewImage] = useState("https://zca.sg/img/placeholder")

  async function updatePost() {
    const imageRefernce = ref(storage, `images/${image.name}`)
    console.log(imageRefernce)
    const response = await uploadBytes(imageRefernce,image)
    const imageUrl = await getDownloadURL (response.ref)
    await updateDoc(doc(db,"restaurants",id),{name, image: imageUrl}) 
    navigate("/posts/" + id);
  }

  async function getPost(id) {
    const postDocument = await getDoc(doc(db,"restaurants",id))
    const post = postDocument.data()
    setName(post.name);
    setImage(post.image);
    setDescription(post.description)
    setPreviewImage(post.image);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    getPost(id);
  }, [id,loading,user,navigate]);

  return (
    <div>
      <Navigation/>
      <Container>
        <h1 style={{ marginBlock: "1rem" }}>Update Post</h1>
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
              placeholder="Description"
              value={description}
              onChange={(text) => setName(text.target.value)}
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
              onChange={(e) => {
                //setImage(text.target.value)
                const imageFile = e.target.files[0];
                const previewImage = URL.createObjectURL(imageFile)
                setImage(imageFile);
                setPreviewImage(previewImage)
              }}
            />
            <Form.Text className="text-muted">
              Make sure the url has a image type at the end: jpg, jpeg, png.
            </Form.Text>
          </Form.Group>
          <Button variant="primary"
           onClick={(e) => updatePost()}
           >
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
}
