import React, { useContext, useEffect, useState } from 'react'
import { Card, Col, Row, Input, Collapse, Form, Button, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import moment from 'moment';

import { AuthContext } from '../../../context/authContext';
import styles from './index.module.css';
import API from '../../../axios'
const { Text } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

interface PostInterface {
  _id: any;
  name: any;
  content: any;
  user: any;
  createdAt: any;
  updatedAt: any;
}

interface UnderID{
    _id:any
}

const ss: any = "ss";

function index() {
    let currentPost: PostInterface = {
      _id: "",
      name: "",
      user: "",
      content: "",
      createdAt: "",
      updatedAt: "",
    };
    let tracker : any = {}
    const { setAuthState } = useContext(AuthContext);
    const [post, setPost] = useState(currentPost)
    const [comments, setComments] = useState([])
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0)
    const [likeTrack, setLikeTrack] = useState(tracker)
    const [state, setState] = useState({
        comment: ""
    })

    const updateState = (key: string, value: string) => {
        setState({
            ...state,
            [key]: value,
        })
    }

    // let _id: UnderID = ""
    const { _id } : {_id:any} = useParams();



    const increaseLikes = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
            API.post(`likes/${_id}`, { likeType: "like" })
            .then((res: any) => {
                console.log("Response", res)
                setLikeTrack(res?.data?.data)
            })
            .catch((error) => {
                if(error) {
                    console.log("Error", error)
                }
            })
            
            setLikes(likes)
        }
    const decreaseLikes = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
            API.post(`likes/${_id}`, { likeType: "dislike" })
            .then((res) => {
                console.log("Response", res)
            })
            .catch((error) => {
                if(error) {
                    console.log("Error", error)
                }
            })
            
        }
    const createComment = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
            API.post(`comments/${_id}`, state)
            .then((res) => {
                const output = res?.config?.headers?.Authorization.split(" ")[1]
                setAuthState(output)
            })
            .catch((error) => {
                if(error) {
                    console.log("Error", error)
                }
            })
        }

        useEffect(() => {
            API.get(`/likes/${_id}?likeType=like`)
            .then((res: any) => {
                setLikes(res.data.data.length)
                setLikeTrack(res.data.data);
            })
            .catch((err) => {
                console.log("Likes Error", err)
            })
        }, [likes, likeTrack])
        useEffect(() => {
            API.get(`/likes/${_id}?likeType=dislike`)
            .then((res: any) => {
                setDislikes(res.data.data.length)
                setLikeTrack(res.data.data);
            })
            .catch((err) => {
                console.log("Dislike Error", err)
            })
        }, [dislikes, likeTrack])

    function callback(key: any) {
        console.log(key);
      }
    useEffect(() => {
        API.get(`/posts/${_id}`)
        .then((res: any) => {
            setPost(res.data.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }, [])
    useEffect(() => {
        API.get(`/comments/${_id}`)
        .then((res: any) => {
            setComments(res.data.data)
        })
        .catch((err) => {
            console.log(err)
        })
    }, [comments]);
  
    return (
        <Card title="Tweet Details">
                <Card type="inner" title={post?.user?.name}>
                    {post?.content}
                </Card>
                <Card>
                    <Row className="bottom-row">
                        <div className="like-dislike">
                            <Col className="likes">
                                <LikeOutlined onClick={increaseLikes} /> {likes}
                            </Col>
                            <Col className="dislikes">
                                <DislikeOutlined onClick={decreaseLikes} /> {dislikes}
                            </Col>
                        </div>
                        <div>
                            <Col>
                                <Text>{moment(post.createdAt).startOf(ss).fromNow()}</Text>
                            </Col>
                        </div>
                    </Row>
                </Card>
                <Collapse style={{ marginBottom: 22 }} defaultActiveKey={['1']} onChange={callback}>
                    <Panel header={comments.length > 0 ? `Comments - ${comments.length}` : "No Comments yet"} key="1">
                        {comments.map((result:any, index) => (
                        <Card key={index}>
                            <Text className="comment-name-time">{result.user.name} - {moment(result.createdAt).startOf(ss).fromNow()}</Text>
                            <div>{result.comment}</div>
                        </Card>
                        ))}
                    </Panel>
                </Collapse>
                <Card title="Make a comment">
                    {/* <TextArea rows={4} /> */}
                <Form
                    name="basic"
                    // labelCol={{ span: 16 }}
                    // wrapperCol={{ span: 16 }}
                    autoComplete="off"
                >
                    <Form.Item
                        name="reply"
                        rules={[{ message: 'Tweet your reply!' }]}
                    >
                        <TextArea value={state.comment} onChange={(e) => updateState('comment', e.currentTarget.value)} rows={4} />
                        {/* <Input /> */}
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 16 }}>
                        <Button onClick={createComment} type="primary" htmlType="submit">
                        Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
                </Card>
    )
}

export default index
