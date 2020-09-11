import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import './common.css'
import { useHistory } from 'react-router-dom'
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { PageHeader , Row , Col,} from 'antd';
import 'antd/dist/antd.css';
import {
    Link,
  } from "react-router-dom";

const api = axios.create({
    baseURL: '/',
    withCredentials: true,
})

function LoginPage(){
    let history = useHistory();
    const [image, setImage] = useState(Date.now())

    const onFinish = values => {
        async function login(data){
            var request = await api.post('/login', {
                name: data.username,
                password: data.password,
                captcha: data.captcha,
            })
            var result = request.data;
            if(result.code === -1 ){
                alert(data.msg);
            }else{
                // 账号密码都正确 页面应该由前端路由跳转
                history.push({
                    pathname: '/'
                })
            }
        }
        login(values)
    };

    return (
        <div style = {{backgroundColor: '#F8F8FF'}}>
            <PageHeader
                className="site-page-header"
                onBack={() => {
                    history.push({
                        pathname: '/' 
                    })
                }}
                title="Login"
            />
            <div className = 'container'>
                <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item label="Captcha" extra="We must make sure that your are a human.">
                        <Row gutter={8}>
                        <Col span={6}>
                            <Form.Item
                            name="captcha"
                            noStyle
                            rules={[{ required: true, message: 'Please input the captcha you got!' }]}
                            >
                            <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Button onClick = {() => setImage(Date.now())  }>Get captcha</Button>
                        </Col>
                        <Col span={10} style = { {marginTop: '-10px', paddingLeft: '18px'} }>
                            <img src = {'/captcha?' + image } alt = '验证码显示错误'/>
                        </Col>
                        </Row>
                    </Form.Item>


                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Link className="login-form-forgot" to="/forgot">
                        Forgot password
                        </Link>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                        </Button>
                        &nbsp;&nbsp;Or <Link to="/register">register now!</Link>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}



export default LoginPage