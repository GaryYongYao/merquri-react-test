import { createContext, useContext, useEffect, useState } from 'react'
import moment from 'moment';
import { Button, Col, List, Modal, Row, Space, Tooltip, Typography, notification } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { weatherAPIRequest } from '@utils';

const { Text } = Typography;

export const setHistoryCookie = ({ name, sys, weather, dt, main, coord }) => {
  const historyCookies = localStorage.getItem('history');

  //format data to only needed data
  const data = {
    name,
    sys,
    weather,
    dt,
    main,
    coord
  }

  if (!historyCookies || historyCookies.length < 1) {
    localStorage.setItem('history', JSON.stringify([data]))
    return;
  } else {
    const histories = JSON.parse(historyCookies);
    histories.unshift(data)
    localStorage.setItem('history', JSON.stringify(histories))
  }
}

const HistoryList = ({ setCurrentWeather }) => {
  const { historyContext, setHistoryContext } = useContext(HistoryContext)

  useEffect(() => {
    const historyCookies = localStorage.getItem('history');

    if (historyCookies) {
      const histories = JSON.parse(historyCookies);
  
      setHistoryContext(histories);
    }
  }, [])

  const onSearch = async (lat, lon) => {
    try {
      let params = {
        units: 'metric',
        lat,
        lon
      }
  
      const res = await weatherAPIRequest('data/2.5/weather', params);

      setCurrentWeather(res);
      setHistoryCookie(res);
      const histories = historyContext;
      histories.unshift(res)
      setHistoryContext(histories);

      notification.success({
        message: 'Success!',
        description: 'Weather data is found!',
      });
    } catch(err) {
      notification.error({
        message: 'Error Occured',
        description: err.message,
      });
    }
  };

  const onDelete = (index) => {
      Modal.confirm({
        title: 'Are you sure you want to delete?',
        icon: <ExclamationCircleOutlined/>,
        onOk: () => {
          const histories = historyContext;
          histories.splice(index, 1);
          
          localStorage.setItem('history', JSON.stringify(histories))
          setHistoryContext([...histories]);
    
          notification.success({
            message: 'Success!',
            description: 'Weather data deleted!',
          });
        },
        onCancel() {},
      });
  };

  return (
    <>
      <List
        pagination={{ position: 'bottom', align: 'center', pageSize: 10, total: historyContext.length }}
        dataSource={historyContext}
        renderItem={(item, index) => (
          <List.Item>
            <Row justify="space-between" style={{ width: "100%" }}>
              <Col xs={24} xl={12}>
                <Space direction="vertical">
                  <Text type="primary">
                    {index + 1}. {item.name}, {item.sys.country}
                  </Text>
                  <Text type="secondary">
                    {item.weather[0].main}({item.main.temp_max}℃)
                  </Text>
                </Space>
              </Col>
              <Col xs={24} xl={12} style={{ textAlign: 'end', marginTop: 25 }}>
                <Text type="primary">
                  {moment.unix(item.dt).format('DD-MM-YYYY hh:mm:ss A')}
                  <Space>
                    <Tooltip title="Search Again">
                      <Button
                        shape="circle"
                        type="primary"
                        ghost
                        icon={<SearchOutlined />}
                        style={{ marginLeft: 10 }}
                        onClick={() => onSearch(item.coord.lat, item.coord.lon)}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        shape="circle"
                        icon={<DeleteOutlined />}
                        danger
                        style={{ marginLeft: 10 }}
                        onClick={() => onDelete(index)}
                      />
                    </Tooltip>
                  </Space>
                </Text>
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </>
  )
}

export const HistoryContextProvider = ({ children }) => {
  const [historyContext, setHistoryContext] = useState([]);

  const historyValue = {
    historyContext,
    setHistoryContext
  }

  return (
    <HistoryContext.Provider value={historyValue}>
      {children}
    </HistoryContext.Provider>
  )
}

export const HistoryContext = createContext()

export default HistoryList;