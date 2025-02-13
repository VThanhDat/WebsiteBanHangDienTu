import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import path from "../utils/path";
import { logout } from "../store/user/userSlice";
import { getCurrent } from "../store/user/asyncThunk";

const TopHeader = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, current } = useSelector((state) => state.user);

  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      if (isLoggedIn && !current) dispatch(getCurrent());
    }, 300);

    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [dispatch, isLoggedIn, current]);

  return (
    <div className="flex h-[60px] w-full justify-center bg-subs">
      <div className="flex w-full max-w-main items-center justify-between text-sm text-black max-xl:px-3">
        <span className="mr-4 text-base font-medium">
          ORDER ONLINE OR CALL US (+84) 32 XXXX XXX
        </span>
        {isLoggedIn && current ? (
          <div className="flex items-center gap-4">
            <span className="text-base font-medium">
              {`Welcome, ${current?.firstName} ${current?.lastName}`}
            </span>
            <span
              onClick={() => dispatch(logout())}
              className="cursor-pointer p-2 text-base font-medium hover:rounded-full hover:bg-gray-200 hover:text-main"
            >
              LOG OUT
            </span>
          </div>
        ) : (
          <Link
            className="text-base font-medium transition-colors hover:text-main"
            to={`/${path.LOGIN}`}
          >
            SIGN IN | REGISTER
          </Link>
        )}
      </div>
    </div>
  );
};

export default memo(TopHeader);
