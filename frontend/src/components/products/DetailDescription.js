import React, { memo, useCallback, useState } from "react";
import { Votebar, Button, VoteOption, Comment } from "..";
import { capitalize, renderStarFromNumber } from "../../utils/helpers";
import moment from "moment";
import { apiRatings } from "../../apis";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../../store/app/appSlice";
import Swal from "sweetalert2";
import path from "../../utils/path";
import { useNavigate } from "react-router-dom";

const DetailDescription = ({
  description = [],
  review = [],
  totalRatings,
  ratings,
  nameProduct,
  pid,
  rerender,
}) => {
  const contentBox = [
    { id: 1, label: "DESCRIPTION", title: "", content: description },
    {
      id: 2,
      label: "WARRANTY",
      title: "WARRANTY INFORMATION",
      content: [
        "LIMITED WARRANTIES",
        "Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:",
        "",
        "Frames Used In Upholstered and Leather Products",
        "Limited Lifetime Warranty",
        "A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers. Ashley Furniture Industries,Inc. warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.",
      ],
    },
    {
      id: 3,
      label: "DELIVERY",
      title: "PURCHASING & DELIVERY",
      content: [
        "Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.",
        "Picking up at the store",
        "Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.",
        "Delivery",
        "Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.",
        "In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.",
      ],
    },
    {
      id: 4,
      label: "PAYMENT",
      title: "PURCHASING & DELIVERY",
      content: [
        "Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.",
        "Picking up at the store",
        "Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.",
        "Delivery",
        "Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.",
        "In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.",
      ],
    },
    {
      id: 5,
      label: "CUSTOMER REVIEW",
      title: "CUSTOMERS REVIEWS",
      content: review.sort((a, b) => {
        if (a?.createdAt > b?.createdAt) {
          return -1;
        }
        if (a?.createdAt < b?.createdA) {
          return 1;
        }
        return 0;
      }),
    },
  ];

  const [boxActive, setboxActive] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);
  const handleSubmitVoteOption = async ({ comment, score }) => {
    if (!comment || !pid || !score) {
      alert("Please vote when click submit");
      return;
    }
    await apiRatings({
      star: score,
      comment,
      pid,
      updatedAt: Date.now(),
    });
    dispatch(
      showModal({
        isShowModal: false,
        modalChildren: null,
      }),
    );
    rerender();
  };
  const handleVoteNow = () => {
    if (!isLoggedIn) {
      Swal.fire({
        text: "Login to vote",
        cancelButtonText: "Cancel",
        confirmButtonText: "Go login",
        showCancelButton: true,
        title: "Oops!",
      }).then((rs) => {
        if (rs.isConfirmed) {
          navigate(`/${path.LOGIN}`);
        }
      });
    } else {
      dispatch(
        showModal({
          isShowModal: true,
          modalChildren: (
            <VoteOption
              nameProduct={nameProduct}
              handleSubmitVoteOption={handleSubmitVoteOption}
            />
          ),
        }),
      );
    }
  };

  return (
    <div className="mb-[50px] flex md:flex-col">
      <div className="flex gap-1 max-md:flex-col">
        {contentBox.map((item) => (
          <div
            key={item.id}
            className={`border px-5 py-[9px] text-gray-700 max-sm:px-2 max-sm:text-xs ${
              item.id === boxActive
                ? "z-10 bg-white max-md:border-r-white md:border-b-white"
                : "bg-gray-200 hover:cursor-pointer"
            } `}
            onClick={() => {
              setboxActive(item.id);
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
      <div className="w-full border p-5 text-gray-700 max-md:ml-[-1px] md:mt-[-1px]">
        {contentBox.map((item) => {
          if (item.id === 1)
            return (
              <div
                key={item.id}
                className={`${
                  item.id === boxActive ? "" : "hidden"
                } animate-slide-in-fwd-center`}
                onClick={() => {
                  setboxActive(item.id);
                }}
              >
                {item.title && (
                  <h3 className="mb-[10px] text-xl font-semibold text-gray-700">
                    {item.title}
                  </h3>
                )}
                {item.content.map((item, index) =>
                  item ? (
                    <li className="mb-[5px] text-sm" key={index}>
                      {item}
                    </li>
                  ) : (
                    <br key={index} />
                  ),
                )}
              </div>
            );
          else if (item.id === 5)
            return (
              <div
                key={item.id}
                className={`${
                  item.id === boxActive ? "" : "hidden"
                } animate-slide-in-fwd-center`}
                onClick={() => {
                  setboxActive(item.id);
                }}
              >
                <div className="max-h-screen overflow-y-scroll">
                  <div className="flex border">
                    <div className="flex flex-4 flex-col items-center justify-center">
                      <span className="text-3xl font-semibold">{`${totalRatings}/5`}</span>
                      <span className="flex items-center gap-1">
                        {renderStarFromNumber(totalRatings)?.map(
                          (el, index) => (
                            <span key={index}>{el}</span>
                          ),
                        )}
                      </span>
                      <span className="text-sm">{`${ratings?.length} reviews and commentors`}</span>
                    </div>
                    <div className="flex flex-6 flex-col gap-2 p-4">
                      {Array.from(Array(5).keys())
                        .reverse()
                        .map((el) => (
                          <Votebar
                            key={el}
                            number={el + 1}
                            ratingTotal={ratings?.length}
                            ratingCount={
                              Array.isArray(ratings)
                                ? ratings.filter((i) => i.star === el + 1)
                                    .length
                                : 0
                            }
                          />
                        ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2 p-4 text-sm">
                    <span>Do you review this product?</span>
                    <Button
                      type="button"
                      name="Vote now!"
                      handleClick={handleVoteNow}
                      className={`text-semibold rounded-md bg-main px-4 py-2 text-white`}
                    ></Button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {ratings?.map((el) => (
                      <Comment
                        key={el._id}
                        star={el.star}
                        updatedAt={el.updatedAt}
                        comment={el.comment}
                        name={`${el.postedBy?.lastName} ${el.postedBy?.firstName}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          else
            return (
              <div
                key={item.id}
                className={`${
                  item.id === boxActive ? "" : "hidden"
                } animate-slide-in-fwd-center`}
                onClick={() => {
                  setboxActive(item.id);
                }}
              >
                {item.title && (
                  <h3 className="mb-[10px] text-xl font-semibold text-gray-700">
                    {item.title}
                  </h3>
                )}
                {item.content.map((item, index) =>
                  item ? (
                    <p className="mb-[10px] text-sm" key={index}>
                      {item}
                    </p>
                  ) : (
                    <br key={index} />
                  ),
                )}
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default memo(DetailDescription);
