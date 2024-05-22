import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getmanufecturelist } from "../../action/useraction";

export const useTableSearch = ({ searchVal, retrieve }) => {
  let dispatch = useDispatch();
  useEffect(() => {
    dispatch(getmanufecturelist());
  }, [dispatch]);
  const [manufectureinfo, setManufectureinfo] = useState([]);
  const [origData, setOrigData] = useState([]);
  const [searchIndex, setSearchIndex] = useState([]);
  const [loading, setLoading] = useState(true);

  const manufecturee = useSelector((state) => state.manufecture);
  let { error } = manufecturee;

  useEffect(() => {
    setLoading(true);
    const crawl = (user, allValues) => {
      if (!allValues) allValues = [];
      for (var key in user) {
        if (typeof user[key] === "object") crawl(user[key], allValues);
        else allValues.push(user[key] + " ");
      }
      return allValues;
    };
    const fetchData = async () => {
      const { data: users } = await retrieve();
      setOrigData(users);
      setManufectureinfo(users);
      const searchInd = users.map((user) => {
        const allValues = crawl(user);
        return { allValues: allValues.toString() };
      });
      setSearchIndex(searchInd);
      if (users) setLoading(false);
    };
    fetchData();
  }, [retrieve]);

  useEffect(() => {
    if (searchVal) {
      const reqData = searchIndex.map((user, index) => {
        if (user.allValues.toLowerCase().indexOf(searchVal.toLowerCase()) >= 0)
          return origData[index];
        return null;
      });
      setManufectureinfo(
        reqData.filter((user) => {
          if (user) return true;
          return false;
        })
      );
    } else setManufectureinfo(origData);
  }, [searchVal, origData, searchIndex]);

  return { manufectureinfo, loading };
};
