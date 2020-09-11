import React, {useState, useRef} from 'react';
import axios from 'axios';
import './common.css'
import 'antd/dist/antd.css';
import {
    Form,
    Input,
    Tooltip,
    Row,
    Col,
    Button,
    Upload,
    PageHeader
  } from 'antd';
import { QuestionCircleOutlined ,  UploadOutlined } from '@ant-design/icons';
import {
    Link,
    useHistory,
  } from "react-router-dom";
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

const normFile = e => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

const customRequest = async function(a){
    console.log(a);
}

function RegisterPage(){
    let history = useHistory();
    const fileRef = useRef();

    async function register(data){
        var formData = new FormData();
        formData.append('name', data.name)
        formData.append('password', data.password)
        formData.append('email', data.email)
        formData.append('captcha', data.captcha)
        formData.append('avatar', data.avatar[0].originFileObj)

        console.log(data)
        var request = await axios({
            method: 'post',
            url: '/register',
            data: formData,
            withCredentials: true,
        },{headers: {'Content-Type': 'multipart/form-data'}})
        if(request.data.code === -1){
            // 注册失败
            
        }else{
            // 注册成功  由前端路由跳转到登录页面或者 主页面
            history.push({
                pathname: '/login'
            })
        }
    }
    const [form] = Form.useForm();
    const onFinish = values => {
        register(values);
    };
    const [image, setImage] = useState(Date.now())
    return (
        <div style = {{backgroundColor: '#F8F8FF'}}>
            <PageHeader
                className="site-page-header"
                onBack={() => {
                    history.push({
                        pathname: '/' 
                    })
                }}
                title="Register"
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
                        name="name"
                        label={
                        <span>
                            Username&nbsp;
                            <Tooltip title="What do you want others to call you? and you can use it to login">
                            <QuestionCircleOutlined />
                            </Tooltip>
                        </span>
                        }
                        style = {{marginBottom: '0'}}
                        rules={[{ required: true, message: 'Please input your nickname!', whitespace: true }]}
                    >
                        <Input />
                    </Form.Item>

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
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },]}
                        hasFeedback
                        style = {{marginBottom: '0'}}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        style = {{marginBottom: '0'}}
                        rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject('The two passwords that you entered do not match!');
                            },
                        }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>



                    <Form.Item label="Captcha" extra="We must make sure that your are a human." style = {{marginBottom: '0'}}>
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
                            <img src = { '/captcha?' + image } alt = '验证码显示错误'/>
                        </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item
                        name="avatar"
                        label="Avatar"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        style = {{marginBottom: '0'}}
                        rules={[
                        {
                            required: true,
                            message: '上传一个头像',
                        },]}
                    >
                        <Upload name="logo"  listType="picture"  >
                        <Button icon={<UploadOutlined />}>上传你的头像</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item {...tailFormItemLayout} style = {{marginBottom: '0'}}>
                        <Button type="primary" htmlType="submit">
                        Register
                        </Button>
                        <Link to="/login">&nbsp;&nbsp;Or login now!</Link>
                    </Form.Item>
                </Form>
            
            </div>

        </div>

    )
}

export default RegisterPage