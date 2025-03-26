import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import './index.scss';

const Home = () => {
  return (
    <div className="home-container">
      <h1>欢迎来到首页</h1>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="卡片1" hoverable>
            <p>这是第一个示例卡片</p>
            <Button type="primary">了解更多</Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="卡片2" hoverable>
            <p>这是第二个示例卡片</p>
            <Button type="primary">了解更多</Button>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="卡片3" hoverable>
            <p>这是第三个示例卡片</p>
            <Button type="primary">了解更多</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home; 