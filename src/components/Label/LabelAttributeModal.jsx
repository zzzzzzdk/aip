import React from "react";
import { Modal, Form, Input, Button, Space, Collapse } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./index.scss";

const LabelAttributeModal = ({ visible, onOk, onCancel, form }) => {
  return (
    <Modal
      title="添加标签属性"
      className="label-attribute-modal modal-common"
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={700}
    >
      <Form form={form} layout="vertical">
        <Form.List
          name="attributes"
          initialValue={[
            { name: "", attributeValues: [""] },
          ]}
        >
          {(fields, { add: addAttribute, remove: removeAttribute }) => (
            <Space direction="vertical" style={{ width: "100%" }}>
              <Collapse
                bordered={false}
                defaultActiveKey={["0"]}
                // activeKey={['0']}
                onChange={(key) => {
                  console.log(key);
                }}
                items={fields.map((field, index) => ({
                  key: index,
                  label: (
                    <div>
                      <Form.Item
                        {...field}
                        layout="horizontal"
                        label="属性名"
                        name={[field.name, "name"]}
                        rules={[{ required: true, message: "请输入属性名" }]}
                      >
                        <Input placeholder="请输入内容" />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <Button
                          type="link"
                          danger
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAttribute(field.name);
                          }}
                        >
                          删除
                        </Button>
                      ) : (
                        ""
                      )}
                    </div>
                  ),
                  children: (
                    <div className="label-attributes">
                      <Form.Item style={{ marginBottom: 0 }}>
                        <Form.List name={[field.name, "attributeValues"]}>
                          {(
                            subFields,
                            { add: addValue, remove: removeValue }
                          ) => (
                            <div className="label-attribute-item-wrap">
                              {subFields.map((subField, childIndex) => (
                                <div
                                  key={subField.key + `${index}-${childIndex}`}
                                  className="label-attribute-item"
                                >
                                  <Form.Item
                                    {...subField}
                                    name={[subField.name, "value"]}
                                    label="属性值"
                                    rules={[
                                      {
                                        required: true,
                                        message: "请输入属性值",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="请输入属性值" />
                                  </Form.Item>
                                  {subFields.length > 1 ? (
                                    <Button
                                      type="link"
                                      danger
                                      onClick={() => removeValue(subField.name)}
                                    >
                                      删除
                                    </Button>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              ))}
                              <Form.Item>
                                <Button
                                  type="primary"
                                  ghost
                                  onClick={() => addValue()}
                                  icon={<PlusOutlined />}
                                  style={{ width: "100%" }}
                                >
                                  添加属性值
                                </Button>
                              </Form.Item>
                            </div>
                          )}
                        </Form.List>
                      </Form.Item>
                    </div>
                  ),
                }))}
              />
              <Form.Item>
                <Button
                  onClick={() => addAttribute({ attributeValues: [""] })}
                  type="primary"
                  ghost
                  block
                  icon={<PlusOutlined />}
                >
                  添加属性
                </Button>
              </Form.Item>
            </Space>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default LabelAttributeModal;
