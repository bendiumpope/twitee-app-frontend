import React, { useEffect, useState, useContext } from "react";
import { Card, Col, Row, Button, Typography, Form, Input } from "antd";
import styles from "./index.module.css";
import { Link } from "react-router-dom";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import moment from "moment";

import { AuthContext } from "../../../context/authContext";
import API from "../../../axios";

const { TextArea } = Input;
const { Text } = Typography;
const ss: any = "ss";
function index() {
  const [tweets, setTweets] = useState([]);
  const [postTrack, setPostTrack] = useState({});
  const [postId, setPostId] = useState("");
  const { setAuthState } = useContext(AuthContext);

  const [state, setState] = useState({
    content: "",
  });

  const updateState = (key: string, value: string) => {
    setState({
      ...state,
      [key]: value,
    });
  };

  useEffect(() => {
    API.get("/likes")
      .then((res: any) => {
        // console.log(res)
        setTweets(res.data.data);
        setPostTrack(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [postTrack]);
  // console.log("Tweets", tweets.data);

  const createTweet = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    API.post(`posts`, state)
      .then((res) => {
        const output = res?.config?.headers?.Authorization.split(" ")[1];
        setAuthState(output);

        // console.log("Response", res)
        // history.push('/home')
      })
      .catch((error) => {
        if (error) {
          // setErrorMessage(error.response.data.message)
          console.log("Error", error);
        }
      });
    setPostTrack({});
  };

  let reversedTweets = [...tweets].reverse();

  const increaseLikes = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    API.post(`likes/${postId}`, { likeType: "like" })
      .then((res) => {
        
      })
      .catch((error) => {
        if (error) {
          console.log("Error", error);
        }
      });
    setPostTrack({});
  };
  const decreaseLikes = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    API.post(`likes/${postId}`, { likeType: "dislike" })
      .then((res) => {
        
      })
      .catch((error) => {
        if (error) {
          console.log("Error", error);
        }
      });
    setPostTrack({});
  };

  function handleLikeClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    postId: any
  ) {
    setPostId(postId);
    increaseLikes(e);

    console.log("from lickclickhandler", postId);
  }
  function handleDisLikeClick(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    postId: any
  ) {
    setPostId(postId);

    decreaseLikes(e);
  }

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  return (
    <>
      <Button className="logout-button" type="primary" onClick={logout}>
        Log Out
      </Button>
      <Card title="User Tweets">
        <Card title="Share a Tweet" style={{ marginBottom: 22 }}>
          {/* <TextArea rows={4} /> */}
          <Form
            name="basic"
            // labelCol={{ span: 16 }}
            // wrapperCol={{ span: 16 }}
            autoComplete="off"
          >
            <Form.Item name="reply" rules={[{ message: "Tweet your reply!" }]}>
              <TextArea
                value={state.content}
                onChange={(e) => updateState("content", e.currentTarget.value)}
                rows={4}
              />
              {/* <Input /> */}
            </Form.Item>
            <Form.Item wrapperCol={{ span: 16 }}>
              <Button onClick={createTweet} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
        {reversedTweets.map((result: any, index) => (
          <Card
            className="card-container"
            style={{ marginBottom: 22 }}
            key={index}
            hoverable
          >
            <Link key={index} to={`/tweet-details/${result._id}`}>
              <Card type="inner" title={result.user.name}>
                {/* {console.log("Index", result._id)} */}
                {result.content.substring(0, 70)}...
              </Card>
            </Link>
            <Card>
              <Row className="bottom-row">
                <div className="like-dislike">
                  <Col className="likes">
                    <LikeOutlined
                      onClick={(
                        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                      ) => handleLikeClick(e, result._id)}
                    />
                    {"  "}
                    {result["likes"].length > 0 ? result["likes"].length : 0}
                  </Col>
                  <Col className="dislikes">
                    <DislikeOutlined
                      onClick={(
                        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                      ) => handleDisLikeClick(e, result._id)}
                    />
                    {"  "}
                    {result["dislike"].length > 0
                      ? result["dislike"].length
                      : 0}
                  </Col>
                </div>
                <div>
                  <Col>
                    <Text>
                      {moment(result.createdAt).startOf(ss).fromNow()}
                    </Text>
                  </Col>
                </div>
              </Row>
            </Card>
          </Card>
        ))}
      </Card>
    </>
  );
}

export default index;
