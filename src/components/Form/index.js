import { useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Select, notification } from 'antd';
import { Country } from 'country-state-city';
import { weatherAPIRequest } from '@utils';
import { HistoryContext, setHistoryCookie } from 'components/HistoryList';

const SearchForm = ({ setCurrentWeather }) => {
  const [form] = Form.useForm();
  const { historyContext, setHistoryContext } = useContext(HistoryContext)
  const [countries, setCountries] = useState([]);

  const onFinish = async ({ country, city }) => {
    try {
      let params = {
        units: 'metric'
      }
      if (city) {

        // getting city geocode
        const cityData = await weatherAPIRequest('geo/1.0/direct', { q: city });
        
        if (cityData.length < 1) {
          throw new Error('Data not Found')
        } 
  
        params = {
          ...params,
          lat: cityData[0].lat,
          lon: cityData[0].lon
        }
      } else {
        const { lat, lon } = JSON.parse(country);
  
        params = {
          ...params,
          lat,
          lon
        }
      }
  
      const res = await weatherAPIRequest('data/2.5/weather', params);

      setCurrentWeather(res);
      setHistoryCookie(res);
      const histories = historyContext;
      histories.unshift(res);
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

  useEffect(() => {
    const allCountries = Country.getAllCountries();

    const formattedCountries = allCountries.map((country) => ({ 
      value: JSON.stringify({
        lat: country.latitude,
        lon: country.longitude,
        isoCode: country.isoCode
      }),
      label: country.name
    }))

    setCountries(formattedCountries);
  }, [])

  return (
    <>
      <Form
        form={form}
        name="search-form"
        onFinish={onFinish}
        layout="inline"
      >
        <Form.Item
          name="country"
          label="Country"
          rules={[
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (value || getFieldValue('city')) {
                  return Promise.resolve();
                }
                return Promise.reject('City or Country is required');
              },
            })
          ]}
        >
          <Select
            showSearch
            optionFilterProp="children"
            placeholder="Select country"
            allowClear
            style={{ width: 250 }}
            filterOption={(input, option) =>
              // search avalaible country by their labels
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={countries}
          />
        </Form.Item>
        <Form.Item
          name="city"
          label="City"
          style={{marginBottom: '20px'}}
          rules={[
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (value || getFieldValue('country')) {
                  return Promise.resolve();
                }
                return Promise.reject('City or Country is required');
              },
            })
          ]}
        >
          <Input style={{ width: 250 }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" placeholder="Select city">Search</Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" danger onClick={() => form.resetFields()}>Clear</Button>
        </Form.Item>
      </Form>
    </>
  )
};

export default SearchForm;