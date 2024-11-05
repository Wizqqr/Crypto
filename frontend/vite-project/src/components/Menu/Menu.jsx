import React, { useEffect, useState } from 'react';
import { MailOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type
  };
}

const SidebarMenu = () => {
  const [currencies, setCurrencies] = useState([]);

  const fetchCurrencies = () => {
    axios.get('http://localhost:5000/api/cryptos/')
      .then(r => {
        const currenciesResponse = r.data;
        const currenciesData = currenciesResponse.data;

        const menuItems = [
          getItem('Список криптовалют', 'g1', <MailOutlined />,
            currenciesData.map(c => {
              return { label: <Link to={`/crypto/${c.id}`}>{c.name}</Link>, key: c.id };
            }),
            'group'
          )
        ];
        setCurrencies(menuItems);
      })
      .catch(error => {
        console.error('Error fetching currencies:', error);
      });
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  return (
    <Menu
      style={{ width: 256, height: '100%', overflowY: 'auto' }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={currencies}
    />
  );
};

export default SidebarMenu;
