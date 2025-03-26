import React, { memo } from "react";
import { Link } from "react-router-dom";
import icons from "../../utils/icons";
import path from "../../utils/path";

const { MdEmail } = icons;

const Footer = () => {
  return (
    <div className="w-full">
      <div className="flex w-full flex-col items-center bg-main">
        <div className="flex min-h-[103px] w-full max-w-main items-center justify-between max-xl:px-3 max-md:flex-col max-md:items-start">
          <div className="flex flex-1 flex-col">
            <span className="text-[20px] text-white">
              SIGN UP TO NEWSLETTER
            </span>
            <small className="text-[13px] text-gray-300 max-md:mb-3">
              Subscribe now and receive weekly newslette
            </small>
          </div>
          <div className="flex h-[50px] flex-1 items-center rounded-l-full rounded-r-full bg-[#F04646] pl-5 text-white max-md:mb-3 max-md:w-full">
            <input
              className="h-[50px] w-full bg-transparent text-[14px] outline-none placeholder:text-sm placeholder:text-gray-300"
              placeholder="Email address"
            />
            <div className="rounded-r-full p-5">
              <MdEmail />
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center bg-[#191919]">
        <div className="flex min-h-[407px] w-full max-w-main items-center text-[13px] text-white max-lg:p-3">
          <div className="flex w-full flex-wrap">
            <div className="flex flex-col max-lg:w-full lg:flex-2">
              <h3 className="mb-5 border-l-[3px] border-main pl-[15px] text-[15px] font-medium">
                ABOUT US
              </h3>
              <span className="mb-[13px]">
                <span>Address: </span>
                <span className="opacity-70">
                  Đ. 3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ
                </span>
              </span>
              <span className="mb-[13px]">
                <span> Phone: </span>
                <span className="opacity-70">(+84)32xxxxxxx</span>
              </span>
              <span className="mb-[13px]">
                <span>Mail: </span>
                <span className="opacity-70">support@support.com.vn</span>
              </span>
            </div>
            <div className="flex flex-col max-lg:w-1/3 max-md:w-full lg:flex-1">
              <h3 className="mb-5 border-l-[3px] border-main pl-[15px] text-[15px] font-medium">
                INFORMATION
              </h3>
              <div className="mb-[13px] opacity-70">
                <Link to={path.HOME}>Typography</Link>
              </div>
              <div className="mb-[13px] opacity-70">
                <Link to={path.HOME}>Gallery</Link>
              </div>
              <div className="mb-[13px] opacity-70">
                <Link to={path.HOME}>Store Location</Link>
              </div>
              <div className="mb-[13px] opacity-70">
                <Link to={path.HOME}>Today's Deals</Link>
              </div>
              <div className="mb-[13px] opacity-70">
                <Link to={path.HOME}>Contact</Link>
              </div>
            </div>
            <div className="flex flex-col max-lg:w-1/3 max-md:w-full lg:flex-1">
              <h3 className="mb-5 border-l-[3px] border-main pl-[15px] text-[15px] font-medium">
                WHO WE ARE
              </h3>
              <div className="mb-[13px] opacity-70">
                <Link to={path.HOME}>Help</Link>
              </div>
              <div className="mb-[13px] opacity-70">
                <Link to={path.HOME}>Free Shipping</Link>
              </div>
              <div className="mb-[13px] opacity-70">
                <Link to={path.HOME}>FAQs</Link>
              </div>
              <div className="mb-[13px] opacity-70">
                <Link to={path.HOME}>Return & Exchange</Link>
              </div>
              <div className="mb-[13px] opacity-70">
                <Link to={path.HOME}>Testimonials</Link>
              </div>
            </div>
            <div className="flex flex-col max-lg:w-1/3 max-md:w-full lg:flex-1">
              <h3 className="mb-5 border-l-[3px] border-main pl-[15px] text-[15px] font-medium">
                #DIGITALWORLDSTORE
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-[70px] w-full items-center justify-center bg-black text-gray-500">
        <div className="flex w-full max-w-main items-center justify-between max-xl:px-3">
          <div className="text-sm">
            © 2025, Digital World 2 Powered by Shopify
          </div>
          <div className="flex gap-5">
            <svg
              aria-hidden="true"
              focusable="false"
              role="presentation"
              className="w-[50px]"
              viewBox="0 0 27 20"
            >
              <path
                fill="#fff"
                d="M19.16 8.465q-.781-.352-1.621-.332-.605 0-.928.225t-.322.508.283.508.947.557q1.855.84 1.836 2.285 0 1.328-1.035 2.119t-2.773.791q-1.445-.02-2.441-.449l.293-1.914.273.156q1.113.449 2.07.449.527 0 .918-.225t.41-.635q0-.273-.254-.498t-.918-.557q-.371-.195-.654-.371t-.596-.459-.488-.664-.176-.811q.02-1.23 1.064-2.002t2.666-.771q1.035 0 1.953.332l-.273 1.855zm-9.14-1.934l-3.457 8.477H4.258L2.461 8.25q.938.371 1.709 1.133t1.104 1.66Q4.063 7.703.001 6.688l.02-.156h3.535q.82 0 .996.684l.762 3.906.254 1.172 2.129-5.762h2.324zm3.085 0l-1.367 8.477H9.55l1.367-8.477h2.188zm13.946 8.477H25q-.156-.996-.234-1.27l-2.813-.02-.449 1.289H19.18l3.262-7.793q.293-.684 1.152-.684h1.68zM23.77 8.797l-.137.361q-.078.205-.127.342t-.029.117q-.703 1.875-.879 2.383h1.777l-.469-2.461z"
              ></path>
            </svg>
            <svg
              aria-hidden="true"
              focusable="false"
              role="presentation"
              className="w-[50px]"
              viewBox="0 0 23 15"
            >
              <path
                d="M17.375 8.166c-.537 0-.644.237-.644.437 0 .1.061.276.284.276.437 0 .53-.575.514-.699-.015 0-.03-.015-.154-.015zm-6.301-.975c-.399 0-.476.453-.476.499h.813c-.008-.039.07-.499-.337-.499zm-5.526.975c-.537 0-.645.237-.645.437 0 .1.061.276.285.276.437 0 .53-.575.514-.699-.016 0-.03-.015-.154-.015zm15.45-.899c-.323 0-.576.376-.576.937 0 .346.122.568.384.568.399 0 .583-.515.583-.899.008-.422-.13-.606-.392-.606zM16.292.951a6.7 6.7 0 0 0-4.368 1.62 7.007 7.007 0 0 1 1.88 3.024h-.322a6.772 6.772 0 0 0-1.789-2.817 6.723 6.723 0 0 0-1.788 2.817h-.323A7.004 7.004 0 0 1 11.58 2.47 6.817 6.817 0 0 0 7.097.798 6.859 6.859 0 0 0 .236 7.659a6.86 6.86 0 0 0 11.343 5.196 7.07 7.07 0 0 1-1.872-2.764h.33a6.727 6.727 0 0 0 1.657 2.449 6.731 6.731 0 0 0 1.659-2.449h.33a6.937 6.937 0 0 1-1.759 2.656 6.7 6.7 0 0 0 4.368 1.62c3.699 0 6.708-3.009 6.708-6.709C23 3.958 19.992.95 16.292.95v.001zM3.13 9.44l.414-2.618-.936 2.618h-.499l-.061-2.618-.445 2.618H.897l.584-3.477h1.066l.031 2.133.721-2.133H4.45L3.875 9.44H3.13zm2.495 0l.022-.277c-.015 0-.23.338-.752.338-.268 0-.705-.146-.705-.783 0-.813.66-1.081 1.297-1.081.1 0 .314.015.314.015s.023-.046.023-.184c0-.223-.2-.254-.468-.254-.475 0-.798.13-.798.13l.107-.63s.384-.16.883-.16c.26 0 1.005.03 1.005.882l-.284 2.01h-.644V9.44zm2.709-.89c0 .967-.937.928-1.105.928-.614 0-.799-.085-.822-.092l.1-.636c0-.008.307.107.645.107.199 0 .453-.015.453-.253 0-.354-.913-.269-.913-1.106 0-.737.544-.951 1.09-.951.414 0 .674.053.674.053l-.091.645s-.4-.03-.499-.03c-.26 0-.399.052-.399.237 0 .376.868.191.868 1.098h-.001zM9.4 7.306l-.207 1.266c-.016.1.015.238.268.238.061 0 .138-.023.185-.023l-.092.622c-.077.023-.284.092-.545.092-.338 0-.583-.192-.583-.622 0-.292.414-2.67.43-2.686h.73l-.078.43h.36l-.091.683H9.4zm1.772 1.55c.369 0 .775-.176.775-.176l-.13.705s-.238.123-.768.123c-.583 0-1.258-.246-1.258-1.274 0-.89.544-1.681 1.274-1.681.798 0 1.044.583 1.044 1.067 0 .191-.092.668-.092.668h-1.49c0-.016-.137.567.645.567v.001zm2.426-1.42c-.506-.176-.544.799-.76 2.01h-.752l.453-2.824h.683l-.06.407s.245-.445.567-.445a.92.92 0 0 1 .138.007c-.092.2-.185.376-.269.844v.001zm2.096 1.965s-.392.1-.637.1c-.868 0-1.313-.6-1.313-1.512 0-1.374.822-2.103 1.666-2.103.376 0 .821.176.821.176l-.122.775s-.299-.207-.668-.207c-.498 0-.944.476-.944 1.335 0 .423.208.821.722.821.246 0 .606-.176.606-.176l-.13.79-.001.001zm1.756.039l.023-.277c-.016 0-.23.338-.752.338-.268 0-.706-.146-.706-.783 0-.813.66-1.081 1.297-1.081.1 0 .315.015.315.015s.023-.046.023-.184c0-.223-.2-.254-.468-.254-.476 0-.799.13-.799.13l.108-.63s.384-.16.882-.16c.26 0 1.006.03 1.006.882l-.284 2.01c-.008-.007-.645-.007-.645-.007zm1.512.008h-.752l.453-2.825h.683l-.06.407s.245-.446.567-.446c.091 0 .138.008.138.008-.1.2-.185.376-.269.844-.506-.176-.544.807-.76 2.01v.002zm2.234-.008l.03-.26s-.245.306-.683.306c-.606 0-.906-.583-.906-1.182 0-.929.561-1.735 1.228-1.735.43 0 .706.376.706.376l.16-.975h.73l-.56 3.469h-.706zm1.367-.015a.195.195 0 0 1-.108.03.178.178 0 0 1-.107-.03.226.226 0 0 1-.085-.085.187.187 0 0 1-.03-.108c0-.038.007-.077.03-.107a.226.226 0 0 1 .085-.085.187.187 0 0 1 .107-.03c.039 0 .077.007.108.03.038.016.061.046.085.085.023.038.03.069.03.107a.178.178 0 0 1-.03.108.218.218 0 0 1-.085.085zm-.024-.353a.197.197 0 0 0-.183 0 .156.156 0 0 0-.07.069.197.197 0 0 0 0 .183c.016.03.039.054.07.07a.197.197 0 0 0 .183 0 .151.151 0 0 0 .07-.07.197.197 0 0 0 0-.183.156.156 0 0 0-.07-.07zm-.03.284l-.023-.039a.18.18 0 0 0-.039-.053c-.008-.007-.015-.008-.03-.008h-.023v.1h-.038v-.238h.084c.031 0 .047 0 .062.008.014.008.022.016.03.023.008.007.008.022.008.038s-.008.03-.016.046c-.016.016-.03.023-.046.023.008 0 .016.008.023.016.006.008.022.023.038.046l.03.047h-.06v-.01zm-.015-.17c0-.008 0-.016-.008-.016l-.016-.015c-.008 0-.023-.008-.038-.008h-.047v.069h.047c.022 0 .038 0 .046-.008.016-.008.016-.016.016-.023v.001z"
                fill="#fff"
              ></path>
            </svg>
            <svg
              aria-hidden="true"
              focusable="false"
              role="presentation"
              className="w-[50px]"
              viewBox="0 0 36 20"
            >
              <path
                fill="#fff"
                d="M33.691 7.141h2.012l-1.66 7.5h-1.992zM5.332 7.16q.918 0 1.553.674t.381 1.865q-.234 1.152-1.064 1.807t-1.963.654H2.696l-.547 2.48H.001l1.641-7.48h3.691zm19.141 0q.918 0 1.563.674t.391 1.865q-.156.762-.596 1.328t-1.074.85-1.396.283h-1.523l-.527 2.48h-2.148l1.641-7.48h3.672zM8.027 9.055q.098-.02.42-.098t.537-.127.566-.098.684-.049q.547-.02 1.025.078t.879.313.566.645.029 1.016l-.82 3.906H9.94l.137-.586q-.41.41-1.035.586t-1.182.088-.889-.615-.176-1.387q.215-1.016 1.221-1.455t2.744-.439q.059-.293-.059-.469t-.352-.244-.625-.049q-.508.02-1.094.156t-.781.254zm19.18 0q.117-.02.342-.078t.42-.107.439-.088.508-.068.537-.029q.566-.02 1.045.078t.879.313.576.645.039 1.016l-.84 3.906H29.16l.137-.586q-.41.41-1.045.586t-1.201.088-.898-.615-.176-1.387q.137-.703.684-1.123t1.348-.596 1.973-.176q.098-.449-.166-.615t-.869-.146q-.352 0-.762.078t-.713.166-.459.166zM4.004 10.734q.273 0 .537-.137t.449-.371.244-.527q.117-.43-.098-.723t-.625-.293H3.476l-.469 2.051h.996zm19.16 0q.41 0 .781-.303t.469-.732-.127-.723-.615-.293h-1.094l-.43 2.051h1.016zm-9.531-1.933l.801 5.879-1.445 2.461h2.207l4.688-8.34h-2.031L15.9 12.278l-.313-3.477h-1.953zm-3.242 3.887q0-.195.098-.527h-.508q-.918 0-1.172.488-.195.352-.01.586t.537.234q.859-.039 1.055-.781zm19.199 0q.039-.332.117-.527h-.488q-.977 0-1.191.488-.195.352-.01.586t.537.234q.879-.039 1.035-.781z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Footer);
