import React from "react";
import { Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import User from "@/pages/User";
import Settings from "@/pages/Settings";
import Dashboard from "@/pages/Dashboard";
import TrainingModel from "@/pages/TrainingModel";
import TrainingTask from "@/pages/TrainingTask";
import TrainingResult from "@/pages/TrainingResult";
import Dataset from "@/pages/Dataset";
import DatasetDetails from "@/pages/Dataset/Details";
import Label from "@/pages/Label";
import RecycleBin from "@/pages/RecycleBin";

const routes = [
  {
    path: "/",
    element: <Layout />,
    public: true,
    children: [
      {
        path: "/",
        element: <Navigate to="/training-model" replace />,
      },
      {
        path: "/dashboard",
        name: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/training-model",
        name: "/training-model",
        element: <TrainingModel />,
        breadcrumb: [{ text: "模型训练" }],
      },
      {
        path: "/training-task",
        name: "/training-model",
        element: <TrainingTask />,
        breadcrumb: [
          { text: "模型训练", path: "/training-model" },
          { text: "训练任务" },
        ],
      },
      {
        path: "/training-result",
        name: "/training-model",
        element: <TrainingResult />,
        breadcrumb: [
          { text: "模型训练", path: "/training-model" },
          { text: "训练结果" },
        ],
      },
      {
        path: "/dataset",
        name: "/dataset",
        element: <Dataset />,
        breadcrumb: [{ text: "数据集" }],
      },
      {
        path: "/dataset/details",
        name: "/dataset",
        element: <DatasetDetails />,
        breadcrumb: [
          { text: "数据集", path: "/dataset" },
          { text: "数据集详情" },
        ],
      },
      {
        path: "/label",
        name: "/label",
        element: <Label />,
        breadcrumb: [{ text: "标签管理" }],
      },
      {
        path: "/recycle-bin",
        name: "/recycle-bin",
        element: <RecycleBin />,
        breadcrumb: [{ text: "回收站" }],
      },
      {
        path: "/user",
        name: "/user",
        element: <User />,
      },
      {
        path: "/settings",
        name: "/settings",
        element: <Settings />,
      },
    ],
  },
];

export default routes;
