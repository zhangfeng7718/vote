import React from 'react';
import {useEffect} from 'react';
import axios from 'axios';
import './common.css'
import 'antd/dist/antd.css';
import { useHistory } from "react-router-dom"
import {
    Form,
    Input,
    Button,
    Radio,
    DatePicker,
    PageHeader,
    message
  } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

const api = axios.create({
    baseURL: '/',
    withCredentials: true,
})

const error = () => {
  message.error('请选择一个将来的时间作为投票截止时间');
};

function CreateVote(){
    const [form] = Form.useForm();
    const history = useHistory();

    // 确定用户是否登录 如果没有登录就跳转
    useEffect( () => {
        async function getUserInfo(){
            var request = await api.get('/userinfo')
            if(request.data.code === -1){
                history.push({
                    pathname: '/login',
                })
            }
        }
        getUserInfo();
        
    }, [])

    const onFinish = values => {
        console.log('Success:', values);

        if(values.deadline < Date.now()){
            // 弹出提示
            error();
            return ;
        }

        // 发送请求事件
        async function create(data){
            var request = await api.post('/create',{
                title: data.title,
                desc: data.desc,
                options: data.options,
                deadline: data.deadline,
                anonymouse: data.anonymouse,
                singleSelection: data.singleSelection,
            })
            if(request.code === -1){
                alert(request.msg)
            }else{
                // 通过前端路由跳转创建的投票页面
                history.push({
                    pathname: '/vote-view/' + request.data.id
                })
            }

        }
        create(values)

      };
    
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 } ,
    };

    const onReset = () => {
        form.resetFields();
      };

    const fields = [
        {
          "touched": true,
          "validating": false,
          "errors": [],
          "name": [
            "options"
          ],
          "value": [" ", " "]
        }
    ]

    return (
        <div className = 'outside'>
            <PageHeader
                className="site-page-header"
                onBack={() => {
                    history.push({
                        pathname: '/' 
                    })
                }}
                title="Create"
                subTitle="发起你的投票"
            />
            <div style = { {padding: '20px'}}>
                <Form
                {...layout}
                form = { form }
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                size= 'middle'
                fields={fields}
                initialValues = {{
                    anonymouse: '1',
                    singleSelection: '1',
                }}
                >
                    <Form.Item 
                    label="标题" 
                    name = "title"
                    rules={[{ required: true, message: '请输入标题!' }]}
                    className = "form-item"
                    style = {{marginBottom: '0'}}
                    >
                        <Input 
                        placeholder="标题"
                        />
                    </Form.Item>
                    <Form.Item 
                    label="描述" 
                    name = "desc"
                    rules={[{ required: true, message: '请输入问题的大致描述' }]}
                    style = {{marginBottom: '0'}}
                    >
                        <Input
                        type="text"
                        placeholder="问题描述"
                        />
                    </Form.Item>

                    <Form.Item 
                    label="截止日期" 
                    name = "deadline"
                    rules={[{ required: true, message: '必须输入截止日期!' }]}
                    style = {{marginBottom: '0'}}
                    >
                        <DatePicker 
                        type="datetime-local" 
                        placeholder="截止日期" 
                        showToday
                        />
                    </Form.Item>

                    <Form.Item 
                    label="单选或多选" 
                    name="singleSelection"
                    style = {{marginBottom: '0'}}>
                        <Radio.Group>
                        <Radio.Button value="1" >单选</Radio.Button>
                        <Radio.Button value="0" >多选</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="匿名投票" name="anonymouse" style = {{marginBottom: '0'}}>
                        <Radio.Group>
                        <Radio.Button  value="1"  >允许</Radio.Button>
                        <Radio.Button  value="0" >不允许</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.List name="options">
                        {(fields, { add, remove }) => {
                        return (
                            <div>
                            {fields.map((field, index) => (
                                <Form.Item
                                label={'选项' + (index + 1) }
                                required={false}
                                key={field.key}
                                style = {{marginBottom: '0'}}
                                >
                                    <Form.Item
                                        {...field}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                        {
                                            required: true,
                                            whitespace: true,
                                            message: "请输入你需要添加的选项",
                                        },
                                        ]}
                                        style = {{marginBottom: '0'}}
                                    >
                                        <Input  style={{ width: '60%' }} />
                                    </Form.Item>
                                {fields.length > 2 ? (
                                    <MinusCircleOutlined
                                        className="dynamic-delete-button"
                                        style={{ margin: '0 8px' , marginBottom: '0'}}
                                        onClick={() => {
                                            remove(field.name);
                                        }}
                                        />
                                    ) : null}
                                </Form.Item>
                            ))}
                            <Form.Item label='action'>
                                <Button
                                type="dashed"
                                onClick={() => {
                                    add();
                                }}
                                style={{ width: '60%' }}
                                >
                                <PlusOutlined /> 添加 选项
                                </Button>

                            </Form.Item>
                            </div>
                        );
                        }}
                    </Form.List>


                    <Form.Item {...layout} label='操作' style = {{marginBottom: '12px'}}>
                        <Button 
                        type="primary" 
                        htmlType="submit">
                            创建投票</Button>
                        <Button htmlType="button" onClick={onReset}>
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}



export default CreateVote