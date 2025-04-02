import React from "react";
import {
  Card,
  Button,
  Space,
  Tag,
  Input,
  Modal,
  Form,
  message,
  Layout,
  List,
  Typography,
  Select,
  InputNumber,
  Spin,
  Collapse,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  SettingOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import labelApi from "@/services/label";
import LabelEditModal from "@/components/Label/LabelEditModal";
import LabelAttributeModal from "@/components/Label/LabelAttributeModal";
import "./index.scss";
const { Content } = Layout;
const { Text } = Typography;
const { Option } = Select;

const Label = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [editingLabel, setEditingLabel] = React.useState(null);
  const [editingGroup, setEditingGroup] = React.useState(null);
  const [selectedGroup, setSelectedGroup] = React.useState(null);
  const [isAddingGroup, setIsAddingGroup] = React.useState(false);
  const [newGroupName, setNewGroupName] = React.useState("");
  const [groups, setGroups] = React.useState([]);
  const [labels, setLabels] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isAttributeModalVisible, setIsAttributeModalVisible] =
    React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState(null);
  const [attributeForm] = Form.useForm();

  // 修改状态声明，添加两个新的loading状态
  const [groupLoading, setGroupLoading] = React.useState(false);
  const [labelLoading, setLabelLoading] = React.useState(false);

  // 获取标签组列表
  const fetchGroups = async () => {
    try {
      setGroupLoading(true);
      const response = await labelApi.getGroupList();
      console.log("标签组列表获取成功", response);
      setGroups(response.data);

      // 如果有标签组，自动选中第一个
      if (response.data && response.data.length > 0) {
        const firstGroup = response.data[0];
        setSelectedGroup(firstGroup);
      }
    } catch (error) {
      console.error("获取标签组列表失败", error);
      message.error("获取标签组列表失败");
    } finally {
      setGroupLoading(false);
    }
  };

  // 获取标签列表
  const fetchLabels = async (groupId) => {
    try {
      setLabelLoading(true);
      const params = groupId ? { groupId } : {};
      const response = await labelApi.getLabelList(params);
      setLabels(response.data);
    } catch (error) {
      message.error("获取标签列表失败");
    } finally {
      setLabelLoading(false);
    }
  };

  // 组件加载时获取数据
  React.useEffect(() => {
    fetchGroups();
  }, []);

  // 选择标签组时重新获取标签列表
  React.useEffect(() => {
    if (selectedGroup) {
      fetchLabels(selectedGroup.id);
    }
  }, [selectedGroup]);

  const handleEdit = (record) => {
    setEditingLabel(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除标签"${record.name}"吗？`,
      onOk: async () => {
        try {
          await labelApi.deleteLabel(record.id);
          message.success("删除成功");
          fetchLabels(selectedGroup?.id);
        } catch (error) {
          message.error("删除标签失败");
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingLabel) {
        await labelApi.updateLabel(editingLabel.id, values);
        message.success("更新成功");
      } else {
        await labelApi.createLabel({ ...values, groupId: selectedGroup?.id });
        message.success("创建成功");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingLabel(null);
      fetchLabels(selectedGroup?.id);
    } catch (error) {
      console.log(error);
      message.error(editingLabel ? "更新标签失败" : "创建标签失败");
    }
  };

  const handleGroupEdit = (group) => {
    setEditingGroup(group);
  };

  const handleGroupSave = async (group) => {
    try {
      const newName = document.querySelector(`#group-name-${group.id}`).value;
      await labelApi.updateGroup(group.id, { name: newName });
      message.success("更新成功");
      setEditingGroup(null);
      fetchGroups();
    } catch (error) {
      message.error("更新标签组失败");
    }
  };

  const handleGroupCancel = () => {
    setEditingGroup(null);
  };

  const handleGroupDelete = (group) => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除标签组"${group.name}"吗？`,
      onOk: async () => {
        try {
          await labelApi.deleteGroup(group.id);
          message.success("删除成功");
          fetchGroups();
          if (selectedGroup?.id === group.id) {
            setSelectedGroup(null);
            fetchLabels();
          }
        } catch (error) {
          message.error("删除标签组失败");
        }
      },
    });
  };

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) {
      message.warning("请输入标签组名称");
      return;
    }
    try {
      await labelApi.createGroup({ name: newGroupName });
      message.success("添加成功");
      setIsAddingGroup(false);
      setNewGroupName("");
      fetchGroups();
    } catch (error) {
      message.error("添加标签组失败");
    }
  };

  const handleCancelAddGroup = () => {
    setIsAddingGroup(false);
    setNewGroupName("");
  };

  // 属性相关功能
  const handleAttributeEdit = (label) => {
    setSelectedLabel(label);
    attributeForm.resetFields();
    setIsAttributeModalVisible(true);
  };

  const handleAttributeModalOk = async () => {
    try {
      const values = await attributeForm.validateFields();
      // 处理属性数据
      const attributes = values.attributes.map((attr) => ({
        name: attr.name,
        values: attr.attributeValues.map((val) => val.value),
      }));
      // 调用API添加属性
      await labelApi.addAttributes(selectedLabel.id, attributes);
      message.success("添加属性成功");
      setIsAttributeModalVisible(false);
      attributeForm.resetFields();
      setSelectedLabel(null);
      fetchLabels(selectedGroup?.id);
    } catch (error) {
      console.log(error);
      message.error("添加属性失败");
    }
  };

  const renderLabelItem = (item) => (
    <List.Item style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
        <Space>
          <Button
            type="link"
            onClick={() => handleAttributeEdit(item)}
            icon={<PlusOutlined />}
            title="添加属性"
            size="small"
          >
            添加属性
          </Button>
          <Button
            type="link"
            onClick={() => handleEdit(item)}
            title="修改"
            size="small"
          >
            修改
          </Button>
          <Button
            type="text"
            danger
            onClick={() => handleDelete(item)}
            title="删除"
            size="small"
          >
            删除
          </Button>
        </Space>
      </div>
      <List.Item.Meta
        title={
          <Space>
            <Text strong>{item.name}</Text>
          </Space>
        }
        description={
          <Space direction="vertical" style={{ width: "100%" }}>
            {item.attributes && item.attributes.length > 0 && (
              <Space wrap>
                {item.attributes.map((attr, index) => (
                  <div className="label-attribute">{attr.name}</div>
                  // <div key={index}>
                  //   {attr.values &&
                  //     attr.values.map((value, i) => (
                  //       <Tag key={i} color="blue">
                  //         {value}
                  //       </Tag>
                  //     ))}
                  // </div>
                ))}
              </Space>
            )}
          </Space>
        }
      />
    </List.Item>
  );

  const panelStyle = {
    marginBottom: 24,
    border: "none",
  };

  return (
    <Layout className="label-page">
      {contextHolder}
      <Content className="label-page-content">
        {/* 左侧标签组列表 */}
        <Card
          title="标签组管理"
          className="label-group-list"
          extra={
            <Button type="primary" onClick={() => setIsAddingGroup(true)}>
              新建标签组
            </Button>
          }
        >
          <Spin spinning={groupLoading}>
            {groups.length === 0 ? (
              <div style={{ textAlign: "center", padding: 20 }}>暂无标签组</div>
            ) : (
              <List
                dataSource={groups}
                header={
                  isAddingGroup && (
                    <div className="add-group-input">
                      <Input
                        placeholder="请输入标签组名称"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        style={{ width: 180 }}
                      />
                      <div className="add-group-btn">
                        <Button type="link" onClick={handleAddGroup} size="small">
                          确定
                        </Button>
                        <Button
                          type="link"
                          onClick={handleCancelAddGroup}
                          size="small"
                        >
                          取消
                        </Button>
                      </div>
                    </div>
                  )
                }
                renderItem={(group) => (
                  <List.Item
                    actions={[
                      editingGroup?.id === group.id ? (
                        <>
                          <Button
                            type="link"
                            onClick={() => handleGroupSave(group)}
                          >
                            确定
                          </Button>
                          <Button type="link" onClick={handleGroupCancel}>
                            取消
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            type="link"
                            onClick={() => handleGroupEdit(group)}
                          >
                            编辑
                          </Button>
                          <Button
                            type="link"
                            danger
                            onClick={() => handleGroupDelete(group)}
                          >
                            删除
                          </Button>
                        </>
                      ),
                    ]}
                  >
                    {editingGroup?.id === group.id ? (
                      <Input
                        id={`group-name-${group.id}`}
                        defaultValue={group.name}
                      />
                    ) : (
                      <Text
                        style={{
                          cursor: "pointer",
                          color:
                            selectedGroup?.id === group.id
                              ? "#1890ff"
                              : "inherit",
                        }}
                        onClick={() => setSelectedGroup(group)}
                      >
                        {group.name}
                      </Text>
                    )}
                  </List.Item>
                )}
              />
            )}
          </Spin>
        </Card>

        {/* 右侧标签列表 */}
        <Card
          title="标签管理"
          className="label-list"
          extra={
            <Button
              type="primary"
              onClick={() => {
                setEditingLabel(null);
                form.resetFields();
                setIsModalVisible(true);
              }}
            >
              新增标签
            </Button>
          }
        >
          <Spin spinning={labelLoading}>
            <div className="label-cards">
              {labels.length === 0 ? (
                <div style={{ textAlign: "center", padding: 20 }}>暂无标签</div>
              ) : (
                labels.map((label) => (
                  <Card
                    key={label.id}
                    style={{ marginBottom: 16 }}
                    className="label-card-item"
                  >
                    {renderLabelItem(label)}
                  </Card>
                ))
              )}
            </div>
          </Spin>
        </Card>

        {/* 标签编辑/新建弹窗 */}
        <LabelEditModal
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setEditingLabel(null);
          }}
          form={form}
          editingLabel={editingLabel}
        />

        {/* 标签属性添加弹窗 */}
        <LabelAttributeModal
          visible={isAttributeModalVisible}
          onOk={handleAttributeModalOk}
          onCancel={() => {
            setIsAttributeModalVisible(false);
            attributeForm.resetFields();
            setSelectedLabel(null);
          }}
          form={attributeForm}
        />
      </Content>
    </Layout>
  );
};

export default Label;
