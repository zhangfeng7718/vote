import React, {useState, useEffect} from 'react';
import axios from 'axios';
import _ from 'lodash'
import './common.css'
import io from 'socket.io-client';
import { useParams , useHistory}  from 'react-router-dom'
import 'antd/dist/antd.css';
import {
    PageHeader,
    Spin,
    Alert
  } from 'antd';
import './voteview.css'
import { createFromIconfontCN , CheckOutlined} from '@ant-design/icons';
import moment from 'moment';
import { Avatar , Modal, Button, Space} from 'antd';
import { Progress } from 'antd';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});

const api = axios.create({
    baseURL: '/',
    withCredentials: true,
})





// 投票的请求和数据处理
function useVoteup(id, setIsLoading){
    const [voteup, setVoteup] = useState([]);
    const [voteInfo, setVoteInfo] = useState({});
    const [options, setOptions] = useState([]);
    
    // 获取当前投票的信息
    useEffect(() => {
        // 通过前端路由获取投票id
        async function getVoteup(){
            var request = await api.get('./vote/' + id);
            var data = request.data;
            setVoteup(data.voteup)
            setVoteInfo(data.info)
            setOptions(data.options)
            // 获取投票截止时间 如果还没有截止就开启Socket IO通信
            // 为什么要关? WS 在一定程度上会消耗很多的网络资源来维持连接  在非必要的情况下最好关闭
            if(data.info.deadline > Date.now()){
                const socket = io(location.host);
                socket.emit('select room', id)
                socket.on('newvote', data => {
                    setVoteup(data)
                })
            }
            //数据准备完毕
            setIsLoading(false);
        }
        
        getVoteup()
    }, [id])

    return [voteup, voteInfo, options, setVoteup];
}

function useHasVoted(id){
    const [isLogin, setIsLogin] = useState(false);
    const [myVote, setMyVote] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        async function hasVoted(){
            var request = await api.get('/hasvoted/' + id );
            console.log(request);
            if(request.data.code === 1){
                setIsLogin(true);
                setMyVote(request.data.votedata)
                setUserInfo(request.data.user)
            }else if(request.data.code === 0){
                setIsLogin(true);
                setUserInfo(request.data.user)
            }else if(request.data.code === -1){
                // 没有登录
            }
        }
        hasVoted();
    }, []);

    return [userInfo ,isLogin, myVote]
}


function VoteView(){
    const params = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const  [voteup, voteInfo, options, setVoteup] = useVoteup(params.id,setIsLoading)
    let history = useHistory();
    const [isShow,setIsShow] = useState(false);
    // 个人投票列表
    const [userInfo, isLogin, myVote] = useHasVoted(params.id);

    async function Vote(optionid){
        var request = await api.post('/voteup', {
            optionid,
            voteid: voteInfo.id,
            singleSelection: voteInfo.singleSelection
        })
        if(request.status === 200){
            if(request.data.code === -1){
                info(-1);
            }else if(request.data.code === 0){
                info(0);
            }else{
                setVoteup(request.data)
            }
        }
    }

    function handlerShowing(){
        setIsShow(!isShow);
    }

    function optionticket(optionid){
        var count =  voteup.filter(it => it.optionid === optionid).length
        return count;
    }

    function optionticketPrecent(optionid){
        var count =  voteup.filter(it => it.optionid === optionid).length
        if(voteup === null || voteup.length === 0){
            return 0 ;
        }else{
            return Math.round(count / voteup.length * 1000) /10 
        }
    }

    function info(code) {
        console.log(code)
        Modal.info({
          title: '温馨提示',
          content: (
            <div>
                {code === 0 
                ?(<p>您当前尚未登录</p>)
                :(<p>投票已过截止日期,无法投票</p>)
            }
            </div>
          ),
          onOk() {
              if(code === 0){
                history.push({
                    pathname: '/login'
                })
              }
          },
        });
      }

    return (
        <div className='layout'>
            {isLoading
            ?(<Spin tip="Loading...">
            <Alert
              message="正在获取投票页面信息"
              description= "很快你就能看到他了"
              type="info"
            />
          </Spin>)
            :<>           
            <PageHeader
                className="site-page-header"
                onBack={() => {
                    history.push({
                        pathname: '/' 
                    })
                }}
                title="Vote"
            />
            <div className = 'container'>
                
                <div className = "clearfix voteview-header">
                    <div className = "voteview-header-left">
                       <h2  className = "voteview-title">{ voteInfo.title }</h2>
                       <p  className = "voteview-selection">{voteInfo.singleSelection === 1 ? '[单选]': '[多选]'}</p>
                    </div>
                    <div className = "voteview-logo">
                        <IconFont type="icon-tuichu"  style={{ fontSize: '22px', color: 'white' }}/>
                    </div>
                </div>
                <ul>
                    {
                        options.map(option => {
                            return (
                                <li onClick= { () =>  Vote(option.id)} key = {option.id} className="voteitem">
                                    <div className="voteitem-main clearfix">
                                        <div className = "voteitem-option">
                                            <span className="voteitem-option-content">{ option.content }</span>
                                            {
                                                isLogin && userInfo!== null && voteup &&voteup.some(it => (it.optionid == option.id && it.userid == userInfo.id)) &&
                                                <CheckOutlined style={ {color: 'blue'} }/>
                                            }
                                        </div>
                                        <div className = "voteitem-ticket">
                                            <span className = "voteitem-ticket-text">{ optionticket(option.id) }票 </span>
                                        </div>
                                    </div>
                                    <Progress 
                                    percent={optionticketPrecent(option.id)}
                                    strokeColor={{
                                        from: '#108ee9',
                                        to: '#87d068',
                                      }}
                                      status="active" />
                                    {
                                        isShow && (<div className = 'voteitem-avatar'>
                                            {
                                                voteup.map(item => {
                                                    if(item.optionid === option.id){
                                                        return (
                                                            <Avatar src={'/' + item.avatar} key={item.avatar}/>
                                                        )
                                                    }
                                                })
                                            }
                                        </div>)
                                    }
                                </li>
                            )
                        })
                    }
                </ul>
                <p className='deadline'>投票截止&nbsp;&nbsp;{moment(voteInfo.deadline).format('YYYY-M-D H:m')}</p>
                {
                    isShow
                    ?<button className='show-button' onClick = { handlerShowing }>隐藏详情</button>
                    :<button className='show-button' onClick = { handlerShowing }>显示详情</button>
                }
                
            </div>
            </>
            }
        </div>
    )
}

export default VoteView