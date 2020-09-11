import React from 'react';
import {useState} from 'react';
import axios from 'axios';
import './common.css'
import { useHistory } from 'react-router-dom'
import {
    Form,
    Input,
    Row,
    Col,
    Button,
    PageHeader,
  } from 'antd';
import 'antd/dist/antd.css';
const api = axios.create({
    baseURL: '/',
    withCredentials: true,
})

const formItemLayout = {
    labelCol: {
        xs: {
        span: 24,
        },
        sm: {
        span: 8,
        },
    },
    wrapperCol: {
        xs: {
        span: 24,
        },
        sm: {
        span: 16,
        },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
        span: 24,
        offset: 0,
        },
        sm: {
        span: 16,
        offset: 8,
        },
    },
};
function Forgot(){
    let history = useHistory();
    const [form] = Form.useForm();

    const onFinish = values => {
        async function sendForgotRequest(data){
            var request = api.post('/forgot', {
                email: data.email,
                captcha: data.captcha,
            })
            console.log(request);
            // if(request.data.code == -1){

            // }else{

            // }
        }
        sendForgotRequest(values);
      };
    const [image, setImage] = useState(Date.now())

    return (
        <div className = 'outside'>
            <PageHeader
                className="site-page-header"
                onBack={() => {
                    history.push({
                        pathname: '/login' 
                    })
                }}
                title="Forgot"
                subTitle="We will send you an email"
            />
            <div className = 'container'>
                <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    scrollToFirstError
                    >
                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                        ]}
                        style = {{marginBottom: '0'}}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Captcha" extra="We must make sure that your are a human.">
                        <Row gutter={8}>
                        <Col span={8}>
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
                        <Col span={8} style = { {marginTop: '-10px', paddingLeft: '18px'}}>
                            <img src = {'/captcha?' + image } alt = '验证码显示错误' />
                        </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout} style = {{marginBottom: '0'}}>
                        <Button type="primary" htmlType="submit">
                        Send
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>

    )
}

export default Forgot;
