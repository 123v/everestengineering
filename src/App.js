import React, { useState } from 'react';
import DeliveryCost from "./DeliveryCost/DeliveryCost";
import { Col, Divider, Radio, Row } from 'antd';
import logo from "./images/logo.png";
import './App.css';

function App() {
	const [current, setcurrent] = useState('cost')
	return (
		<div className="App">
			<Row>
				<Col span={12}><div className="logo-container"><img alt='' src={logo} /></div></Col>
				<Col span={12}><div className='logo-title'>Delivery Estimation App</div></Col>
			</Row>
			<Divider style={{ marginTop: 0 }} />
			<Radio.Group onChange={(e) => setcurrent(e.target.value)} value={current}>
				<Radio.Button value="cost">Delivery Cost Estimation</Radio.Button>
				<Radio.Button value="time">Delivery Time Estimation</Radio.Button>
			</Radio.Group>
			<DeliveryCost tab={current} />
		</div>
	);
}

export default App;
