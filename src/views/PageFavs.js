import { useEffect, useState } from "react";
import { Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import {collection, getDoc,doc} from "firebase/firestore"
import { auth, db } from"../firebase"
import Navigation from "../components/Navigation";
import { useAuthState } from "react-firebase-hooks/auth";

export default function PageFavs() {
  const [posts, setPosts] = useState([]);
  const [user,loading ]= useAuthState(auth)

  async function getPostdata(id){
    const postDocument = await getDoc(doc(db,"restaurants",id));
    //console.log(postDocument.data())
    return({image :postDocument.data().image , name: postDocument.data().name})
  }
  

   async function getAllPosts() {
    const postDocument = await getDoc(doc(db,"userfav",user.uid));
    
    //console.log(postDocument.data().restid)
    const arr = []
    for (var i = 0 ; i < postDocument.data().restid.length; i++){
      const imageName = await getPostdata(postDocument.data().restid[i])
      var posta = {imageName ,id :postDocument.data().restid[i]}
      arr.push(posta)
    }
    //console.log(arr)
    setPosts(arr)
  }

  useEffect(() => {
    if (loading) return; 
    getAllPosts();
  }, [loading]);

  const ImagesRow = () => {
    //console.log(posts)
    return posts.map((x) => {const {imageName,id} = x;
    return (<ImageSquare key={id} post={(x)} />)
  } );
    //
  };

  return (
    <>
      <Navigation/>
      <Container>
        <Row>
          <ImagesRow />
        </Row>
      </Container>
    </>
  );
}

function ImageSquare({ post }) {
  const { imageName, id } = post;
  const { image, name } = imageName
  //console.log(image)
  return (
    <Link
      to={`../posts/${id}`}
      style={{
        width: "18rem",
        marginLeft: "1rem",
        marginTop: "2rem",
      }}
    >
      <Image
        src={image}
        style={{
          objectFit: "cover",
          width: "18rem",
          height: "18rem",
        }}
      />
    </Link>
  );
}
