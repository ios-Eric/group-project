import React from "react";
import {
  Form,
  Input,
  Button,
} from 'antd';

const { Item } = Form;

const Login = () => {
  const [form] = Form.useForm();
  return (
    <div>
      <h3>登录</h3>
      <Form
        name="login"
      >
        <Item label="账号">
          <Input />
        </Item>
        <Item label="密码">
          <Input />
        </Item>
        <Button>登录</Button>
        <Button>注册</Button>
      </Form>
    </div>
  );
};

export default Login;
