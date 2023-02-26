import { Col, Space, Typography, Row } from 'antd';
import moment from 'moment';

const { Text, Title } = Typography;

const DataBox = ({title, data}) => (
  <Row justify="start">
    <Col span={8}>{title}</Col>
    <Col span={16}>{data}</Col>
  </Row>
)

const CurrentWeather = ({ currentWeather }) => {

  return (
    <Space direction="vertical" style={{ width: 350 }}>
      {!currentWeather && <Title level={5}>Please search to get weather data.</Title>}
      {currentWeather && (
        <>
          <Text type="secondary">{currentWeather.name}, {currentWeather.sys.country}</Text>
          <Title level={2} style={{marginTop: 0}}>{currentWeather.weather[0].main}</Title>
          <DataBox title="Description:" data={currentWeather.weather[0].description} />
          <DataBox title="Temperature:" data={`${currentWeather.main.temp_min}℃ ~ ${currentWeather.main.temp_max}℃`} />
          <DataBox title="Humidity:" data={`${currentWeather.main.humidity}%`} />
          <DataBox title="Time:" data={moment.unix(currentWeather.dt).format('DD-MM-YYYY hh:mm:ss A')} />
        </>
      )}
    </Space>
  );
};

export default CurrentWeather;