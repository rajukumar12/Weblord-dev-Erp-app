import React, { useState } from 'react'
import { Card, Table, Select, Input, Button, Badge, Menu, Modal, Form, message } from 'antd';
import ProductListData from "assets/data/product-list.data.json"
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import AvatarStatus from 'components/shared-components/AvatarStatus';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import NumberFormat from 'react-number-format';
import { useNavigate } from "react-router-dom";
import utils from 'utils'

// import { Form, Input, Checkbox } from 'antd';
import { useEffect } from 'react';
import { getCountry, updateCountry, createCountry, deleteCountry } from 'utils/api/gst';
import Loading from 'views/app-views/components/feedback/message/Loading';

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
};
const tailLayout = {
	wrapperCol: { offset: 8, span: 16 },
};


const { Option } = Select

const getStockStatus = stockCount => {
	if (stockCount >= 10) {
		return <><Badge status="success" /><span>In Stock</span></>
	}
	if (stockCount < 10 && stockCount > 0) {
		return <><Badge status="warning" /><span>Limited Stock</span></>
	}
	if (stockCount === 0) {
		return <><Badge status="error" /><span>Out of Stock</span></>
	}
	return null
}

const categories = ['Cloths', 'Bags', 'Shoes', 'Watches', 'Devices']

const Country = () => {
	const navigate = useNavigate();
	const [list, setList] = useState(ProductListData)
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	const [hsnList, setHsnList] = useState([])
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false)
	const [selectedId, setSelectedId] = useState("")
	const showModal = () => {
		setIsModalOpen(true);
	};
	const showEditModal = (row) => {
		setIsModalOpen(true);
		setIsEdit(true);
		setSelectedId(row.id)
		form.setFieldsValue({
			name: row.name,
			short_code: row.short_code,
			mobile_no_ext: row.mobile_no_ext,
			currency: row.currency
		})
	};
	const handleOk = () => {
		setIsModalOpen(false);
	};
	const handleCancel = () => {
		setIsModalOpen(false);
		setIsEdit(false);
		setSelectedId("")
		form.resetFields();
	};



	// add gst******
	const [form] = Form.useForm()
	const onFinish = async (values) => {
		const { name, short_code, mobile_no_ext, currency } = values
		if (isEdit && selectedId) {

			const response = await updateCountry(selectedId, name, short_code, mobile_no_ext, currency)
			if (response.success === true) {
				message.success(response.message)
				setIsModalOpen(false);
				setIsEdit(false);
				setSelectedId("")
				init()
				form.resetFields();
			}
		} else {
			const response = await createCountry(name, short_code, mobile_no_ext, currency);
			if (response.success === true) {
				message.success(response.message)
				setIsModalOpen(false);
				setIsEdit(false);
				setSelectedId("")
				init()
				form.resetFields();
			}
		}


	};

	const onFinishFailed = errorInfo => {
		console.log('Failed:', errorInfo);
	};

	async function init() {
		const response = await getCountry();
		console.log(response, 'datadetails')
		if (response.data?.length) {
			setHsnList(response.data)
			setIsModalOpen(false);
		} else {
			setHsnList([])
		}

	}

	useEffect(() => {

		init()
	}, [])

	const dropdownMenu = row => (

		<Menu>
			{console.log(row, "rowsss")}
			<Menu.Item onClick={() => showEditModal(row)}>
				<Flex alignItems="center">
					<EditOutlined />
					<span className="ml-2">Edit</span>
				</Flex>
			</Menu.Item>
			<Menu.Item onClick={() => deleteRow(row.id)}>
				<Flex alignItems="center">
					<DeleteOutlined />
					<span className="ml-2">{selectedRows.length > 0 ? `Delete (${selectedRows.length})` : 'Delete'}</span>
				</Flex>
			</Menu.Item>
		</Menu>
	);

	// delete gst***********
	const deleteRow = async (id) => {


		const response = await deleteCountry(id)
		if (response.success === true) {
			message.success(response.message)
			init()
		}

	}

	const tableColumns = [
		{
			title: 'ID',
			dataIndex: 'id'
		},
		{
			title: 'Country Name',
			dataIndex: 'name',
			render: (_, record) => (
				<div className="d-flex">
					{/* <AvatarStatus size={60} type="square" src={record.image} name={record.name}  /> */}
					{/* <AvatarStatus size={60} type="square"name={record.name}  /> */}
					{record.name}
				</div>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},
		{
			title: 'Country Currency Code',
			dataIndex: 'short_code',
			render: (_, record) => (
				<div className="d-flex">
					{/* <AvatarStatus size={60} type="square" src={record.image} name={record.name}  /> */}
					{/* <AvatarStatus size={60} type="square"name={record.name}  /> */}
					{record.short_code}
				</div>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},

		{
			title: 'Country code',
			dataIndex: 'mobile_no_ext',
			render: (_, record) => (
				<div className="d-flex">
					{/* <AvatarStatus size={60} type="square" src={record.image} name={record.name}  /> */}
					{/* <AvatarStatus size={60} type="square"name={record.name}  /> */}
					{record.mobile_no_ext}
				</div>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},
		{
			title: 'Currency',
			dataIndex: 'currency',
			render: (_, record) => (
				<div className="d-flex">
					{/* <AvatarStatus size={60} type="square" src={record.image} name={record.name}  /> */}
					{/* <AvatarStatus size={60} type="square"name={record.name}  /> */}
					{record.currency}
				</div>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},


		{
			title: 'Created Date',
			dataIndex: 'name',
			render: (_, record) => (
				<div className="d-flex">
					{/* <AvatarStatus size={60} type="square" src={record.image} name={record.name}  /> */}
					{/* <AvatarStatus size={60} type="square"name={record.name}  /> */}
					{record.created_at}
				</div>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},
		{
			title: 'Updated Date',
			dataIndex: 'name',
			render: (_, record) => (
				<div className="d-flex">
					{/* <AvatarStatus size={60} type="square" src={record.image} name={record.name}  /> */}
					{/* <AvatarStatus size={60} type="square"name={record.name}  /> */}
					{record.updated_at}
				</div>
			),
			sorter: (a, b) => utils.antdTableSorter(a, b, 'name')
		},

		// {
		// 	title: 'Category',
		// 	dataIndex: 'category',
		// 	sorter: (a, b) => utils.antdTableSorter(a, b, 'category')
		// },
		// {
		// 	title: 'Price',
		// 	dataIndex: 'price',
		// 	render: price => (
		// 		<div>
		// 			<NumberFormat
		// 				displayType={'text'}
		// 				value={(Math.round(price * 100) / 100).toFixed(2)}
		// 				prefix={'$'}
		// 				thousandSeparator={true}
		// 			/>
		// 		</div>
		// 	),
		// 	sorter: (a, b) => utils.antdTableSorter(a, b, 'price')
		// },
		// {
		// 	title: 'Stock',
		// 	dataIndex: 'stock',
		// 	sorter: (a, b) => utils.antdTableSorter(a, b, 'stock')
		// },
		// {
		// 	title: 'Status',
		// 	dataIndex: 'stock',
		// 	render: stock => (
		// 		<Flex alignItems="center">{getStockStatus(stock)}</Flex>
		// 	),
		// 	sorter: (a, b) => utils.antdTableSorter(a, b, 'stock')
		// },
		{
			title: 'Action',
			dataIndex: 'actions',
			render: (_, elm) => (
				<div className="text-right">
					<EllipsisDropdown menu={dropdownMenu(elm)} />
				</div>
			)
		}
	];

	const rowSelection = {
		onChange: (key, rows) => {
			setSelectedRows(rows)
			setSelectedRowKeys(key)
		}
	};

	const onSearch = e => {
		const value = e.currentTarget.value
		const searchArray = e.currentTarget.value ? list : ProductListData
		const data = utils.wildCardSearch(searchArray, value)
		setList(data)
		setSelectedRowKeys([])
	}

	const handleShowCategory = value => {
		if (value !== 'All') {
			const key = 'category'
			const data = utils.filterArray(ProductListData, key, value)
			setList(data)
		} else {
			setList(ProductListData)
		}
	}

	return (
		<>
			<Card>
				<Flex alignItems="center" justifyContent="between" mobileFlex={false}>
					<Flex className="mb-1" mobileFlex={false}>
						<div className="mr-md-3 mb-3">
							<Input placeholder="Search" prefix={<SearchOutlined />} onChange={e => onSearch(e)} />
						</div>
						{/* <div className="mb-3">
							<Select
								defaultValue="All"
								className="w-100"
								style={{ minWidth: 180 }}
								onChange={handleShowCategory}
								placeholder="Category"
							>
								<Option value="All">All</Option>
								{
									categories.map(elm => (
										<Option key={elm} value={elm}>{elm}</Option>
									))
								}
							</Select>
						</div> */}
					</Flex>
					<div>
						<Button onClick={showModal} type="primary" icon={<PlusCircleOutlined />} block>Add Country</Button>
					</div>
				</Flex>
				<div className="table-responsive">
					<Table
						columns={tableColumns}
						dataSource={hsnList}
						rowKey='id'
						rowSelection={{
							selectedRowKeys: selectedRowKeys,
							type: 'checkbox',
							preserveSelectedRowKeys: false,
							...rowSelection,
						}}
					/>
				</div>
			</Card>

			{/* add gst************************************************************************ */}

			<Modal

				title={isEdit ? "Edit Country" : "Add Country"} open={isModalOpen} onCancel={handleCancel} footer={[
					// <Button type="primary" htmlType="submit"  onClick={onFinish}>
					// 	Submit
					// </Button>,
					// <Button type="primary" onClick={handleCancel}	>
					// 			Cancel
					// 		</Button>
				]}>
				<Form
					form={form}
					// style={{ width: '95%' }}
					// style={{boxShadow: '2px 5px 15px -10px rgb(0,0,0,0.5)',  padding:'10px', width:'50%'}}
					{...layout}
					name="basic"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
				>

					<Form.Item
						// style={{width:"35%"}}
						label="Country Name"
						name="name"
						rules={[{ required: true, message: 'Country Name field is required!' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						// style={{width:"35%"}}

						label="Country Currency Code"
						name="short_code"
						rules={[{ required: true, message: 'Countery code field  is required' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						// style={{width:"35%"}}
						label="Country Code"
						name="mobile_no_ext"
						rules={[{ required: true, message: 'Mobile no field is required' }]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						// style={{width:"35%"}}
						label="Currency"
						name="currency"
						rules={[{ required: true, message: 'Currency  field is required' }]}
					>
						<Input />
					</Form.Item>



					<Form.Item {...tailLayout}  >

						<div style={{
							width: '82%',
							marginLeft: "50px"
						}}>
							<Button type="primary" htmlType="submit" >
								{isEdit ? "Save" : "Submit"}
							</Button>
							<Button type="primary" onClick={handleCancel} style={{ marginLeft: '20px' }}	>
								Cancel
							</Button>
						</div>

					</Form.Item>

				</Form>
			</Modal>
		</>
	)




}

export default Country