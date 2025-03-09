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
  if (!Number(num)) return;
  const stars = [];
  num = Math.round(num);
  for (let i = 0; i < +num; i++)
    stars.push(<AiFillStar color="orange" size={size} />);
  for (let i = 5; i > +num; i--)
    stars.push(<AiOutlineStar color="orange" size={size} />);
  return stars?.map((item, index) => <span key={index}>{item}</span>);
};

export const validate = (payload = {}, setInvalidFields) => {
  let invalidCount = 0;

  const entries = Object.entries(payload);

  for (const field of entries) {
    if (!field[1].trim()) {
      invalidCount++;
      setInvalidFields((prev) => [
        ...prev,
        {
          name: field[0],
          mes: "This is required",
        },
      ]);
    }

    switch (field[0]) {
      case "email":
        const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!field[1].match(regex)) {
          // eslint-disable-next-line no-loop-func
          invalidCount++;
          setInvalidFields((prev) => [
            ...prev,
            { name: field[0], mes: "Email is incorrect" },
          ]);
        }
        break;
      case "password":
        if (field[1].trim().length < 6) {
          invalidCount++;
          setInvalidFields((prev) => [
            ...prev,
            {
              name: field[0],
              mes: "Password is at least 6 keywords",
            },
          ]);
        }
        break;
      default:
        break;
    }
  }
  return invalidCount;
};

export const convertSlugToNormal = (slug) => {
  return slug.split("_")[0].split("-").join(" ");
};

export const capitalize = (str) => {
  return str
    ?.trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const reducedArray = (arr) => {
  const reducedArray = [
    ...arr.reduce((map, obj) => {
      if (map.has(obj.label)) {
        map.get(obj.label).push(...obj.variants);
      } else {
        map.set(obj.label, obj.variants);
      }
      return map;
    }, new Map()),
  ].map(([label, variants]) => ({ label, variants }));
  return reducedArray;
};

export const compareObjects = (obj1, obj2) => {
  // Check the number of properties in both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  // Compare each property of the two objects
  for (let key of keys1) {
    if (!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
};

export const formatAddress = (json) => {
  if (!json) return;
  const obj = JSON.parse(json);
  return `${obj?.address}, ward ${obj?.ward}, district ${obj?.district}, ${obj?.city}`;
};
