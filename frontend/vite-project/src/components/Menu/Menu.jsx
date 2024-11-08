import React, { useEffect, useState } from 'react';
import {AppstoreOutlined,ContainerOutlined,DesktopOutlined,MailOutlined,PieChartOutlined,} from '@ant-design/icons';
import { Menu } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SidebarMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState([
    {
      key: '1',
      icon: <PieChartOutlined />,
      label: 'Main',
    },
    {
      key: '2',
      icon: <DesktopOutlined />,
      label: 'Option 2',
    },
    {
      key: '3',
      icon: <ContainerOutlined />,
      label: 'Option 3',
    },
    {
      key: 'sub1',
      label: 'CryptoCurrency',
      icon: <MailOutlined />,
      children: [
  
      ],
    },
    {
      key: 'sub2',
      label: 'Navigation Two',
      icon: <AppstoreOutlined />,
      children: [
        {
          key: '9',
          label: 'Option 9',
        },
        {
          key: '10',
          label: 'Option 10',
        },
        {
          key: 'sub3',
          label: 'Submenu',
          children: [
            {
              key: '11',
              label: 'Option 11',
            },
            {
              key: '12',
              label: 'Option 12',
            },
          ],
        },
      ],
    },
  ]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cryptos/');
        const currenciesData = response.data.data;

        const currencyItems = currenciesData.map((currency) => ({
          key: currency.id.toString(),
          label: <Link to={`/crypto/${currency.id}`}>{currency.name}</Link>,
        }));

        setItems((prevItems) =>
          prevItems.map((item) =>
            item.key === 'sub1'
              ? { ...item, children: currencyItems }
              : item
          )
        );
      } catch (error) {
        console.error('Error fetching currencies:', error);
      }
    };

    fetchCurrencies();
  }, []);


  return (
    <div style={{ width: 256}}>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
};

export default SidebarMenu;
