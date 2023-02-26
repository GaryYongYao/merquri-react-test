import React from 'react';
import { Layout, Typography, theme } from 'antd';

const { Title } = Typography;


// Simple header
const Header = ({ text }) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const headerStyle = {
    height: 'unset',
    backgroundColor: colorPrimary
  };

  const tiitleStyle = {
    margin: '0.5em',
    color: '#fff'
  };

  return (
    <Layout.Header style={headerStyle}>
      <Title level={3} style={tiitleStyle}>{text}</Title>
    </Layout.Header>
  ) ;
};

export default Header;