import { useEffect, useRef, useState } from "react";
import axios from "axios";
export default function Address() {
  const token = localStorage.getItem("token");
  const users = JSON.parse(localStorage.getItem("user"));
  const [getProvince, setProvince] = useState([]);
  const [getDistrict, setDistrict] = useState([]);
  const [getWard, setWard] = useState([]);
  const [getNameProvince, setProvinceName] = useState("");
  const [getNameDistrict, setDistrictName] = useState("");
  const [getNameWard, setWardName] = useState("");
  const [getCheckInert, setCheckInert] = useState(false);
  // state giữ id chọn thay vì chỉ name
  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [wardId, setWardId] = useState("");
  const [getOptionAddress, setOptionAddress] = useState([]);
  let address_detail = useRef();

  const emptyAddress = () => {
    setProvinceId("");
    setDistrictId("");
    setWardId("");
    setProvinceName("");
    setDistrictName("");
    setWardName("");
    address_detail.current.value = "";
    setCheckInert(false);
  };

  useEffect(() => {
    const cache_listAddress = JSON.parse(
      localStorage.getItem("cache_listAddress")
    );
    if (cache_listAddress) {
      setOptionAddress(cache_listAddress);
    }
    axios
      .get("http://localhost:8000/api/get-address")
      .then((res) => {
        setOptionAddress(res.data);
        localStorage.setItem("cache_listAddress", JSON.stringify(res.data)); // lưu cache
      })
      .catch(() => {
        setOptionAddress([]);
      }, []);
  }, []);

  useEffect(() => {
    const cache_province = JSON.parse(localStorage.getItem("cache_province"));
    if (cache_province) {
      setProvince(cache_province);
    }

    axios
      .get("http://localhost:8000/api/get-province")
      .then((res) => {
        setProvince(res.data);
        localStorage.setItem("cache_province", JSON.stringify(res.data)); // lưu cache
      })
      .catch(() => {
        setProvince([]);
      }, []);
  }, []);

  const handleDistrict = async (province_id) => {
    setDistrict([]);
    setWard([]);
    setProvinceId(province_id); // <- phải set id tỉnh được chọn

    try {
      const res = await axios.get(
        `http://localhost:8000/api/get-district/${province_id}`
      );
      setDistrict(res.data);
      localStorage.setItem("cache_district", JSON.stringify(res.data));
    } catch (e) {
      console.error("District error:", e);
      setDistrict([]);
    }
  };

  const handleWard = async (district_id) => {
    setWard([]);
    setDistrictId(district_id); // <- phải set id quận được chọn

    try {
      const res = await axios.get(
        `http://localhost:8000/api/get-ward/${district_id}`
      );
      setWard(res.data);
      localStorage.setItem("cache_ward", JSON.stringify(res.data));
    } catch (e) {
      console.error("Ward error:", e);
      setWard([]);
    }
  };

  useEffect(() => {
    if (getNameProvince == "" || getNameDistrict == "" || getNameWard == "") {
      return;
    } else {
      setCheckInert(true);
    }
  }, [getNameProvince, getNameDistrict, getNameWard]);

  const inertAddress = async () => {
    if (getNameProvince == "" || getNameDistrict == "" || getNameWard == "") {
      return;
    }
    let text = address_detail.current.value ?? "";
    console.log(getNameProvince, getNameDistrict, getNameWard);
    console.log(text);

    if (!token && !users) return;
    let user_id = users.id ?? null;
    try {
      const res = await axios.post(
        "http://localhost:8000/api/inert-address-user",
        {
          data: {
            getNameProvince,
            getNameDistrict,
            getNameWard,
            user_id,
            text,
          },
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
        }
      );

      emptyAddress();
      address_detail.current.value = "";

      setOptionAddress(res.data);
      console.log(res.data);
    } catch (e) {
      console.log("Error", e);
    }
  };

  const notSelectAddress = () => {
    emptyAddress();
    address_detail.current.value = "";
  };

  return (
    <>
      <div>
        <select
          className="w-full p-3 border border-gray-300 rounded bg-gray-50"
          name=""
          id=""
        >
          <option value="">Chọn address</option>
          {getOptionAddress.map((e, i) => {
            return (
              <>
                <option className="border border-gray-400 " key={i} value="">
                  {e.address_detail ?? ""} {e.ward_name ?? ""},
                  {e.district_name ?? ""}, {e.province_name ?? ""}
                </option>
              </>
            );
          })}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <select
          className="p-3 border border-gray-300 rounded bg-gray-50"
          value={provinceId}
          onChange={(e) => {
            handleDistrict(e.target.value);
            setProvinceName(e.target.selectedOptions[0].text ?? "");
          }}
        >
          <option value="">Tỉnh thành</option>
          {getProvince.map((e, i) => (
            <option key={i} value={e.province_id}>
              {e.name ?? ""}
            </option>
          ))}
        </select>
        <select
          value={districtId}
          className="p-3 border border-gray-300 rounded bg-gray-50"
          onChange={(e) => {
            handleWard(e.target.value);
            setDistrictName(e.target.selectedOptions[0].text ?? "");
          }}
          disabled={!provinceId}
        >
          <option value="">Quận huyện (tùy chọn)</option>
          {getDistrict.map((e, i) => (
            <option key={i} value={e.district_id}>
              {e.name ?? ""}
            </option>
          ))}
        </select>
        <select
          value={wardId}
          className="p-3 border border-gray-300 rounded bg-gray-50"
          onChange={(e) => {
            setWardId(e.target.value); // <- phải set id xã được chọn
            setWardName(e.target.selectedOptions[0].text ?? "");
          }}
          disabled={!districtId}
        >
          <option value="">Phường xã (tùy chọn)</option>
          {getWard.map((e) => (
            <option key={e.ward_id} value={e.ward_id}>
              {e.name ?? ""}
            </option>
          ))}
        </select>
        <div>
          <textarea
            ref={address_detail ?? ""}
            placeholder="Địa chỉ cụ thể"
            rows={3}
            className="md:w-[795px] w-[470px] p-3 border border-gray-300 rounded"
          />
        </div>
      </div>
      <div className="flex gap-x-2">
        <button
          disabled={!getCheckInert}
          onClick={() => inertAddress()}
          className={` ${!getCheckInert ? "border-gray-600 cursor-not-allowed" : "border-red-600 hover:bg-red-600"} p-2 rounded-md border `}
        >
          Lưu đ/c
        </button>
        <button
          disabled={!getCheckInert}
          onClick={() => notSelectAddress()}
          className={` ${!getCheckInert ? "border-gray-600 cursor-not-allowed" : "border-red-600 hover:bg-red-600"} p-2 rounded-md border `}
        >
          Bỏ đ/c
        </button>
      </div>
    </>
  );
}
