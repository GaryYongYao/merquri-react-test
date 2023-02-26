import { useState } from 'react';
import { Divider, Layout } from 'antd';
import { CurrentWeather, Footer, Form, Header, HistoryList } from 'components';

import 'styles/App.css';

const { Content } = Layout;

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  
  return (
    <div className="App">
      <Layout>
        <Header text="Today's Weather" />
        <Content className="content-container">
          <div className="site-layout-content" style={{ background: 'white' }}>
            <Form setCurrentWeather={setCurrentWeather} />
            <Divider />
            <CurrentWeather currentWeather={currentWeather} />
            <Divider />
            <HistoryList setCurrentWeather={setCurrentWeather} />
          </div>
        </Content>
        <Footer />
      </Layout>
    </div>
  );
}

export default App;
