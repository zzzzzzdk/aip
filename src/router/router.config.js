import { lazy } from "react";
import Layout from "../components/Layout";
import { Home, User, Settings, Dashboard, TrainingModel } from "@/pages";

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
        private: false,
      },
      {
        path: "user",
        element: <User />,
        private: true,
      },
      {
        path: "settings",
        element: <Settings />,
        private: true,
      },
      {
        path: "training-model",
        element: <TrainingModel />,
        private: true,
        breadcrumb: [
          {
            text: "训练模型",
          },
        ],
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    private: true,
  },
];

export default routes;
