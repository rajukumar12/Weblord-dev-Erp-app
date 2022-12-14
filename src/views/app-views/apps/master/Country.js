import React, { useState, useContext, useRef } from 'react'
import { AppContext } from 'components/ContextApi';
import { Card, Table, Select, Input, Button, Badge, Menu, Modal, Form, message } from 'antd';
import ProductListData from "assets/data/product-list.data.json"
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';
import Flex from 'components/shared-components/Flex'
import utils from 'utils'

// import { Form, Input, Checkbox } from 'antd';
import { useEffect } from 'react';
import { getCountry, updateCountry, createCountry, deleteCountry } from 'utils/api/country';

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 16 },
};
const tailLayout = {
	wrapperCol: { offset: 8, span: 16 },
};

const Country = () => {
	const { showTitle } = useContext(AppContext)
	const [list, setList] = useState(ProductListData)
	const [selectedRows, setSelectedRows] = useState([])
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	const [hsnList, setHsnList] = useState([])
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false)
	const [selectedId, setSelectedId] = useState("")
	const [submitLoading, setSubmitLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(false)
	const [openDeleteModal, setOpenDeleteModal] = useState({
		open: false,
		id: '',
		name: ''
	})
	const addButtonRef = useRef(null)
	const formInputRef = useRef(null)
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

	function handleEnter(event) {
		const form = event?.target?.form;

		const index = Array.prototype.indexOf.call(form, event.target);
		if (event.keyCode === 13) {
			if ((index + 1) < form.elements.length) {
				form.elements[index + 1]?.focus();
			}
			event.preventDefault();
		} else if (event.keyCode === 27) {
			if ((index - 1) > 0) {
				form.elements[index - 1]?.focus();
			}
			event.preventDefault();
		}
	}

	const [form] = Form.useForm()
	const onFinish = async (values) => {
		try {
			let response
			const { name, short_code, mobile_no_ext, currency } = values

			setSubmitLoading(true)
			if (isEdit && selectedId) {
				response = await updateCountry(selectedId, name, short_code, mobile_no_ext, currency)
			} else {
				response = await createCountry(name, short_code, mobile_no_ext, currency);
			}
			if (response?.success === true) {
				message.success(response.message)
			}
			else if (response?.success === false) {
				Object.keys(response.data).map(item => {
					message.warning(response.data[item][0])
				})
				setSubmitLoading(false)
				return
			}
			setSubmitLoading(false)
			init()
			setIsModalOpen(false);
			setIsEdit(false);
			setSelectedId("")
			form.resetFields();


		} catch (error) {
			setSubmitLoading(false)

		}

	}

	const onFinishFailed = errorInfo => {
	};

	async function init() {
		try {
			setInitialLoading(true)
			const response = await getCountry();
			if (response.data?.length) {
				setHsnList(response.data)
				setIsModalOpen(false);
				// message.success(response.message)
			} else {
				setHsnList([])
			}
			setInitialLoading(false)
		} catch (error) {
			message.error(message)
		}
	}

	useEffect(() => {
		if (!isModalOpen) {
			addButtonRef?.current?.focus()
		} else {
			formInputRef?.current?.focus()
		}
	}, [isModalOpen])

	useEffect(() => {
		init()
	}, [])

	const dropdownMenu = row => (
		<Menu>
			<Menu.Item onClick={() => showEditModal(row)}>
				<Flex alignItems="center">
					<EditOutlined />
					<span className="ml-2">Edit</span>
				</Flex>
			</Menu.Item>
			<Menu.Item onClick={() => setOpenDeleteModal({ open: true, id: row.id, name: row.name })}>
				<Flex alignItems="center">
					<DeleteOutlined />
					<span className="ml-2">{selectedRows.length > 0 ? `Delete (${selectedRows.length})` : 'Delete'}</span>
				</Flex>
			</Menu.Item>
		</Menu>
	);


	const deleteRow = async (id) => {
		if (!id) return;
		setSubmitLoading(true)
		const response = await deleteCountry(id)
		setSubmitLoading(false)
		if (response.success === true) {
			message.success(response.message)
			init()
		}
		setOpenDeleteModal({
			open: false,
			id: '',
			name: ''
		})
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
						<Button ref={addButtonRef} onClick={showModal} type="primary" icon={<PlusCircleOutlined />} block> Country</Button>
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
						loading={initialLoading}
					/>
				</div>
			</Card>


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
					// style={{ width: showTitle ? '85%' : '100%' }}
					// style={{boxShadow: '2px 5px 15px -10px rgb(0,0,0,0.5)',  padding:'10px', width:'50%'}}
					{...layout}
					name="basic"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
				>
					<Form.Item
						className={`${showTitle ? '' : 'hide-label'}`}
						label="Country name"
						name="name"
						onKeyDown={handleEnter}
						rules={[{ required: true, message: 'Country Name field is required!' }]}
					>
						<Input ref={formInputRef} placeholder="Country name" />
					</Form.Item>
					<Form.Item
						className={`${showTitle ? '' : 'hide-label'}`}
						label="Country currency code"
						name="short_code"
						onKeyDown={handleEnter}
						rules={[{ required: true, message: 'Countery code field  is required' }]}
					>
						<Input placeholder='Country currency code' />
					</Form.Item>
					<Form.Item
						className={`${showTitle ? '' : 'hide-label'}`}
						label="Country code"
						onKeyDown={handleEnter}
						name="mobile_no_ext"
						rules={[{ required: true, message: 'Mobile no field is required' }]}
					>
						<Input placeholder='Country code' />
					</Form.Item>
					<Form.Item
						className={`${showTitle ? '' : 'hide-label'}`}
						label="Currency"
						name="currency"
						onKeyDown={handleEnter}
						rules={[{ required: true, message: 'Currency  field is required' }]}
					>
						<Input placeholder='Currency' />
					</Form.Item>
					<Form.Item {...tailLayout}  >
						<div
							style={{
								width: 'fit-content',
								display: "flex",
								justifyContent: "center"
							}}>
							<Button type="primary" htmlType="submit" loading={submitLoading}>
								{isEdit ? "Save" : "Submit"}
							</Button>
							<Button type="primary" onClick={handleCancel} style={{ marginLeft: '20px' }}	>
								Cancel
							</Button>
						</div>
					</Form.Item>
				</Form>
			</Modal>
			{/* Delete confirmation popup */}
			<Modal
				title={"Delete Country"}
				open={openDeleteModal.open}
				onCancel={() => setOpenDeleteModal({
					open: false,
					id: '',
					name: ''
				})}
				footer={[
					<Button
						type="primary"
						loading={submitLoading}
						htmlType="submit"
						onClick={() => deleteRow(openDeleteModal.id)}
					>
						Delete
					</Button>,
					<Button type="primary" onClick={() => setOpenDeleteModal({
						open: false,
						id: '',
						name: ''
					})}
					>
						Cancel
					</Button>
				]}
			>
				<div>
					<h2>{`Are you sure you want to delete ${openDeleteModal.name} Country?`}</h2>
				</div>
			</Modal>
		</>
	)
}

export default Country
