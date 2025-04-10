import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiGetOrders, apiGetUsers } from "../../apis";
import { formatMoney } from "../../utils/helpers";

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    orderCount: 0,
    orderCountToday: 0,
    orderCountYesterday: 0,
    pendingOrderCount: 0,
    pendingOrderYesterdayCount: 0,
    userCount: 0,
    userCountToday: 0,
  });

  const token = useSelector((state) => state.user.token);

  const fetchOrders = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setHours(0, 0, 0, 0);
    yesterday.setDate(yesterday.getDate() - 1);

    const [
      ordersRes,
      ordersTodayRes,
      ordersYesterdayRes,
      pendingOrdersRes,
      pendingOrdersYesterdayRes,
    ] = await Promise.all([
      apiGetOrders(token),
      apiGetOrders(token, { createdAt: { gte: today.getTime() } }),
      apiGetOrders(token, {
        createdAt: { gte: yesterday.getTime(), lt: today.getTime() },
      }),
      apiGetOrders(token, { status: "Processing" }),
      apiGetOrders(token, {
        status: "Processing",
        createdAt: { lt: today.getTime() },
      }),
    ]);

    setDashboardStats((prev) => ({
      ...prev,
      ...(ordersRes?.success && { orderCount: ordersRes.counts }),
      ...(ordersTodayRes?.success && {
        orderCountToday: ordersTodayRes.counts,
      }),
      ...(ordersYesterdayRes?.success && {
        orderCountYesterday: ordersYesterdayRes.counts,
      }),
      ...(pendingOrdersRes?.success && {
        pendingOrderCount: pendingOrdersRes.counts,
      }),
      ...(pendingOrdersYesterdayRes?.success && {
        pendingOrderYesterdayCount: pendingOrdersYesterdayRes.counts,
      }),
    }));
  };

  const fetchUsers = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [usersRes, usersTodayRes] = await Promise.all([
      apiGetUsers(token),
      apiGetUsers(token, { createdAt: { gte: today.getTime() } }),
    ]);

    setDashboardStats((prev) => ({
      ...prev,
      ...(usersRes?.success && { userCount: usersRes.counts }),
      ...(usersTodayRes?.success && { userCountToday: usersTodayRes.counts }),
    }));
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  return (
    <div className="h-auto w-full px-4 py-6">
      <div className="flex h-full w-full flex-col gap-4 md:flex-row">
        {/* Orders received Card */}
        <div className="flex min-w-[200px] flex-1 flex-col justify-between rounded-lg border bg-white p-4">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold sm:text-3xl">
                {formatMoney(dashboardStats.orderCount) || 0}
              </span>
              <span className="text-base sm:text-lg">Orders received</span>
            </div>
            <span className="flex aspect-square w-12 shrink-0 items-center justify-center rounded-full bg-green-400 text-lg text-white sm:w-16">
              <svg
                width="24"
                height="24"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.37 7.87988H16.62"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M5.38 7.87988L6.13 8.62988L8.38 6.37988"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M11.37 14.8799H16.62"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M5.38 14.8799L6.13 15.6299L8.38 13.3799"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M8 21H14C19 21 21 19 21 14V8C21 3 19 1 14 1H8C3 1 1 3 1 8V14C1 19 3 21 8 21Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
          </div>
          <span className="mt-2 flex w-24 flex-grow-0 items-center justify-center rounded-md border border-green-400 bg-green-50 py-1 text-xs text-green-400 sm:text-sm">
            <span className="mr-2 flex items-center">
              {(Math.round(
                (dashboardStats.orderCountToday /
                  (dashboardStats.orderCount || 1)) *
                  100,
              ) /
                100) *
                100}
              %
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1V18C1 19.66 2.34 21 4 21H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M4 16L8.59 10.64C9.35 9.76001 10.7 9.7 11.52 10.53L12.47 11.48C13.29 12.3 14.64 12.25 15.4 11.37L20 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </span>
        </div>

        {/* Daily Sales Card */}
        <div className="flex min-w-[200px] flex-1 flex-col justify-between rounded-lg border bg-white p-4">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold sm:text-3xl">
                {dashboardStats.orderCountToday}
              </span>
              <span className="text-base sm:text-lg">Daily Sales</span>
            </div>
            <span className="flex aspect-square w-12 shrink-0 items-center justify-center rounded-full bg-purple-400 text-lg text-white sm:w-16">
              <svg
                width="24"
                height="24"
                viewBox="0 0 20 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 21H19"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M3.59998 7.37988H2C1.45 7.37988 1 7.82988 1 8.37988V16.9999C1 17.5499 1.45 17.9999 2 17.9999H3.59998C4.14998 17.9999 4.59998 17.5499 4.59998 16.9999V8.37988C4.59998 7.82988 4.14998 7.37988 3.59998 7.37988Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M10.7999 4.18994H9.19995C8.64995 4.18994 8.19995 4.63994 8.19995 5.18994V16.9999C8.19995 17.5499 8.64995 17.9999 9.19995 17.9999H10.7999C11.3499 17.9999 11.7999 17.5499 11.7999 16.9999V5.18994C11.7999 4.63994 11.3499 4.18994 10.7999 4.18994Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M17.9999 1H16.3999C15.8499 1 15.3999 1.45 15.3999 2V17C15.3999 17.55 15.8499 18 16.3999 18H17.9999C18.5499 18 18.9999 17.55 18.9999 17V2C18.9999 1.45 18.5499 1 17.9999 1Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
          </div>
          <span className="mt-2 flex w-24 flex-grow-0 items-center justify-center rounded-md border border-purple-400 bg-purple-50 py-1 text-xs text-purple-400 sm:text-sm">
            <span className="mr-2 flex items-center">
              {(Math.round(
                (dashboardStats.orderCountToday /
                  (dashboardStats.orderCountYesterday || 1)) *
                  100,
              ) /
                100) *
                100}
              %
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1V18C1 19.66 2.34 21 4 21H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M4 16L8.59 10.64C9.35 9.76001 10.7 9.7 11.52 10.53L12.47 11.48C13.29 12.3 14.64 12.25 15.4 11.37L20 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </span>
        </div>

        {/* Total Customers Card */}
        <div className="flex min-w-[200px] flex-1 flex-col justify-between rounded-lg border bg-white p-4">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold sm:text-3xl">
                {dashboardStats.userCount}
              </span>
              <span className="text-base sm:text-lg">Total Customers</span>
            </div>
            <span className="flex aspect-square w-12 shrink-0 items-center justify-center rounded-full bg-blue-400 text-lg text-white sm:w-16">
              <svg
                width="24"
                height="24"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 6.16C16.94 6.15 16.87 6.15 16.81 6.16C15.43 6.11 14.33 4.98 14.33 3.58C14.33 2.15 15.48 1 16.91 1C18.34 1 19.49 2.16 19.49 3.58C19.48 4.98 18.38 6.11 17 6.16Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M15.9699 13.44C17.3399 13.67 18.8499 13.43 19.9099 12.72C21.3199 11.78 21.3199 10.24 19.9099 9.30004C18.8399 8.59004 17.3099 8.35003 15.9399 8.59003"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M4.96998 6.16C5.02998 6.15 5.09998 6.15 5.15998 6.16C6.53998 6.11 7.63998 4.98 7.63998 3.58C7.63998 2.15 6.48998 1 5.05998 1C3.62998 1 2.47998 2.16 2.47998 3.58C2.48998 4.98 3.58998 6.11 4.96998 6.16Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M5.99994 13.44C4.62994 13.67 3.11994 13.43 2.05994 12.72C0.649941 11.78 0.649941 10.24 2.05994 9.30004C3.12994 8.59004 4.65994 8.35003 6.02994 8.59003"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M11 13.63C10.94 13.62 10.87 13.62 10.81 13.63C9.42996 13.58 8.32996 12.45 8.32996 11.05C8.32996 9.61997 9.47995 8.46997 10.91 8.46997C12.34 8.46997 13.49 9.62997 13.49 11.05C13.48 12.45 12.38 13.59 11 13.63Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M8.08997 16.78C6.67997 17.72 6.67997 19.26 8.08997 20.2C9.68997 21.27 12.31 21.27 13.91 20.2C15.32 19.26 15.32 17.72 13.91 16.78C12.32 15.72 9.68997 15.72 8.08997 16.78Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
          </div>
          <span className="mt-2 flex w-24 flex-grow-0 items-center justify-center rounded-md border border-blue-400 bg-blue-50 py-1 text-xs text-blue-400 sm:text-sm">
            <span className="mr-2 flex items-center">
              {(Math.round(
                (dashboardStats.userCountToday /
                  (dashboardStats.userCount || 1)) *
                  100,
              ) /
                100) *
                100}
              %
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1V18C1 19.66 2.34 21 4 21H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M4 16L8.59 10.64C9.35 9.76001 10.7 9.7 11.52 10.53L12.47 11.48C13.29 12.3 14.64 12.25 15.4 11.37L20 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </span>
        </div>

        {/* Pending Orders Card */}
        <div className="flex min-w-[200px] flex-1 flex-col justify-between rounded-lg border bg-white p-4">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold sm:text-3xl">
                {dashboardStats.pendingOrderCount}
              </span>
              <span className="text-base sm:text-lg">Pending Orders</span>
            </div>
            <span className="flex aspect-square w-12 shrink-0 items-center justify-center rounded-full bg-orange-400 text-lg text-white sm:w-16">
              <svg
                width="24"
                height="24"
                viewBox="0 0 23 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.17004 6.43994L11 11.5499L19.77 6.46991"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M11 20.6099V11.5399"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M20.61 8.17V13.83C20.61 13.88 20.61 13.92 20.6 13.97C19.9 13.36 19 13 18 13C17.06 13 16.19 13.33 15.5 13.88C14.58 14.61 14 15.74 14 17C14 17.75 14.21 18.46 14.58 19.06C14.67 19.22 14.78 19.37 14.9 19.51L13.07 20.52C11.93 21.16 10.07 21.16 8.92999 20.52L3.59 17.56C2.38 16.89 1.39001 15.21 1.39001 13.83V8.17C1.39001 6.79 2.38 5.11002 3.59 4.44002L8.92999 1.48C10.07 0.84 11.93 0.84 13.07 1.48L18.41 4.44002C19.62 5.11002 20.61 6.79 20.61 8.17Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M22 17C22 18.2 21.47 19.27 20.64 20C19.93 20.62 19.01 21 18 21C15.79 21 14 19.21 14 17C14 15.74 14.58 14.61 15.5 13.88C16.19 13.33 17.06 13 18 13C20.21 13 22 14.79 22 17Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M18.25 15.75V17.25L17 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
          </div>
          <span className="mt-2 flex w-24 flex-grow-0 items-center justify-center rounded-md border border-orange-400 bg-orange-50 py-1 text-xs text-orange-400 sm:text-sm">
            <span className="mr-2 flex items-center">
              {(Math.round(
                (dashboardStats.pendingOrderCount /
                  (dashboardStats.pendingOrderYesterdayCount || 1) -
                  1) *
                  100,
              ) /
                100) *
                100}
              %
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1V18C1 19.66 2.34 21 4 21H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M4 16L8.59 10.64C9.35 9.76001 10.7 9.7 11.52 10.53L12.47 11.48C13.29 12.3 14.64 12.25 15.4 11.37L20 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
