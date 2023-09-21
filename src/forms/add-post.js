import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import Transition from "react-transition-group/Transition";
import Backdrop from "../components/backdrop";
import Question from "../components/question";
import FooterMenu from "../components/footer-menu";
import uploadedSound from "../assets/images/white-sound.png";
import uploadedImage from "../assets/images/white-image.png";

function AddPostForm(props) {
  const token = localStorage.getItem("token");
  const params = useParams();
  const history = useHistory();
  const [postPic, setPostPic] = useState({ address: "", pic: "" });
  const [postSound, setPostSound] = useState({ address: "", sound: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [soundFileSizeError, setSoundFileSizeError] = useState(false);
  const [imageFileSizeError, setImageFileSizeError] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // const [tags, setTags] = useState();
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);

  let buttonTitle = params.postId ? "Save Changes" : "Add Post";
  let pageTitle = params.postId ? "Edit Post" : "Add Post";

  async function DeletePost() {
    setError(null);

    let url = "http://localhost:8080/deletePost/" + params.postId;
    let method = "PUT";

    try {
      const response = await fetch(url, {
        method: method,
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();

      if (data.state === "Deleted") {
        history.goBack();
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  function RemoveImageHandler() {
    setPostPic({ address: "", pic: "" });
    setImageFileSizeError(false);
  }

  function ChangeImageHandler(event) {
    if (event.target.files[0].size > 20000000) {
      setImageFileSizeError(true);
    } else {
      setImageFileSizeError(false);
    }
    setPostPic({
      address: URL.createObjectURL(event.target.files[0]),
      pic: event.target.files[0],
    });
  }

  function RemoveSoundHandler() {
    setPostSound({ address: "", sound: "" });
    setSoundFileSizeError(false);
  }

  function ChangeSoundHandler(event) {
    if (event.target.files[0].size > 10000000) {
      setSoundFileSizeError(true);
    } else {
      setSoundFileSizeError(false);
    }
    setPostSound({
      address: URL.createObjectURL(event.target.files[0]),
      sound: event.target.files[0],
    });
  }

  function toggleDeletePrompt() {
    setShowDeletePrompt((prevState) => !prevState);
  }

  function closePrompt() {
    setShowDeletePrompt(false);
  }

  async function RegisterPost(event) {
    event.preventDefault();
    if (soundFileSizeError || imageFileSizeError) {
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("destination", "post");
    formData.append("description", description);
    // formData.append("tags", tags);
    if (postPic.pic) {
      formData.append("hasImage", "true");
      formData.append("image", postPic.pic);
    } else if (!postPic.address) {
      formData.append("hasImage", "false");
    }
    if (postSound.sound) {
      formData.append("hasSound", "true");
      formData.append("sound", postSound.sound);
    } else {
      formData.append("hasSound", "false");
    }

    setError(null);

    let url = "";
    let method = "";

    if (params.postId) {
      url = "http://localhost:8080/editPost/" + params.postId;
      method = "PUT";
    } else {
      url = "http://localhost:8080/addPost";
      method = "POST";
    }

    try {
      const response = await fetch(url, {
        method: method,
        body: formData,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      if (data.state === "Ok") {
        history.push("/userAdminPage");
      }
      if (data.state === "Error") {
        setError(data.errors);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  async function FetchPost() {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/getPost/" + params.postId
      );
      if (!response.ok) {
        throw new Error("There was an error in fetching the data!");
      }

      const data = await response.json();
      setPostPic({
        address:
          "http://localhost:8080/uploads/post/" +
          data.post.postInfo.featureImage,
      });
      if (data.post.postInfo.sound) {
        setPostSound({
          address:
            "http://localhost:8080/uploads/sounds/" + data.post.postInfo.sound,
        });
      }
      setName(data.post.postInfo.name);
      setDescription(data.post.postInfo.description);
      // setTags(data.post.postTags.join(" #"));
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (params.postId) {
      FetchPost();
    }
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="icon-title">
          <div className="icon diamond">
            <div>
              <span className="loading-rotate"></span>
            </div>
          </div>
        </div>
        <div className="animated-fillbar">
          <h5>Please wait...</h5>
          <p>Posting in progress</p>
          <div className="bar">
            <div className="fill"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="chats-page-cnt">
        <div className="top-menu-name">
          <Link to="/" className="back-menu"></Link>
          <h2>Add Post</h2>
        </div>
        <div className="padding-page">
          <div className="icon-title">
            <div className="icon premium">
              <div>
                <span></span>
              </div>
            </div>
            <h2>Add Post</h2>
            <p>Please log in to share your post.</p>
          </div>
        </div>
        <FooterMenu activeItem={"newPost"} />
      </div>
    );
  }

  return (
    <>
      <Transition
        in={showDeletePrompt}
        timeout={500}
        mountOnEnter
        unmountOnExit
      >
        {(state) => (
          <>
            <Question
              closePrompt={closePrompt}
              accept="Confirm"
              title="Delete Post"
              reject="Cancel"
              message="Are you sure?"
              promptProceed={DeletePost}
              show={state}
            />
            <Backdrop clicked={closePrompt} show={state} />
          </>
        )}
      </Transition>
      <div className="top-menu-name">
        <div onClick={history.goBack} className="back-menu"></div>
        <h2>{pageTitle}</h2>
      </div>

      <div className="add-post-page">
        <form className="regular-form" onSubmit={RegisterPost}>
          {/* FORM INPUT */}
          <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">Post Title</div>
            <div className="form-input">
              <input
                onChange={(e) => setName(e.target.value)}
                name="name"
                type="text"
                autoComplete="off"
                placeholder="Post Title"
                value={name}
              />
              <div className="input-check"></div>
            </div>
            {error && error.find((e) => e.param === "name") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "name").msg}</p>
              </div>
            )}
          </div>

          {/* FORM INPUT */}
          <div
            className="form-field"
            style={{ paddingRight: "2rem", paddingLeft: "2rem" }}
          >
            <div className="input-label">Description</div>
            <div className="form-input">
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                name="description"
                rows="3"
                value={description}
              ></textarea>

              <div className="input-check"></div>
            </div>
            {error && error.find((e) => e.param === "description") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "description").msg}</p>
              </div>
            )}
          </div>

          <div style={{ paddingRight: "2rem", paddingLeft: "2rem" }}>
            <div className="upload-image-sound">
              {/* FORM INPUT */}
              <div className="upload-one-img">
                {postPic.address ? (
                  <div className="uploaded-image">
                    {/* prettier-ignore */}
                    <div className="uploaded-image-itself" style={{ backgroundImage: `url(${postPic.address})`}} >
                    <img src={uploadedImage} />
                    </div>
                    {/* prettier-ignore */}
                    <div className="remove-image" onClick={RemoveImageHandler}> Remove Image </div>
                  </div>
                ) : (
                  <>
                    {/* prettier-ignore */}
                    <div className="upload-image-box">
                <input onChange={(e) => ChangeImageHandler(e)} className="image-input" accept="image/*" type="file" name="image" />
                <span>Post Image</span>
                <div></div>
              </div>
                  </>
                )}
              </div>

              {/* FORM INPUT */}
              <div className="edit-one-sound">
                {postSound.address ? (
                  <div className="uploaded-sound">
                    {/* prettier-ignore */}
                    <div className="uploaded-sound-itself">
                      <img src={uploadedSound} />
                    </div>
                    {/* prettier-ignore */}
                    <div className="remove-sound" onClick={RemoveSoundHandler}> Remove Sound </div>
                  </div>
                ) : (
                  <>
                    {/* prettier-ignore */}
                    <div className="upload-sound-box">
                <input onChange={(e) => ChangeSoundHandler(e)} accept="audio/mpeg" className="sound-input" type="file"  name="sound" />
                <span>Post Sound</span>
                <div></div>
              </div>
                  </>
                )}
              </div>
            </div>
            {error && error.find((e) => e.param === "image") && (
              <div className="input-validation">
                <span></span>
                <p>{error.find((e) => e.param === "image").msg}</p>
              </div>
            )}
            {imageFileSizeError && (
              <div className="input-validation">
                <span></span>
                <p>Upload an image with a size of up to 20 MB.</p>
              </div>
            )}
            {soundFileSizeError && (
              <div className="input-validation">
                <span></span>
                <p>Audio file should be in mp3 format and up to 10 MB.</p>
              </div>
            )}

            {params.postId ? (
              <div className="btns-flx">
                <input
                  className="button form-btn"
                  type="submit"
                  value={buttonTitle}
                  style={{ flex: "0 0 67%" }}
                />
                <div
                  onClick={toggleDeletePrompt}
                  className="button red"
                  style={{ flex: "0 0 30%" }}
                >
                  Delete
                </div>
              </div>
            ) : (
              <input
                className="button form-btn"
                type="submit"
                value={buttonTitle}
              />
            )}
          </div>
        </form>
      </div>
      <FooterMenu activeItem={"newPost"} />
    </>
  );
}

export default AddPostForm;
