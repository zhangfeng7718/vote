import React ,{useState, useEffect} from 'react';
import axios from 'axios';
import {
    Link,
  } from "react-router-dom";
import 'antd/dist/antd.css';
import './main.css'
import { UserOutlined } from '@ant-design/icons';
import { List, Avatar, Pagination ,Button , Row, Col, Divider , Spin, Alert} from 'antd';
import moment from 'moment';
const DemoBox = props => <p className={`height-${props.value}`}>{props.children}</p>;

const api = axios.create({
    baseURL: '/',
    withCredentials: true,
})

function itemRender(current, type, originalElement) {
  if (type === 'prev') {
    return <a>Previous</a>;
  }
  if (type === 'next') {
    return <a>Next</a>;
  }
  return originalElement;
}

// 请求状态
function useUserInfo(){
    var [user, setUser] = useState(null);

    useEffect( () => {
        async function getUserInfo(){
            var request = await api.get('/userinfo')
            if(request.data.code === -1){
                setUser(null)
            }else{
                setUser(request.data.data);
            }
        }
        getUserInfo();
        
    }, [])
    return [user, setUser] ;
}

// 请求投票列表
function useVoteList(setIsLoading){
    var [voteList, setVoteList] = useState([]); 
    var [voteNum , setVoteNum] = useState(0);

    useEffect(()=> {
        async function getVotelist(){
            var request = await api.get('/votelist/1');
            setVoteList( request.data.votelist );
            setIsLoading(false)
        }   
        getVotelist();

        async function getVotelistNum(){
            var request = await api.get('votelistnum');
            setVoteNum(request.data.num)
        }

        getVotelistNum();
    }, [])
    return [voteList, voteNum['count(id)'],setVoteList]
}

function Main(props){
    const [isLoading, setIsLoading] = useState(true)
    const [user,setUser] = useUserInfo();
    const [voteList, voteNum, setVoteList] = useVoteList(setIsLoading);
    // 退出登录
    async function logout(){
        await api.get('/logout');
        setUser(null);
    }

    async function getPageInfo(page, pageSize){
        var request = await api.get('/votelist/' + page);
        var data = request.data;
        setVoteList(data.votelist)
    }

    return (
        <>
        {
            isLoading
            ?(<Spin tip="Loading...">
            <Alert
              message="正在获取您的登录状态"
              description= "读取信息通常只需要几秒"
              type="info"
            />
          </Spin>)
            :(<div className = 'container'>  
            <Divider orientation="left">Just Vote</Divider>
            <Row justify="space-around" align="middle">
                <Col span={12}  >
                    {
                        user == null
                        ? <Avatar shape="square" size={64} icon={<UserOutlined />}  style = {{marginLeft: '25px'}}/>
                        :<Avatar shape="square" size={64} src={'/' +  user.avatar} style = {{marginLeft: '25px'}}/>
                    }
                    <DemoBox value={100} >
                        <p className = 'username'>Welcome { user == null  ? '游客': user.name } </p>
                    </DemoBox>
                </Col>
                {
                    user === null || user.code === -1
                    ?(<Col span={12}>
                        <DemoBox value={120}>
                            <Link to="/login" className = 'linkbutton'>登录</Link>
                            <Link to="/register" className = 'linkbutton'>注册</Link>
                        </DemoBox>
                    </Col>)
                    :(<Col span={12}>
                        <DemoBox value={80}>
                            <Button onClick = { logout } style = {{marginLeft: '50px'}}>退出</Button>
                            <br />
                            <Link to="/create-vote" className = 'linkbutton'>创建投票</Link>
                        </DemoBox>
                    </Col>)
                }
            </Row>
            <List
                itemLayout="horizontal"
                dataSource={voteList}
                renderItem={item => (
                    <>
                <List.Item >
                    <List.Item.Meta
                    avatar={<Avatar src= { '/' + item.avatar} />}
                    title={<Link  to= { "/vote-view/" + item.id }>{item.title}</Link>}
                    description= { item.desc} 
                    />
                </List.Item>
                <li className= 'clearfix'>
                    <span className = 'itemauthor'>create by {item.name}</span>
                    <span className = 'itemdeadline'>{moment(item.deadline, "x").fromNow()}</span>
                </li>
                </>
                )}
            />
            <div className = 'pagination'>
                <Pagination 
                total={ voteNum } 
                itemRender={itemRender}
                defaultCurrent = { 5 }
                defaultPageSize = { 5 }
                showLessItems = {true}
                onChange = { getPageInfo }
                />
            </div>
        </div>)

        }

        </>     

    )
}

export default Main;