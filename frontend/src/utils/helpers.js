import icons from "./icons";
const { AiFillStar, AiOutlineStar } = icons;

export const removeAccentAndCreateSlug = (string) =>
  string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .split(" ")
    .join("-");

export const formatMoney = (num) => {
  if (!Number(num)) return;
  return Number(Number(num).toFixed(1)).toLocaleString();
};

export const renderStarFromNumber = (num, size = 16) => {
  // 4 => [1,1,1,1,0]
  // 2 => [1,1,0,0,0]
  if (!Number(num)) num = 5;
  const stars = [];
  for (let i = 0; i < +num; i++)
    stars.push(<AiFillStar color="orange" size={size} />);
  for (let i = 5; i > +num; i--)
    stars.push(<AiOutlineStar color="orange" size={size} />);
  return stars?.map((item, index) => <span key={index}>{item}</span>);
};
