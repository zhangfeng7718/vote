import React from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom'
import {
    Form,
    Input,
    Button,
    PageHeader,
    Checkbox,
  } from 'antd';
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
function ChangePassword(){
    let history = useHistory();
    const [form] = Form.useForm();
    var params = useParams();
    const onFinish = values => {
        async function changeRequest(data){
            var request = await api.post('/change-password/' + params.token, {
                password: data.password,
            })
            if(request.data.code === 0){
                history.push({
                    pathname: '/login',
                })
            }else{

            }
        }
        changeRequest(values)
    };
    return (
        <div className = 'outside'>
            <PageHeader
                className="site-page-header"
                onBack={() => {
                    history.push({
                        pathname: '/login' 
                    })
                }}
                title="Reset Password"
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
                        name="password"
                        label="Password"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
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

                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                        { validator:(_, value) => value ? Promise.resolve() : Promise.reject('Should accept agreement') },
                        ]}
                        {...tailFormItemLayout}
                    >
                        <Checkbox>
                        I have read the <a href="#">agreement</a>
                        </Checkbox>
                    </Form.Item>

                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                        Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}


export default ChangePassword;
