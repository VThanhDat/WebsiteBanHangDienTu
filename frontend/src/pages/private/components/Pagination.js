import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import icons from "../../../utils/icons";

const { GrFormNextLink, GrFormPreviousLink } = icons;

const Pagination = ({ totalItem, currentPage, limitItem = 12 }) => {
  const location = useLocation();
  const totalPage =
    useMemo(() => {
      return Math.ceil(+totalItem / +limitItem);
    }, [totalItem, limitItem]) || 1;

  return (
    <div className="flex items-center">
      {+currentPage > 1 && (
        <Link
          to={`${location.pathname}?page=${
            +currentPage - 1
          }&limit=${limitItem}`}
        >
          <GrFormPreviousLink size={20} />
        </Link>
      )}
      <Link
        to={`${location.pathname}?page=${+currentPage}&limit=${+limitItem}`}
        className="text-main"
      >
        {currentPage}
      </Link>
      <span className="mx-2">of</span>
      <span>{totalPage}</span>

      {+currentPage < totalPage && (
        <Link
          to={`${location.pathname}?page=${
            +currentPage + 1
          }&limit=${+limitItem}`}
        >
          <GrFormNextLink size={20} />
        </Link>
      )}
    </div>
  );
};

export default Pagination;
