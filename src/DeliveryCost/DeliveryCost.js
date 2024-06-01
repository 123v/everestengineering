import React, { useEffect, useState } from 'react';
import { Button, Col, Input, Row, Select, message } from 'antd';
import { deliveryTimePackages, deliveryCostPackage } from "./mockData";

const { Option } = Select;
const COST = 'cost'
const TIME = 'time'

// Delivery Cost Component
function DeliveryCost({ tab }) {
    const [baseDeliveryCost, setBaseDeliveryCost] = useState(100);
    const [noOfPackages, setNoOfPackages] = useState(0);
    const [packages, setPackages] = useState([]);
    const [offers] = useState([
        { value: 10, label: 'OFR001' },
        { value: 7, label: 'OFR002' },
        { value: 5, label: 'OFR003' },
        { value: 7, label: 'OFFR002' }
    ]);
    const [result, setResult] = useState([])
    const [noOfVehicles, setNoOfVehicles] = useState(2)
    const [maxSpeed, setMaxSpeed] = useState(70)
    const [maxWeight, setMaxWeight] = useState(200)

    useEffect(() => {
        if (tab === COST) {
            setPackages(deliveryCostPackage)
            setNoOfPackages(3)
            setResult([])
        }
        if (tab === TIME) {
            setPackages(deliveryTimePackages)
            setNoOfPackages(5)
            setResult([])
        }
    }, [tab])

    const onPackageNumberChange = (e) => {
        const value = e.target.value === '' ? '' : parseInt(e.target.value, 10);
        if (value === '' || (!isNaN(value) && value <= 10)) {
            setNoOfPackages(value);
            const arr = [];
            for (let i = 1; i <= value; i++) {
                arr.push({ id: `PKG${i}`, weight: 0, distance: 0, offer: '' });
            }
            setPackages(arr);
        }
    };

    const onChangeHandle = (value, key, index) => {
        const updatedPackages = packages.map((pkg, pkgIndex) =>
            pkgIndex === index ? { ...pkg, [key]: value } : pkg
        );
        setPackages(updatedPackages);
    };

    // checking the offers and giving the discount on the basis of offer
    const calculateFinalCost = (item) => {
        let deliveryCost = Number(baseDeliveryCost) + Number(item.weight * 10) + Number(item.distance * 5)
        const condition1 = item.distance <= 200 && (item.weight >= 70 && item.weight <= 200)
        const condition2 = (item.distance >= 50 && item.distance <= 150) && (item.weight >= 100 && item.weight <= 250)
        const condition3 = (item.distance >= 50 && item.distance <= 250) && (item.weight >= 10 && item.weight <= 150)
        let discount = 0
        const includesOffer = offers.find(obj => obj.label === item.offer);
        if ((condition1 || condition2 || condition3) && includesOffer) {
            discount = (Number(deliveryCost) * Number(includesOffer['value'])) / 100
        }
        return { id: item.id, total_cost: deliveryCost - discount, discount: Number(discount) }
    }

    //Cost Calculating Function
    const onCostCalculation = () => {
        if (baseDeliveryCost) {
            if (noOfPackages) {
                let arr = []
                for (const item of packages) {
                    if (item.weight === 0) {
                        message.error("Enter weight for package " + item.id)
                        break;
                    }
                    if (item.distance === 0) {
                        message.error("Enter distance for package " + item.id)
                        break;
                    }
                    let p = calculateFinalCost(item)
                    arr.push(p)
                }
                setResult(arr)
                return arr
            } else {
                message.error('Please add at least one package to calculate the cost of delivery')
            }
        } else {
            message.error("Base delivery cost is required.")
        }
    }

    function calculateTime(pkg, vehicleTime) {
        return Math.floor(((pkg.distance / maxSpeed) + vehicleTime) * 100) / 100;
    }

    // TIme Calculation Function
    function onTimeCalculation() {
        //store all the vehicles into array, each vehicle will have packages loaded, and total time in delivering it
        let vehicles = [];
        for (let i = 0; i < noOfVehicles; i++) {
            vehicles.push({ id: i + 1, packages: [], booked: false, totalTime: 0 });
        }

        let timeList = [];
        let remainingPackages = [];

        // First, handle pairing of packages within max weight
        for (let i = 0; i < packages.length; i++) {
            let maxWeightPackage = packages.reduce((max, pkg) => max.weight > pkg.weight ? max : pkg);
            for (let j = i + 1; j < packages.length; j++) {
                let weightSum = packages[i].weight + packages[j].weight; // sum of two package's weight
                if (maxWeightPackage.weight < weightSum && weightSum <= maxWeight) {
                    for (let vehicle of vehicles) {
                        if (!vehicle.booked) {
                            timeList.push({ id: packages[i].id, time: calculateTime(packages[i], vehicle.totalTime) });
                            timeList.push({ id: packages[j].id, time: calculateTime(packages[j], vehicle.totalTime) });
                            //update vehicles
                            let t1 = 2 * packages[i].distance / maxSpeed;
                            let t2 = 2 * packages[j].distance / maxSpeed;
                            vehicle.totalTime = Math.max(t1, t2);
                            vehicle.booked = true;
                            vehicle.packages.push(packages[i], packages[j]);
                            break;
                        }
                    }
                    remainingPackages.push(packages[i], packages[j]); //Add the delivered package into remaining packages
                    break;
                }
            }
        }

        // Filter out the remaining packages (all_packages - remaining_packages)
        let filteredPackages = packages.filter(pkg => !remainingPackages.includes(pkg));
        let sortedPackages = filteredPackages.sort((a, b) => b.weight - a.weight);

        //get the min time vehicles among the all vehicles then assign the new package to it
        for (let pkg of sortedPackages) {
            let availableVehicle = vehicles.reduce((min, v) => min.totalTime < v.totalTime ? min : v); //gives min time vehicle
            timeList.push({ id: pkg.id, time: calculateTime(pkg, availableVehicle.totalTime) });
            availableVehicle.totalTime += 2 * (pkg.distance / maxSpeed);
            availableVehicle.packages.push(pkg);
        }

        const pkgs = onCostCalculation() //get the other parametes like - package id, discount & total count
        //get the final result
        const mergedArray = timeList.map(timeItem => {
            const costItem = pkgs.find(costItem => costItem.id === timeItem.id);
            return {
                id: timeItem.id,
                time: timeItem.time,
                total_cost: costItem ? costItem.total_cost : null,
                discount: costItem ? costItem.discount : null
            };
        });
        setResult(mergedArray)
        return '';
    }

    return (
        <div style={{ marginTop: 20 }}>
            <Row gutter={[20, 20]}>
                <Col span={6}>Base Delivery Cost:</Col>
                <Col span={6}>
                    <Input
                        type='number'
                        placeholder="Base Delivery Cost"
                        value={baseDeliveryCost}
                        onChange={(e) => setBaseDeliveryCost(e.target.value)}
                    />
                </Col>
                <Col span={6}>No of Packages:</Col>
                <Col span={6}>
                    <Input
                        type='number'
                        placeholder="No of Packages"
                        value={noOfPackages}
                        onChange={onPackageNumberChange}
                        max={10}
                    />
                </Col>
                <Col span={24} style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <Row>
                        <Col span={6}>Package Id</Col>
                        <Col span={6} style={{ borderLeft: '1px solid #ccc' }}>Weight</Col>
                        <Col span={6} style={{ borderLeft: '1px solid #ccc' }}>Distance</Col>
                        <Col span={6} style={{ borderLeft: '1px solid #ccc' }}>Offer</Col>
                    </Row>
                </Col>
                {packages.map((item, index) => {
                    return (
                        <React.Fragment key={item.id}>
                            <Col span={24} style={{ border: '1px solid #ccc', padding: '10px' }}>
                                <Row gutter={[20, 20]}>
                                    <Col span={6}>{item.id}</Col>
                                    <Col span={6}>
                                        <Input
                                            type="number"
                                            value={item.weight}
                                            onChange={(e) => onChangeHandle(parseInt(e.target.value, 10) || 0, 'weight', index)}
                                            placeholder='Weight'
                                        />
                                    </Col>
                                    <Col span={6}>
                                        <Input
                                            type="number"
                                            value={item.distance}
                                            onChange={(e) => onChangeHandle(parseInt(e.target.value, 10) || 0, 'distance', index)}
                                            placeholder='Distance'
                                        />
                                    </Col>
                                    <Col span={6}>
                                        <Select
                                            value={item.offer}
                                            onChange={(value) => onChangeHandle(value, 'offer', index)}
                                            placeholder="Select offer"
                                            style={{ width: '100%' }}
                                        >
                                            {
                                                offers
                                                    .map(opt => {
                                                        return <Option key={opt.label} value={opt.value}>{opt.label}</Option>
                                                    })
                                            }
                                        </Select>
                                    </Col>
                                </Row>
                            </Col>
                        </React.Fragment>
                    )
                })}
                {
                    tab === "time" && <>
                        <Col span={4}>No of Vehicles:</Col>
                        <Col span={4}>
                            <Input
                                type='number'
                                placeholder="Number of vehicles"
                                value={noOfVehicles}
                                onChange={(e) => setNoOfVehicles(e.target.value)}
                            />
                        </Col>
                        <Col span={4}>Max Speed:</Col>
                        <Col span={4}>
                            <Input
                                type='number'
                                placeholder="Max speed"
                                value={maxSpeed}
                                onChange={(e) => setMaxSpeed(e.target.value)}
                            />
                        </Col>
                        <Col span={4}>Max Weight:</Col>
                        <Col span={4}>
                            <Input
                                type='number'
                                placeholder="Max weight"
                                value={maxWeight}
                                onChange={(e) => setMaxWeight(e.target.value)}
                            />
                        </Col>
                    </>
                }
                <Col span={24}>
                    {
                        tab === COST ?
                            <Button type="primary" onClick={onCostCalculation}>Calculate Cost</Button>
                            :
                            <Button type="primary" onClick={onTimeCalculation}>Calculate Time</Button>
                    }
                </Col>
                {/**** Render Result starts**/}
                {
                    result && result.length > 0 &&
                    <React.Fragment>
                        <Col span={24} style={{ border: '1px solid #ccc', padding: '10px' }}>
                            <Row>
                                <Col span={6}>Package Id</Col>
                                <Col span={6} style={{ borderLeft: '1px solid #ccc' }}>Total Cost</Col>
                                <Col span={6} style={{ borderLeft: '1px solid #ccc' }}>Discount</Col>
                                {tab === TIME && <Col span={6} style={{ borderLeft: '1px solid #ccc' }}>Delivery Time in hours</Col>}
                            </Row>
                        </Col>
                        {
                            result.map((item, rIndex) => {
                                return (
                                    <Col key={rIndex} span={24} style={{ border: '1px solid #ccc', padding: '10px' }}>
                                        <Row>
                                            <Col span={6}>{item.id}</Col>
                                            <Col span={6} style={{ borderLeft: '1px solid #ccc' }}>{item.total_cost}</Col>
                                            <Col span={6} style={{ borderLeft: '1px solid #ccc' }}>{item.discount}</Col>
                                            {tab === TIME && <Col span={6} style={{ borderLeft: '1px solid #ccc' }}>{item.time}</Col>}
                                        </Row>
                                    </Col>
                                )
                            })
                        }
                    </React.Fragment>
                }
            </Row>
        </div>
    );
}

export default DeliveryCost;
